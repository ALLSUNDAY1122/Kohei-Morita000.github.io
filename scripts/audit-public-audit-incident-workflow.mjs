import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const workflowPath=path.join(root,'.github','workflows','public-audit-incident.yml');
const errors=[];
const warnings=[];

if(!fs.existsSync(workflowPath))errors.push('障害通知ワークフローが存在しません');
const workflow=fs.existsSync(workflowPath)?fs.readFileSync(workflowPath,'utf8'):'';

const requirements=[
  ['name: Public Audit Incident Notification','ワークフロー名'],
  ["- 'Public Reading Browser Audit'",'読書操作監査トリガー'],
  ["- 'Public Site Health Audit'",'サイト品質監査トリガー'],
  ["- 'Public Offline Browser Audit'",'オフラインPWA監査トリガー'],
  ['types: [completed]','完了時トリガー'],
  ['issues: write','Issue更新権限'],
  ['actions: read','Actions参照権限'],
  ['contents: write','設定監査レポート保存権限'],
  ["head_repository.full_name == github.repository",'同一リポジトリ制限'],
  ["head_branch == 'main'",'mainブランチ制限'],
  ['const title=`[監視] 境界夜話 ${run.name} 失敗`','監査別Issueタイトル'],
  ["const label='site-monitoring'",'固定監視ラベル'],
  ["new Set(['failure','timed_out','action_required','startup_failure','stale'])",'実障害の結論一覧'],
  ['const isIncident=incidentConclusions.has(run.conclusion)','実障害判定'],
  ["run.conclusion==='success'&&incident",'成功時だけの復旧判定'],
  ['障害判定から除外しました。Issueは変更しません。','除外結果の非通知処理'],
  ['github.rest.issues.create','障害Issue作成'],
  ['github.rest.issues.createComment','連続失敗・復旧コメント'],
  ["state:'closed'",'復旧時のIssueクローズ'],
  ['github.rest.issues.createLabel','監視ラベル自動作成'],
  ['github.paginate','既存Issueの全件確認'],
  ['cancel-in-progress: false','障害・復旧イベントの直列処理'],
  ['reports/public-audit-incident-workflow-audit.md','設定監査レポート'],
];
for(const [fragment,label] of requirements)if(!workflow.includes(fragment))errors.push(`${label}がありません`);

const createCount=(workflow.match(/github\.rest\.issues\.create\(/g)||[]).length;
if(createCount!==1)errors.push(`Issue作成処理が1件ではありません（${createCount}件）`);
if(!workflow.includes("issues.find(issue=>!issue.pull_request&&issue.title===title)"))errors.push('同じ監査の既存Issueを再利用する処理がありません');
if(!workflow.includes("if(incident)"))errors.push('連続失敗を既存Issueへ追記する分岐がありません');
if(!workflow.includes("else if(run.conclusion==='success'&&incident)"))errors.push('正常復旧時だけ該当Issueを閉じる分岐がありません');
if(workflow.includes("run.conclusion!=='success'"))errors.push('cancelled・skippedを含む全非success判定が残っています');
if(workflow.includes('pull_request_target'))errors.push('pull_request_targetを使用しています');

const report=[
  '# 境界夜話 公開監査障害Issue通知 設定監査',
  '',
  '- 監視対象: Public Reading Browser Audit / Public Site Health Audit / Public Offline Browser Audit',
  '- 障害判定: failure・timed_out・action_required・startup_failure・stale',
  '- 除外結果: cancelled・skipped・neutralはIssueを作成せず、既存Issueも変更しない',
  '- 通知方法: 監査ごとにGitHub Issueを1件だけ作成し、連続失敗は同じIssueへ追記',
  '- 復旧処理: 同じ監査の次回success時に復旧コメントを追加して自動クローズ',
  '- 実行制限: 同一リポジトリ・mainブランチのみ',
  '- ラベル: site-monitoring（未作成なら自動作成）',
  '- 外部送信: なし',
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
fs.writeFileSync(path.join(root,'reports','public-audit-incident-workflow-audit.md'),report);
console.log(report);
if(errors.length)process.exitCode=1;
