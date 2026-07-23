import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const read=file=>fs.readFileSync(path.join(root,file),'utf8');
const workflow=read('.github/workflows/reading-public-browser-audit.yml');
const pkg=JSON.parse(read('package.json'));
const config=read('playwright.config.mjs');
const tests=read('tests/site-health.spec.mjs');
const reporter=read('scripts/site-health-reporter.mjs');
const worksContext={window:{}};
vm.runInNewContext(read('data/works.js'),worksContext);
const works=Array.isArray(worksContext.window.KYOKAI_WORKS)?worksContext.window.KYOKAI_WORKS:[];
const errors=[];
const warnings=[];

const requirements=[
  ["cron: '30 21 * * *'",'毎日06:30 JSTの定期実行'],
  ['PLAYWRIGHT_BASE_URL: https://allsunday1122.github.io/kyokai-yawa/','GitHub Pages公開URL'],
  ['SITE_HEALTH_REPORT: site-public-health-audit.md','公開品質専用レポート'],
  ['timeout-minutes: 30','統合ジョブ実行上限'],
  ['sleep 60','公開反映待機'],
  ['tests/site-health.spec.mjs --retries=1','品質試験と一時障害の再試行'],
  ['retention-days: 14','失敗資料の保存期間'],
  ['contents: write','監査レポート保存権限'],
  ['id: health','品質試験の結果判定'],
  ["steps.health.outcome == 'failure'",'品質試験失敗時のCI失敗'],
  ["- 'data/works.js'",'作品データ変更時の監査起動'],
];
for(const [fragment,label] of requirements)if(!workflow.includes(fragment))errors.push(`${label}がありません`);
if(pkg.devDependencies?.['@axe-core/playwright']!=='4.10.2')errors.push('@axe-core/playwrightの固定バージョンがありません');
if(!config.includes('siteHealthMode')||!config.includes('site-health-reporter.mjs'))errors.push('Playwright設定に品質監査レポーター切替がありません');
for(const token of ['wcag2a','wcag2aa','wcag21a','wcag21aa','pageerror','requestfailed','consoleErrors','badResponses'])if(!tests.includes(token))errors.push(`品質試験に必要な監視がありません: ${token}`);
for(const token of ["path.join(root,'data','works.js')","works.length!==48","targets.length!==54","new Set(targets.map","storyTargets"])if(!tests.includes(token))errors.push(`全公開ページ監査に必要な処理がありません: ${token}`);
for(const token of ['対象ページ: ${pages.length}/54','実行ケース: ${rows.length}/108'])if(!reporter.includes(token))errors.push(`品質監査レポートに全件集計がありません: ${token}`);
if(works.length!==48)errors.push(`公開作品が48話ではありません（${works.length}話）`);
const files=works.map(work=>work.file);
if(new Set(files).size!==works.length)errors.push('公開作品ファイル名に重複があります');
if(!reporter.includes('アクセシビリティ・実行時品質監査'))errors.push('品質監査レポート見出しがありません');
if(!workflow.includes('playwright-report')||!workflow.includes('test-results'))errors.push('失敗時のトレース・画面資料が保存対象にありません');

const report=[
  '# 境界夜話 公開サイト品質定期監査 設定監査',
  '',
  '- 実行方式: 公開読書機能監査と同じジョブへ統合',
  '- 定期実行: 毎日06:30 JST',
  '- 追加実行: 主要読書ワークフロー完了後・設定変更時・手動',
  '- ブラウザー: Chromium desktop / WebKit mobile',
  '- 対象ページ: トップ1・シリーズ4・公開作品48・読書記録1＝54ページ',
  '- 実行ケース: 54ページ×2ブラウザー＝108件',
  '- 作品追加対応: data/works.jsから監査対象を自動生成',
  '- アクセシビリティ: axe-core WCAG 2.1 A/AA',
  '- 実行時監視: console.error・JavaScript例外・通信失敗・HTTP 4xx/5xx',
  '- 再試行: 最大1回',
  '- 統合実行上限: 30分',
  '- 失敗資料: HTML・trace・screenshot・videoを14日保存',
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
fs.writeFileSync(path.join(root,'reports','site-health-workflow-audit.md'),report);
console.log(report);
if(errors.length)process.exitCode=1;
