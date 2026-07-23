import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const errors=[];
const warnings=[];
const read=file=>fs.existsSync(path.join(root,file))?fs.readFileSync(path.join(root,file),'utf8'):'';

const builderPath='scripts/build-public-audit-weekly-summary.mjs';
const workflowPath='.github/workflows/public-audit-weekly-summary.yml';
const summaryPath='reports/public-audit-weekly-summary.md';
const performancePath='reports/public-audit-weekly-performance.json';
const builder=read(builderPath);
const workflow=read(workflowPath);
const summary=read(summaryPath);
const performanceText=read(performancePath);

for(const [file,text] of [[builderPath,builder],[workflowPath,workflow],[summaryPath,summary],[performancePath,performanceText]])if(!text)errors.push(`${file}が存在しないか空です`);

const builderTokens=[
  'periodDays=7',
  'durationRatioThreshold=1.5',
  'retryRateThreshold=0.25',
  'git',
  "['log','--all','--format=%H'",
  "['show',`${sha}:${file}`]",
  'reports/reading-public-browser-audit.md',
  'reports/site-public-health-audit.md',
  'reports/offline-public-browser-audit.md',
  'public-audit-weekly-summary.md',
  'public-audit-weekly-performance.json',
  'durationDegraded',
  'retryDegraded',
  '性能劣化判定',
  '外部分析サービス不使用',
];
for(const token of builderTokens)if(!builder.includes(token))errors.push(`週次集計処理に必要な定義がありません: ${token}`);
if(builder.includes('fetch(')||builder.includes('XMLHttpRequest')||builder.includes('https://'))errors.push('週次集計処理が外部通信先を含んでいます');

const workflowTokens=[
  "cron: '0 22 * * 0'",
  'workflow_dispatch:',
  'fetch-depth: 0',
  'timeout-minutes: 10',
  'node scripts/build-public-audit-weekly-summary.mjs',
  'node scripts/audit-public-audit-weekly-summary.mjs',
  'reports/public-audit-weekly-summary.md',
  'reports/public-audit-weekly-summary-workflow-audit.md',
  'reports/public-audit-weekly-performance.json',
  'retention-days: 28',
  'git pull --rebase origin main',
  'contents: write',
  'issues: write',
  'actions/github-script@v7',
  "const title='[監視] 境界夜話 公開監査 性能劣化'",
  "const label='site-monitoring'",
  "const marker='<!-- kyokai-weekly-performance-incident -->'",
  'github.rest.issues.create',
  'github.rest.issues.createComment',
  "state:'closed'",
  'performance.breached',
];
for(const token of workflowTokens)if(!workflow.includes(token))errors.push(`週次ワークフローに必要な定義がありません: ${token}`);
if(!workflow.includes('concurrency:')||!workflow.includes('cancel-in-progress: true'))errors.push('週次ワークフローに重複実行防止がありません');
if(!workflow.includes("issues.find(issue=>!issue.pull_request&&issue.title===title&&issue.body?.includes(marker))"))errors.push('性能劣化Issueの重複防止がありません');
if(!workflow.includes('else if(incident)'))errors.push('正常回復時に既存Issueを閉じる分岐がありません');
if(workflow.includes('pull_request_target'))errors.push('週次ワークフローがpull_request_targetを使用しています');

const summaryTokens=[
  '# 境界夜話 公開監査 週次サマリー',
  '- 集計期間:',
  '- 実行記録:',
  '- 成功実行:',
  '- 失敗実行:',
  '- 再試行発生:',
  '- 再試行率:',
  '- 直近状態:',
  '- 性能劣化判定:',
  '## 監査別集計',
  '## 性能劣化判定',
  '所要時間基準',
  '再試行率基準',
  '現在の再試行率',
  '総合判定',
  '## 失敗・再試行履歴',
  '## 直近結果',
  '読書機能',
  'アクセシビリティ・実行時品質',
  'オフライン・PWA',
];
for(const token of summaryTokens)if(!summary.includes(token))errors.push(`週次サマリーに必要な項目がありません: ${token}`);
const runCount=Number(summary.match(/^- 実行記録:\s*(\d+)件/m)?.[1]||0);
if(runCount<3)warnings.push(`集計期間内の実行記録が少ないです（${runCount}件）`);
if(summary.includes('外部送信'))warnings.push('週次サマリーに外部送信という文言があります。内容を確認してください');

let performance=null;
try{
  performance=JSON.parse(performanceText);
}catch{
  errors.push('性能判定JSONを解析できません');
}
if(performance){
  if(performance.schema!=='kyokai-public-audit-performance-v1')errors.push('性能判定JSONのschemaが不正です');
  if(performance.periodDays!==7)errors.push('性能判定JSONの集計日数が7日ではありません');
  if(performance.thresholds?.durationRatio!==1.5)errors.push('所要時間劣化基準が1.5倍ではありません');
  if(performance.thresholds?.retryRate!==0.25)errors.push('再試行率劣化基準が25％ではありません');
  if(!Array.isArray(performance.sources)||performance.sources.length!==3)errors.push('性能判定JSONの監査別データが3件ではありません');
  if(typeof performance.breached!=='boolean')errors.push('性能判定JSONに総合判定がありません');
  if(typeof performance.totals?.retryDegraded!=='boolean')errors.push('性能判定JSONに再試行率判定がありません');
  for(const source of performance.sources||[]){
    if(typeof source.durationDegraded!=='boolean')errors.push(`${source.label||source.key}: 所要時間判定がありません`);
    if(!Number.isFinite(source.durationRatio))errors.push(`${source.label||source.key}: 中央値比が数値ではありません`);
  }
  if(performance.breached)warnings.push(`現在の実績が性能劣化基準を超えています（${(performance.reasons||[]).join(' / ')||'理由なし'}）`);
}

const evaluate=(latest,baseline,retryRuns,totalRuns)=>{
  const durationDegraded=baseline>0&&latest>=baseline*1.5;
  const retryDegraded=totalRuns>0&&retryRuns/totalRuns>=0.25;
  return durationDegraded||retryDegraded;
};
if(!evaluate(45,30,0,8))errors.push('所要時間50％悪化の境界値を検出できません');
if(!evaluate(30,30,2,8))errors.push('再試行率25％の境界値を検出できません');
if(evaluate(44.9,30,1,8))errors.push('基準未満の合成ケースを性能劣化と誤判定しています');

const report=[
  '# 境界夜話 公開監査週次サマリー・性能劣化通知 設定監査',
  '',
  '- 集計期間: 過去7日',
  '- 所要時間劣化基準: 最新が7日中央値の1.50倍以上',
  '- 再試行率劣化基準: 全監査の実行中25.0％以上',
  '- Issue通知: site-monitoringラベルで1件だけ作成・継続時追記',
  '- 復旧処理: 基準内へ戻った次回集計で復旧コメント後に自動クローズ',
  '- 集計元: Git履歴内の読書・実行時品質・オフライン監査レポート',
  '- 定期実行: 毎週月曜07:00 JST',
  '- 履歴取得: checkout fetch-depth 0',
  '- 外部分析サービス: 使用しない',
  '- 成果物保存: 28日',
  `- 集計済み実行記録: ${runCount}件`,
  `- 現在の性能判定: ${performance?.breached?'要確認':'正常'}`,
  `- エラー: ${errors.length}`,
  `- 警告: ${warnings.length}`,
  '',
  '## エラー',
  '',
  ...(errors.length?errors.map(error=>`- ${error}`):['- なし']),
  '',
  '## 警告',
  '',
  ...(warnings.length?warnings.map(warning=>`- ${warning}`):['- なし']),
  '',
].join('\n');

fs.mkdirSync(path.join(root,'reports'),{recursive:true});
fs.writeFileSync(path.join(root,'reports','public-audit-weekly-summary-workflow-audit.md'),report);
console.log(report);
if(errors.length)process.exitCode=1;
