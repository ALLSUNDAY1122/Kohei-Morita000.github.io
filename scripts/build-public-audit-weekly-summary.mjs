import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

const root=process.cwd();
const outputPath=path.join(root,'reports','public-audit-weekly-summary.md');
const periodDays=7;
const now=new Date();
const periodStart=new Date(now.getTime()-periodDays*24*60*60*1000);
const futureLimit=new Date(now.getTime()+24*60*60*1000);

const sources=[
  {key:'reading',label:'読書機能',file:'reports/reading-public-browser-audit.md'},
  {key:'health',label:'アクセシビリティ・実行時品質',file:'reports/site-public-health-audit.md'},
  {key:'offline',label:'オフライン・PWA',file:'reports/offline-public-browser-audit.md'},
];

const runGit=args=>execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();
const lineValue=(text,label)=>text.match(new RegExp(`^- ${label}:\\s*(.+)$`,'m'))?.[1]?.trim()||'';
const numberValue=(text,label)=>Number.parseInt(lineValue(text,label),10)||0;
const durationValue=text=>Number.parseFloat(lineValue(text,'所要時間').replace('秒',''))||0;
const retryValue=text=>[...text.matchAll(/再試行(\d+)/g)].reduce((total,match)=>total+Number(match[1]||0),0);
const median=values=>{
  if(!values.length)return 0;
  const sorted=[...values].sort((a,b)=>a-b);
  const middle=Math.floor(sorted.length/2);
  return sorted.length%2?sorted[middle]:(sorted[middle-1]+sorted[middle])/2;
};
const formatSeconds=value=>value?`${value.toFixed(1)}秒`:'—';
const formatJst=date=>new Date(date.getTime()+9*60*60*1000).toISOString().replace('T',' ').slice(0,16)+' JST';
const statusJa=status=>status==='passed'?'成功':status==='failed'?'失敗':status||'不明';

const readSnapshot=(sha,file)=>{
  try{return runGit(['show',`${sha}:${file}`]);}catch{return '';}
};

const records=[];
for(const source of sources){
  let commits=[];
  try{
    commits=runGit(['log','--all','--format=%H','--',source.file]).split(/\r?\n/).filter(Boolean).slice(0,250);
  }catch{
    commits=[];
  }
  const seen=new Set();
  for(const sha of commits){
    const text=readSnapshot(sha,source.file);
    if(!text)continue;
    const timestampRaw=lineValue(text,'実行日時');
    const timestamp=new Date(timestampRaw);
    if(!Number.isFinite(timestamp.getTime()))continue;
    if(timestamp<periodStart||timestamp>futureLimit)continue;
    const dedupeKey=`${source.key}:${timestamp.toISOString()}`;
    if(seen.has(dedupeKey))continue;
    seen.add(dedupeKey);
    records.push({
      source:source.key,
      label:source.label,
      file:source.file,
      sha,
      timestamp,
      status:lineValue(text,'テスト結果')||'unknown',
      passed:numberValue(text,'成功'),
      failed:numberValue(text,'失敗'),
      skipped:numberValue(text,'スキップ'),
      duration:durationValue(text),
      retries:retryValue(text),
    });
  }
}

records.sort((a,b)=>a.timestamp-b.timestamp);
const grouped=new Map(sources.map(source=>[source.key,records.filter(record=>record.source===source.key)]));
const totalRuns=records.length;
const successfulRuns=records.filter(record=>record.status==='passed'&&record.failed===0).length;
const failedRuns=records.filter(record=>record.status!=='passed'||record.failed>0).length;
const retryRuns=records.filter(record=>record.retries>0).length;
const totalRetries=records.reduce((sum,record)=>sum+record.retries,0);
const latestRecords=sources.map(source=>grouped.get(source.key)?.at(-1)).filter(Boolean);
const allLatestHealthy=latestRecords.length===sources.length&&latestRecords.every(record=>record.status==='passed'&&record.failed===0);

const rows=sources.map(source=>{
  const items=grouped.get(source.key)||[];
  const latest=items.at(-1);
  const durations=items.map(item=>item.duration).filter(value=>value>0);
  const first=items[0];
  let trend='—';
  if(first&&latest&&items.length>1&&first.duration>0){
    const percent=((latest.duration-first.duration)/first.duration)*100;
    trend=`${percent>0?'+':''}${percent.toFixed(1)}%`;
  }
  return `| ${source.label} | ${items.length} | ${items.filter(item=>item.status==='passed'&&item.failed===0).length} | ${items.filter(item=>item.status!=='passed'||item.failed>0).length} | ${items.reduce((sum,item)=>sum+item.retries,0)} | ${formatSeconds(median(durations))} | ${formatSeconds(durations.length?Math.max(...durations):0)} | ${latest?formatSeconds(latest.duration):'—'} | ${trend} |`;
});

const incidents=records.filter(record=>record.status!=='passed'||record.failed>0||record.retries>0).sort((a,b)=>b.timestamp-a.timestamp);
const incidentLines=incidents.length?incidents.map(record=>`- ${formatJst(record.timestamp)}｜${record.label}｜${statusJa(record.status)}｜失敗${record.failed}件・再試行${record.retries}回｜${record.sha.slice(0,8)}`):['- なし'];
const latestLines=sources.map(source=>{
  const latest=grouped.get(source.key)?.at(-1);
  if(!latest)return `- ${source.label}: 集計期間内の記録なし`;
  return `- ${source.label}: ${statusJa(latest.status)}（失敗${latest.failed}件・再試行${latest.retries}回、${formatSeconds(latest.duration)}、${formatJst(latest.timestamp)}）`;
});

const report=[
  '# 境界夜話 公開監査 週次サマリー',
  '',
  `- 生成日時: ${formatJst(now)}`,
  `- 集計期間: ${formatJst(periodStart)} 〜 ${formatJst(now)}`,
  `- 対象監査: ${sources.map(source=>source.label).join(' / ')}`,
  `- 実行記録: ${totalRuns}件`,
  `- 成功実行: ${successfulRuns}件`,
  `- 失敗実行: ${failedRuns}件`,
  `- 再試行発生: ${retryRuns}実行・合計${totalRetries}回`,
  `- 直近状態: ${allLatestHealthy?'3監査すべて正常':'要確認'}`,
  '- 集計元: Git履歴内の監査Markdown（外部分析サービス不使用）',
  '',
  '## 監査別集計',
  '',
  '| 監査 | 実行 | 成功 | 失敗 | 再試行 | 中央値 | 最大 | 最新 | 期間内変化 |',
  '|---|---:|---:|---:|---:|---:|---:|---:|---:|',
  ...rows,
  '',
  '## 失敗・再試行履歴',
  '',
  ...incidentLines,
  '',
  '## 直近結果',
  '',
  ...latestLines,
  '',
].join('\n');

fs.mkdirSync(path.dirname(outputPath),{recursive:true});
fs.writeFileSync(outputPath,report);
console.log(report);
