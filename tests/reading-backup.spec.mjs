import { test, expect } from '@playwright/test';
import fs from 'node:fs/promises';

const READ_KEY='kyokai-yawa-read-stories-v1';
const HISTORY_KEY='kyokai-yawa-reading-history-v1';
const SAVED_KEY='kyokai-yawa-saved-stories-v1';
const SIZE_KEY='kyokai-yawa-reader-size';
const POSITION_PREFIX='kyokai-yawa-reader-position:';
const SITE='https://allsunday1122.github.io/kyokai-yawa/';
const positionKey=file=>`${POSITION_PREFIX}/kyokai-yawa/stories/${file}`;

const makeBackup=overrides=>({
  schema:'kyokai-yawa-reading-backup',
  version:1,
  site:SITE,
  app:'境界夜話',
  exportedAt:new Date().toISOString(),
  data:{
    readStories:[],
    history:{visits:{},completions:{}},
    savedStories:{ids:[],savedAt:{}},
    positions:{},
    preferences:{readerSize:'standard'},
    ...overrides,
  },
});

async function seedStorage(page,entries){
  await page.addInitScript(({entries})=>{
    if(sessionStorage.getItem('__kyokai_e2e_seeded'))return;
    localStorage.clear();
    for(const [key,value] of Object.entries(entries))localStorage.setItem(key,value);
    sessionStorage.setItem('__kyokai_e2e_seeded','1');
  },{entries});
}

async function openLog(page){
  await page.goto('reading-log.html');
  await expect(page.locator('[data-reading-log-grid] .log-card')).toHaveCount(48);
}

async function importBackup(page,payload,name='backup.json'){
  await page.locator('[data-backup-file]').setInputFiles({
    name,
    mimeType:'application/json',
    buffer:Buffer.from(typeof payload==='string'?payload:JSON.stringify(payload)),
  });
}

async function restoreAndReload(page,mode='merge'){
  await page.locator(`[name="backup-mode"][value="${mode}"]`).check();
  if(mode==='replace')page.once('dialog',dialog=>dialog.accept());
  const loaded=page.waitForEvent('load');
  await page.locator('[data-backup-confirm]').click();
  await loaded;
  await expect(page.locator('[data-reading-log-grid] .log-card')).toHaveCount(48);
}

async function storage(page,keys){
  return page.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),keys);
}

test('JSON書き出しに読了・履歴・保存・途中位置・文字サイズを収録する',async({page},testInfo)=>{
  const now=Date.now()-60_000;
  await seedStorage(page,{
    [READ_KEY]:JSON.stringify(['MKB-001','KRS-002']),
    [HISTORY_KEY]:JSON.stringify({visits:{'MKB-001':now},completions:{'KRS-002':now+1000}}),
    [SAVED_KEY]:JSON.stringify({ids:['SKK-003'],savedAt:{'SKK-003':now+2000}}),
    [positionKey('kks-s1e01-sakaime-no-heya.html')]:'0.4567',
    [SIZE_KEY]:'large',
  });
  await openLog(page);
  const downloadPromise=page.waitForEvent('download');
  await page.locator('[data-backup-export]').click();
  const download=await downloadPromise;
  expect(download.suggestedFilename()).toMatch(/^kyokai-yawa-reading-backup-\d{8}-\d{6}Z\.json$/);
  const output=testInfo.outputPath(download.suggestedFilename());
  await download.saveAs(output);
  const raw=await fs.readFile(output,'utf8');
  const backup=JSON.parse(raw);
  expect(backup).toMatchObject({schema:'kyokai-yawa-reading-backup',version:1,site:SITE,app:'境界夜話'});
  expect(Object.keys(backup).sort()).toEqual(['app','data','exportedAt','schema','site','version']);
  expect(backup.data.readStories.sort()).toEqual(['KRS-002','MKB-001']);
  expect(backup.data.history.visits['MKB-001']).toBe(now);
  expect(backup.data.history.completions['KRS-002']).toBe(now+1000);
  expect(backup.data.savedStories.ids).toEqual(['SKK-003']);
  expect(backup.data.positions['KKS-S1E01']).toBe(0.4567);
  expect(backup.data.preferences.readerSize).toBe('large');
  await expect(page.locator('[data-backup-message]')).toContainText('書き出しました');
});

test('追加復元で現在記録を残し、より進んだ途中位置と画面件数を反映する',async({page})=>{
  const now=Date.now()-120_000;
  await seedStorage(page,{
    [READ_KEY]:JSON.stringify(['MKB-001']),
    [HISTORY_KEY]:JSON.stringify({visits:{'MKB-001':now},completions:{}}),
    [SAVED_KEY]:JSON.stringify({ids:['MKB-002'],savedAt:{'MKB-002':now}}),
    [positionKey('kks-s1e01-sakaime-no-heya.html')]:'0.7000',
    [SIZE_KEY]:'small',
  });
  await openLog(page);
  const incoming=makeBackup({
    readStories:['KRS-001'],
    history:{visits:{'KRS-001':now+10_000},completions:{'KRS-001':now+20_000}},
    savedStories:{ids:['SKK-001'],savedAt:{'SKK-001':now+30_000}},
    positions:{'KKS-S1E01':0.42,'MKB-003':0.33},
    preferences:{readerSize:'large'},
  });
  await importBackup(page,incoming);
  await expect(page.locator('[data-backup-preview]')).toBeVisible();
  await expect(page.locator('[data-preview-read]')).toHaveText('1話');
  await expect(page.locator('[data-preview-saved]')).toHaveText('1話');
  await restoreAndReload(page,'merge');
  const values=await storage(page,[READ_KEY,HISTORY_KEY,SAVED_KEY,positionKey('kks-s1e01-sakaime-no-heya.html'),positionKey('mkb-003-kyoyu-gamen-no-goninme.html'),SIZE_KEY]);
  expect(JSON.parse(values[READ_KEY]).sort()).toEqual(['KRS-001','MKB-001']);
  expect(JSON.parse(values[HISTORY_KEY]).visits).toMatchObject({'MKB-001':now,'KRS-001':now+10_000});
  expect(JSON.parse(values[SAVED_KEY]).ids.sort()).toEqual(['MKB-002','SKK-001']);
  expect(Number(values[positionKey('kks-s1e01-sakaime-no-heya.html')])).toBeCloseTo(0.7,4);
  expect(Number(values[positionKey('mkb-003-kyoyu-gamen-no-goninme.html')])).toBeCloseTo(0.33,4);
  expect(values[SIZE_KEY]).toBe('large');
  await expect(page.locator('[data-count-read]')).toHaveText('2話');
  await expect(page.locator('[data-count-saved]')).toHaveText('2話');
  await expect(page.locator('[data-count-progress]')).toHaveText('2話');
});

test('置換復元で旧記録と旧途中位置を消し、バックアップ状態だけを表示する',async({page})=>{
  const now=Date.now()-180_000;
  await seedStorage(page,{
    [READ_KEY]:JSON.stringify(['MKB-001','MKB-002']),
    [HISTORY_KEY]:JSON.stringify({visits:{'MKB-001':now},completions:{'MKB-002':now+1000}}),
    [SAVED_KEY]:JSON.stringify({ids:['MKB-003'],savedAt:{'MKB-003':now+2000}}),
    [positionKey('kks-s1e01-sakaime-no-heya.html')]:'0.6500',
    [SIZE_KEY]:'large',
  });
  await openLog(page);
  const incoming=makeBackup({
    readStories:['KRS-001'],
    history:{visits:{'KRS-001':now+10_000},completions:{'KRS-001':now+20_000}},
    savedStories:{ids:['SKK-002'],savedAt:{'SKK-002':now+30_000}},
    positions:{'KRS-002':0.55},
    preferences:{readerSize:'standard'},
  });
  await importBackup(page,incoming);
  await restoreAndReload(page,'replace');
  const oldPosition=positionKey('kks-s1e01-sakaime-no-heya.html');
  const newPosition=positionKey('krs-002-shiomachi-no-ishidan.html');
  const values=await storage(page,[READ_KEY,HISTORY_KEY,SAVED_KEY,oldPosition,newPosition,SIZE_KEY]);
  expect(JSON.parse(values[READ_KEY])).toEqual(['KRS-001']);
  expect(JSON.parse(values[HISTORY_KEY])).toEqual(incoming.data.history);
  expect(JSON.parse(values[SAVED_KEY]).ids).toEqual(['SKK-002']);
  expect(values[oldPosition]).toBeNull();
  expect(Number(values[newPosition])).toBeCloseTo(0.55,4);
  expect(values[SIZE_KEY]).toBe('standard');
  await expect(page.locator('[data-count-read]')).toHaveText('1話');
  await expect(page.locator('[data-count-saved]')).toHaveText('1話');
  await expect(page.locator('[data-count-progress]')).toHaveText('1話');
});

test('壊れたJSONを拒否し、現在の記録を変更しない',async({page})=>{
  const original=JSON.stringify(['MKB-001']);
  await seedStorage(page,{[READ_KEY]:original});
  await openLog(page);
  await importBackup(page,'{"schema":');
  await expect(page.locator('[data-backup-message]')).toHaveAttribute('data-type','error');
  await expect(page.locator('[data-backup-preview]')).toBeHidden();
  await expect(page.locator('[data-backup-confirm]')).toBeDisabled();
  expect((await storage(page,[READ_KEY]))[READ_KEY]).toBe(original);
});

test('未知の作品IDを含むJSONを拒否し、復元確認を表示しない',async({page})=>{
  const original=JSON.stringify(['MKB-001']);
  await seedStorage(page,{[READ_KEY]:original});
  await openLog(page);
  await importBackup(page,makeBackup({readStories:['UNKNOWN-999']}));
  await expect(page.locator('[data-backup-message]')).toContainText('未知の作品ID');
  await expect(page.locator('[data-backup-message]')).toHaveAttribute('data-type','error');
  await expect(page.locator('[data-backup-preview]')).toBeHidden();
  expect((await storage(page,[READ_KEY]))[READ_KEY]).toBe(original);
});

test('モバイル幅でバックアップ操作が横にはみ出さずタップできる',async({page},testInfo)=>{
  test.skip(testInfo.project.name!=='webkit-mobile','モバイルWebKit専用');
  await openLog(page);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);
  expect(overflow).toBeLessThanOrEqual(1);
  await expect(page.locator('[data-backup-export]')).toBeVisible();
  await expect(page.locator('.backup-file')).toBeVisible();
  const exportBox=await page.locator('[data-backup-export]').boundingBox();
  const fileBox=await page.locator('.backup-file').boundingBox();
  expect(exportBox?.height||0).toBeGreaterThanOrEqual(40);
  expect(fileBox?.height||0).toBeGreaterThanOrEqual(40);
});
