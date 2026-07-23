import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const reportsDir=path.join(root,'reports');
const historyPath=path.join(reportsDir,'public-monitoring-history.json');
const summaryPath=path.join(reportsDir,'public-monitoring-summary.md');
const MAX_PER_KIND=30;

const sources=[
  {kind:'reading',label:'読書機能・54ページ品質',file:'reading-public-browser-audit.md'},
  {kind:'site-health',label:'54ページ品質（単独確認）',file:'site-public-health-audit.md',optional:true},
  {kind:'offline',label:'オフライン・PWA',file:'offline-public-browser-audit.md'},
  {kind:'incident-config',label:'障害Issue通知設定',file:'public-audit-incident-workflow-audit.md'},
];

const read=file=>{
  const full=path.join(reportsDir,file);
  return fs.existsSync(full)?fs.readFileSync(full,'utf8'):'';
};
const field=(text,label)=>text.match(new RegExp(`^- ${label}:\\s*(.+)$`,'m'))?.[1]?.trim()||'';
const numberField=(text,label)=>{
  const value=field(text,label).match(/-?\d+(?:\.\d+)?/)?.[0];
  return value===undefined?null:Number(value);
};
const iso=value=>{
  const ms=Date.parse(value);
  return Number.isFinite(ms)?new Date(ms).toISOString():null;
};

const parseSource=source=>{
  const text=read(source.file);
  if(!text)return source.optional?null:{...source,missing:true};
  const executedAt=iso(field(text,'実行日時'))||new Date().toISOString();
  const statusText=field(text,'テスト結果');
  const failed=numberField(text,'失敗')??numberField(text,'エラー')??0;
  const warnings=numberField(text,'警告')??0;
  const passed=numberField(text,'成功');
  const skipped=numberField(text,'スキップ');
  const durationSeconds=numberField(text,'所要時間');
  const status=(statusText==='passed'||(!statusText&&failed===0))?'passed':'failed';
  return {
    kind:source.kind,
    label:source.label,
    source:source.file,
    executedAt,
    status,
    passed,
    failed,
    skipped,
    warnings,
    durationSeconds,
  };
};

fs.mkdirSync(reportsDir,{recursive:true});
let history={version:1,updatedAt:null,entries:[]};
if(fs.existsSync(historyPath)){
  try{
    const parsed=JSON.parse(fs.readFileSync(historyPath,'utf8'));
    if(parsed&&parsed.version===1&&Array.isArray(parsed.entries))history=parsed;
  }catch{}
}

const current=sources.map(parseSource).filter(Boolean);
const missing=current.filter(item=>item.missing);
if(missing.length)throw new Error(`必須監査レポートがありません: ${missing.map(item=>item.file).join(', ')}`);

const merged=[...history.entries,...current]
  .filter(item=>item&&item.kind&&item.executedAt)
  .sort((a,b)=>Date.parse(b.executedAt)-Date.parse(a.executedAt));
const seen=new Set();
const deduped=[];
for(const item of merged){
  const key=`${item.kind}:${item.executedAt}`;
  if(seen.has(key))continue;
  seen.add(key);deduped.push(item);
}
const entries=[];
for(const kind of [...new Set(deduped.map(item=>item.kind))])entries.push(...deduped.filter(item=>item.kind===kind).slice(0,MAX_PER_KIND));
entries.sort((a,b)=>Date.parse(b.executedAt)-Date.parse(a.executedAt));
history={version:1,updatedAt:new Date().toISOString(),entries};
fs.writeFileSync(historyPath,JSON.stringify(history,null,2)+'\n');

const latestByKind=new Map();
for(const item of entries)if(!latestByKind.has(item.kind))latestByKind.set(item.kind,item);
const consecutivePasses=kind=>{
  let count=0;
  for(const item of entries.filter(entry=>entry.kind===kind).sort((a,b)=>Date.parse(b.executedAt)-Date.parse(a.executedAt))){
    if(item.status!=='passed')break;
    count++;
  }
  return count;
};
const formatJst=value=>new Intl.DateTimeFormat('ja-JP',{timeZone:'Asia/Tokyo',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date(value));
const display=value=>value===null||value===undefined?'—':String(value);
const currentFailed=[...latestByKind.values()].filter(item=>item.status!=='passed'||item.failed>0);
const overall=currentFailed.length?'要確認':'正常';
const rows=[...latestByKind.values()].sort((a,b)=>a.label.localeCompare(b.label,'ja'));
const recent=entries.slice(0,20);
const summary=[
  '# 境界夜話 公開監視サマリー',
  '',
  `- 更新日時: ${formatJst(history.updatedAt)} JST`,
  `- 総合状態: ${overall}`,
  `- 監視種別: ${rows.length}`,
  `- 現在の失敗監査: ${currentFailed.length}`,
  `- 履歴保持: 監査ごとに直近${MAX_PER_KIND}回`,
  '',
  '## 最新状態',
  '',
  '| 監査 | 状態 | 実行日時（JST） | 成功 | 失敗 | 警告 | 所要時間 | 連続成功 |',
  '|---|---|---|---:|---:|---:|---:|---:|',
  ...rows.map(item=>`| ${item.label} | ${item.status==='passed'?'正常':'失敗'} | ${formatJst(item.executedAt)} | ${display(item.passed)} | ${display(item.failed)} | ${display(item.warnings)} | ${item.durationSeconds===null?'—':`${item.durationSeconds}秒`} | ${consecutivePasses(item.kind)}回 |`),
  '',
  '## 直近20件',
  '',
  '| 実行日時（JST） | 監査 | 状態 | 成功 | 失敗 | 所要時間 |',
  '|---|---|---|---:|---:|---:|',
  ...recent.map(item=>`| ${formatJst(item.executedAt)} | ${item.label} | ${item.status==='passed'?'正常':'失敗'} | ${display(item.passed)} | ${display(item.failed)} | ${item.durationSeconds===null?'—':`${item.durationSeconds}秒`} |`),
  '',
  '## 判定',
  '',
  ...(currentFailed.length?currentFailed.map(item=>`- ${item.label}: 最新監査が失敗しています。`):['- 全監査の最新結果は正常です。']),
  '',
].join('\n');
fs.writeFileSync(summaryPath,summary);
console.log(summary);
if(currentFailed.length)process.exitCode=1;
