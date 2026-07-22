import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root=process.cwd();
const context={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'data','works.js'),'utf8'),context);
const works=context.window.KYOKAI_WORKS||[];
const errors=[];const warnings=[];
const pageRows=[];
const checkPage=(label,filePath,storyId='')=>{
  const html=fs.readFileSync(filePath,'utf8');
  const styles=(html.match(/\/kyokai-yawa\/data\/reading-status\.css/g)||[]).length;
  const scripts=(html.match(/\/kyokai-yawa\/data\/reading-status\.js/g)||[]).length;
  if(styles!==1)errors.push(`${label}: 読了管理CSS参照が1件ではありません（${styles}件）`);
  if(scripts!==1)errors.push(`${label}: 読了管理JavaScript参照が1件ではありません（${scripts}件）`);
  if(!html.includes('<!-- READING_STATUS_STYLES_START -->')||!html.includes('<!-- READING_STATUS_STYLES_END -->'))errors.push(`${label}: CSSマーカーがありません`);
  if(!html.includes('<!-- READING_STATUS_SCRIPT_START -->')||!html.includes('<!-- READING_STATUS_SCRIPT_END -->'))errors.push(`${label}: JavaScriptマーカーがありません`);
  if(storyId&&!html.includes(`<body data-story-id="${storyId}">`))errors.push(`${storyId}: bodyの作品IDが一致しません`);
  pageRows.push({label,styles,scripts});
};
checkPage('トップページ',path.join(root,'index.html'));
for(const file of ['makabe.html','kurose.html','sakaki.html','kansoku.html'])checkPage(`series/${file}`,path.join(root,'series',file));
for(const work of works)checkPage(work.id,path.join(root,'stories',work.file),work.id);

const statusJs=fs.readFileSync(path.join(root,'data','reading-status.js'),'utf8');
const statusCss=fs.readFileSync(path.join(root,'data','reading-status.css'),'utf8');
const readerJs=fs.readFileSync(path.join(root,'data','reader-tools.js'),'utf8');
const archiveJs=fs.readFileSync(path.join(root,'data','archive-tools.js'),'utf8');
const seriesJs=fs.readFileSync(path.join(root,'data','series-archive-tools.js'),'utf8');
const requiredStatusTokens=['kyokai-yawa-read-stories-v1','localStorage','KYOKAI_READING_STATUS','getReadIds','setRead','nextUnread','kyokai-reading-status-change','kyokai-story-complete','data-reading-completion','data-reading-summary','data-reading-badge','未読に戻す','この端末'];
for(const token of requiredStatusTokens)if(!statusJs.includes(token))errors.push(`読了管理JavaScriptに必要処理がありません: ${token}`);
if(!readerJs.includes("new CustomEvent('kyokai-story-complete'"))errors.push('本文97％到達時の読了イベントがありません');
for(const token of ['read-status-select','未読だけ','読了済みだけ','次の未読作品','params.get(\'read\')','kyokai-reading-status-change'])if(!archiveJs.includes(token))errors.push(`トップ作品検索に読了連携がありません: ${token}`);
for(const token of ['data-role="read"','data-role="next-unread"','未読だけ','読了済みだけ','params.get(\'read\')','kyokai-reading-status-change'])if(!seriesJs.includes(token))errors.push(`シリーズ内検索に読了連携がありません: ${token}`);
for(const token of ['reading-library-summary','reading-status-badge','reading-completion-panel','@media(max-width:760px)'])if(!statusCss.includes(token))errors.push(`読了管理CSSに必要定義がありません: ${token}`);
if(!statusJs.includes("safeStorage.set(JSON.stringify([...set].sort()))"))warnings.push('読了IDの保存順が固定されていません');
if(statusJs.includes('fetch(')||statusJs.includes('XMLHttpRequest'))errors.push('読了管理が外部送信処理を含んでいます');
if(pageRows.length!==53)errors.push(`対象ページが53件ではありません（${pageRows.length}件）`);
if(works.length!==48)errors.push(`公開作品が48話ではありません（${works.length}話）`);

const report=['# 境界夜話 読了済み・未読管理監査','',`- 対象ページ: ${pageRows.length}/53`,`- 作品ページID: ${works.length}/48`,'- 保存方式: ブラウザー端末内 localStorage','- 本文97％到達時: 自動で読了','- 手動変更: 読了済みにする・未読に戻す','- 一覧表示: 読了済み・未読バッジ','- 絞り込み: 未読だけ・読了済みだけ','- 次の未読作品導線: トップ・シリーズ・作品ページ','- 外部送信: なし',`- エラー: ${errors.length}`,`- 警告: ${warnings.length}`,'','## エラー','',...(errors.length?errors.map(error=>`- ${error}`):['- なし']),'','## 警告','',...(warnings.length?warnings.map(warning=>`- ${warning}`):['- なし']),''].join('\n');
fs.mkdirSync(path.join(root,'reports'),{recursive:true});
fs.writeFileSync(path.join(root,'reports','reading-status-audit.md'),report);
console.log(report);
if(errors.length)process.exitCode=1;