import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const context={window:{}};
const worksPath=path.join(root,'data','works.js');
vm.runInNewContext(fs.readFileSync(worksPath,'utf8'),context,{filename:worksPath});
const works=context.window.KYOKAI_WORKS||[];
const page=fs.readFileSync(path.join(root,'reading-log.html'),'utf8');
const js=fs.readFileSync(path.join(root,'data','reading-backup.js'),'utf8');
const css=fs.readFileSync(path.join(root,'data','reading-log.css'),'utf8');
const errors=[];const warnings=[];

if(works.length!==48)errors.push(`作品データが48件ではありません（${works.length}件）`);
for(const token of ['data-reading-backup','data-backup-export','data-backup-share','data-backup-file','data-backup-preview','data-preview-read','data-preview-saved','data-preview-progress','data-preview-history','data-preview-size','name="backup-mode"','value="merge"','value="replace"','data-backup-confirm','data-backup-cancel','data-backup-message'])if(!page.includes(token))errors.push(`バックアップ画面要素がありません: ${token}`);
for(const asset of ['data/reading-log.css','data/works.js','data/reading-status.js','data/saved-stories.js','data/reading-log.js','data/reading-backup.js'])if(!page.includes(`/kyokai-yawa/${asset}`))errors.push(`バックアップページの資産参照がありません: ${asset}`);
if(page.indexOf('reading-log.js')>page.indexOf('reading-backup.js'))errors.push('バックアップJavaScriptが読書記録JavaScriptより先に読み込まれています');

for(const token of [
  "SCHEMA='kyokai-yawa-reading-backup'",
  'const VERSION=1',
  "SITE='https://allsunday1122.github.io/kyokai-yawa/'",
  'exportedAt:new Date().toISOString()',
  'readStories:',
  'history:collectHistory()',
  'savedStories:collectSaved()',
  'positions:collectPositions()',
  'preferences:{readerSize:',
  'JSON.stringify(payload,null,2)',
  'URL.createObjectURL',
  'navigator.canShare',
  "file.size>256*1024",
  'JSON.parse(await file.text())',
  'validateBackup',
  'sanitizeIds',
  'sanitizeHistory',
  'sanitizeSaved',
  'sanitizePositions',
  "mode==='replace'",
  'maxHistory',
  'Math.max(local,imported)',
  "confirm('現在の読書記録",
  'setTimeout(()=>location.reload()',
])if(!js.includes(token))errors.push(`バックアップ処理がありません: ${token}`);

for(const rejected of [
  '境界夜話の読書記録バックアップではありません。',
  '対応していないバックアップ形式です',
  '未知の作品IDがあります。',
  '途中位置に不正な作品IDまたは値があります。',
  'ファイルが大きすぎます。256KB以下',
])if(!js.includes(rejected))errors.push(`不正ファイルの拒否処理がありません: ${rejected}`);

for(const risky of ['fetch(','sendBeacon','XMLHttpRequest','WebSocket','eval('])if(js.includes(risky))errors.push(`バックアップJavaScriptに外部通信または危険な実行処理があります: ${risky}`);
if(!js.includes('localStorage.getItem')||!js.includes('localStorage.setItem')||!js.includes('localStorage.removeItem'))errors.push('localStorageの読取・書込・削除処理が不足しています');
if(!css.includes('.backup-panel')||!css.includes('.backup-preview')||!css.includes('.backup-modes')||!css.includes('@media(max-width:620px)'))errors.push('バックアップ画面またはスマートフォン向けCSSが不足しています');
if(!page.includes('作品本文、氏名、メールアドレス、アカウント情報は含まれません'))warnings.push('バックアップに含まれない情報の説明がありません');
if(!page.includes('現在の記録へ追加')||!page.includes('バックアップ内容で置換'))errors.push('復元方式の説明が不足しています');

const report=['# 境界夜話 読書記録バックアップ監査','',
`- 公開作品: ${works.length}/48`,
'- 書き出し形式: JSON',
'- 形式識別: `kyokai-yawa-reading-backup` version 1',
'- 収録データ: 読了・閲覧/読了時刻・あとで読む・途中位置・文字サイズ',
'- 復元前確認: 書き出し日時と5種類の件数・設定',
'- 復元方式: 現在の記録へ追加 / バックアップ内容で置換',
'- 不正ファイル拒否: サイト・形式番号・作品ID・値範囲・256KB上限',
'- 置換時の再確認: あり',
'- 対応端末での共有: あり',
'- 外部送信: なし',
`- エラー: ${errors.length}`,`- 警告: ${warnings.length}`,'','## エラー','',...(errors.length?errors.map(error=>`- ${error}`):['- なし']),'','## 警告','',...(warnings.length?warnings.map(warning=>`- ${warning}`):['- なし']),''].join('\n');
fs.mkdirSync(path.join(root,'reports'),{recursive:true});
fs.writeFileSync(path.join(root,'reports','reading-backup-audit.md'),report);
console.log(report);
if(errors.length)process.exitCode=1;
