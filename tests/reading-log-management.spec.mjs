import { test, expect } from '@playwright/test';

const READ_KEY='kyokai-yawa-read-stories-v1';
const HISTORY_KEY='kyokai-yawa-reading-history-v1';
const SAVED_KEY='kyokai-yawa-saved-stories-v1';
const POSITION_PREFIX='kyokai-yawa-reader-position:';
const positionKey=file=>`${POSITION_PREFIX}/kyokai-yawa/stories/${file}`;

async function seedStorage(page,entries={}){
  await page.addInitScript(({entries})=>{
    localStorage.clear();
    for(const [key,value] of Object.entries(entries))localStorage.setItem(key,value);
  },{entries});
}

async function openLog(page,path='reading-log.html'){
  await page.goto(path);
  await expect(page.locator('[data-reading-log-grid] .log-card')).not.toHaveCount(0);
}

async function visibleLogIds(page){
  return page.locator('[data-reading-log-grid] .log-card').evaluateAll(cards=>cards.map(card=>card.dataset.logId));
}

test('読書記録で検索・シリーズ・保存状態・公開順を組み合わせ、URLと件数を同期する',async({page})=>{
  const now=Date.now()-60_000;
  await seedStorage(page,{
    [SAVED_KEY]:JSON.stringify({ids:['MKB-007'],savedAt:{'MKB-007':now}}),
  });

  await openLog(page,'reading-log.html?q=MKB-007&series=%E7%9C%9F%E5%A3%81%E5%A4%9C%E8%A9%B1&state=saved&sort=public');
  await expect(page.getByLabel('作品検索')).toHaveValue('MKB-007');
  await expect(page.getByLabel('シリーズで絞り込み')).toHaveValue('真壁夜話');
  await expect(page.getByLabel('状態で絞り込み')).toHaveValue('saved');
  await expect(page.getByLabel('並べ替え')).toHaveValue('public');
  await expect(page.locator('[data-log-result]')).toHaveText('1話を表示中（全48話）');
  expect(await visibleLogIds(page)).toEqual(['MKB-007']);

  const url=new URL(page.url());
  expect(url.searchParams.get('q')).toBe('MKB-007');
  expect(url.searchParams.get('series')).toBe('真壁夜話');
  expect(url.searchParams.get('state')).toBe('saved');
  expect(url.searchParams.get('sort')).toBe('public');
});

test('読書記録カードから読了とあとで読むを変更し、集計と絞り込みへ即時反映する',async({page})=>{
  await seedStorage(page);
  await openLog(page,'reading-log.html?q=MKB-001');

  const card=page.locator('[data-log-id="MKB-001"]');
  await expect(card).toBeVisible();
  await card.getByRole('button',{name:'読了済みにする'}).click();
  await expect(page.locator('[data-count-read]')).toHaveText('1話');
  await expect(card.locator('.log-card__state')).toHaveText('読了済み');
  await expect(card.getByRole('button',{name:'未読に戻す'})).toHaveAttribute('aria-pressed','true');

  await card.getByRole('button',{name:'あとで読むに保存'}).click();
  await expect(page.locator('[data-count-saved]')).toHaveText('1話');
  await expect(card.getByRole('button',{name:'あとで読むから外す'})).toHaveAttribute('aria-pressed','true');

  await page.getByLabel('状態で絞り込み').selectOption('read');
  await expect(page.locator('[data-log-result]')).toHaveText('1話を表示中（全48話）');
  expect(await visibleLogIds(page)).toEqual(['MKB-001']);

  const values=await page.evaluate(keys=>Object.fromEntries(keys.map(key=>[key,localStorage.getItem(key)])),[READ_KEY,SAVED_KEY]);
  expect(JSON.parse(values[READ_KEY])).toContain('MKB-001');
  expect(JSON.parse(values[SAVED_KEY]).ids).toContain('MKB-001');
});

test('途中までの作品だけを表示し、保存位置から再開して条件をリセットする',async({page})=>{
  const now=Date.now()-30_000;
  await seedStorage(page,{
    [HISTORY_KEY]:JSON.stringify({visits:{'MKB-003':now},completions:{}}),
    [positionKey('mkb-003-kyoyu-gamen-no-goninme.html')]:'0.4200',
  });

  await openLog(page,'reading-log.html?state=progress&sort=recent');
  await expect(page.locator('[data-count-progress]')).toHaveText('1話');
  await expect(page.locator('[data-log-result]')).toHaveText('1話を表示中（全48話）');
  expect(await visibleLogIds(page)).toEqual(['MKB-003']);

  const card=page.locator('[data-log-id="MKB-003"]');
  await expect(card.locator('.log-card__state')).toHaveText('途中 42%');
  await expect(card.locator('a.primary')).toHaveText('続きから読む');
  await expect(card.locator('a.primary')).toHaveAttribute('href',/mkb-003-kyoyu-gamen-no-goninme\.html\?resume=1#story$/);

  await page.getByRole('button',{name:'条件をリセット'}).click();
  await expect(page.locator('[data-log-result]')).toHaveText('48話を表示中（全48話）');
  await expect(page.locator('[data-reading-log-grid] .log-card')).toHaveCount(48);
  const url=new URL(page.url());
  for(const key of ['q','series','state','sort'])expect(url.searchParams.has(key)).toBe(false);
});
