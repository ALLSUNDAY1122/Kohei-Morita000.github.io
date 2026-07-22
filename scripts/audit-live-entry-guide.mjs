import fs from 'node:fs';
import path from 'node:path';
import {performance} from 'node:perf_hooks';

const base='https://allsunday1122.github.io/kyokai-yawa/';
const errors=[];
const warnings=[];
const rows=[];

const fetchText=async(label,url,expectedType)=>{
  const start=performance.now();
  const response=await fetch(url,{redirect:'follow',cache:'no-store',headers:{'cache-control':'no-cache'}});
  const body=await response.text();
  const ms=Math.round(performance.now()-start);
  const type=response.headers.get('content-type')||'';
  rows.push({label,status:response.status,type,ms});
  if(!response.ok)errors.push(`${label}: HTTP ${response.status}`);
  if(expectedType&&!type.includes(expectedType))errors.push(`${label}: Content-Typeが${expectedType}ではありません（${type||'なし'}）`);
  return body;
};

const html=await fetchText('トップページ',base,'text/html');
const css=await fetchText('初読者向けCSS',`${base}data/entry-guide.css`,'text/css');
const block=html.match(/<!-- ENTRY_GUIDE_START -->([\s\S]*?)<!-- ENTRY_GUIDE_END -->/)?.[1]||'';
if(!block)errors.push('トップページに初読者向けsectionがありません');
if(!html.includes('<a href="#start">初めての方</a>'))errors.push('主要メニューに初読者向け導線がありません');
if(!html.includes('/kyokai-yawa/data/entry-guide.css'))errors.push('トップページにentry-guide.css参照がありません');

const targets=[
['真壁夜話案内','series/makabe.html'],['黒瀬蒐集録案内','series/kurose.html'],['榊家異聞案内','series/sakaki.html'],['境界観測記案内','series/kansoku.html'],
['MKB-001','stories/mkb-001-taikin-kiroku-2514.html'],['KRS-001','stories/krs-001-sanbonme-no-sakaigi.html'],['SKK-001','stories/skk-001-butsuma-no-natsufuku.html'],['KKS-S1E01','stories/kks-s1e01-sakaime-no-heya.html']
];
for(const [label,relative] of targets){
  const href=`/kyokai-yawa/${relative}`;
  if(!block.includes(`href="${href}"`))errors.push(`トップページ: ${label}への静的リンクがありません`);
  await fetchText(label,`${base}${relative}`,'text/html');
}
for(const token of ['.entry-choice-grid','.entry-choice-actions','min-height:44px'])if(!css.includes(token))errors.push(`公開CSSに${token}がありません`);

const times=rows.map(row=>row.ms).sort((a,b)=>a-b);
const median=times.length?times[Math.floor(times.length/2)]:0;
const p95=times.length?times[Math.min(times.length-1,Math.ceil(times.length*.95)-1)]:0;
const report=[
'# 境界夜話 本番初読者向けおすすめ入口監査','',
`- 実行日時: ${new Date().toISOString()}`,
'- 比較カード: 4件',
'- シリーズ案内: 4件',
'- 代表作: 4件',
`- エラー: ${errors.length}`,
`- 警告: ${warnings.length}`,
`- 応答時間中央値: ${median}ms`,
`- 応答時間p95: ${p95}ms`,'',
'## エラー','',...(errors.length?errors.map(error=>`- ${error}`):['- なし']),'',
'## 警告','',...(warnings.length?warnings.map(warning=>`- ${warning}`):['- なし']),'',
'## 配信確認','',
'| 対象 | HTTP | Content-Type | 応答 |','|---|---:|---|---:|',
...rows.map(row=>`| ${row.label} | ${row.status} | ${row.type} | ${row.ms}ms |`),''].join('\n');
fs.mkdirSync(path.join(process.cwd(),'reports'),{recursive:true});
fs.writeFileSync(path.join(process.cwd(),'reports','live-entry-guide-audit.md'),report);
console.log(report);
if(errors.length)process.exitCode=1;
