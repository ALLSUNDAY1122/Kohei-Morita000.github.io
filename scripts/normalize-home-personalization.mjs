import fs from 'node:fs';
import path from 'node:path';

const root=process.cwd();
const file=path.join(root,'index.html');
const original=fs.readFileSync(file,'utf8');
const styleBlock='<!-- HOME_PERSONALIZATION_STYLES_START -->\n<link rel="stylesheet" href="/kyokai-yawa/data/home-personalization.css">\n<!-- HOME_PERSONALIZATION_STYLES_END -->';
const scriptBlock='<!-- HOME_PERSONALIZATION_SCRIPT_START -->\n<script src="/kyokai-yawa/data/home-personalization.js" defer></script>\n<!-- HOME_PERSONALIZATION_SCRIPT_END -->';
const sectionBlock=`<!-- HOME_PERSONALIZATION_START -->
<section class="section personal-library" id="your-library" data-personal-library hidden aria-labelledby="personal-library-title">
  <div class="wrap">
    <div class="section-head">
      <div><p class="eyebrow">YOUR NIGHT ARCHIVE</p><h2 id="personal-library-title">続きの一話を選ぶ</h2></div>
      <p class="personal-library-note">この端末に保存された途中位置、読了履歴、あとで読むから表示します。履歴は外部へ送信されません。</p>
    </div>
    <div class="personal-library-grid">
      <article class="personal-panel" data-personal-continue hidden><p class="personal-panel-kicker">CONTINUE</p><h3>続きから読む</h3><div class="personal-story-list" data-personal-list></div></article>
      <article class="personal-panel" data-personal-recent hidden><p class="personal-panel-kicker">RECENT</p><h3>最近読んだ作品</h3><div class="personal-story-list" data-personal-list></div></article>
      <article class="personal-panel" data-personal-saved hidden><p class="personal-panel-kicker">SAVED</p><h3>あとで読む</h3><div class="personal-story-list" data-personal-list></div></article>
      <article class="personal-panel" data-personal-recommend hidden><p class="personal-panel-kicker">UNREAD PICKS</p><h3>未読のおすすめ</h3><div class="personal-story-list" data-personal-list></div></article>
    </div>
    <p class="personal-local-note">読了状態、途中位置、保存作品はブラウザーの保存データを削除すると消去されます。</p>
  </div>
</section>
<!-- HOME_PERSONALIZATION_END -->`;
let html=original
  .replace(/\s*<!-- HOME_PERSONALIZATION_STYLES_START -->[\s\S]*?<!-- HOME_PERSONALIZATION_STYLES_END -->\s*/g,'\n')
  .replace(/\s*<!-- HOME_PERSONALIZATION_SCRIPT_START -->[\s\S]*?<!-- HOME_PERSONALIZATION_SCRIPT_END -->\s*/g,'\n')
  .replace(/\s*<!-- HOME_PERSONALIZATION_START -->[\s\S]*?<!-- HOME_PERSONALIZATION_END -->\s*/g,'\n');
if(!html.includes('</head>'))throw new Error('index.htmlに</head>がありません');
html=html.replace('</head>',`${styleBlock}\n</head>`);
const heroPattern=/(<section class="hero"[\s\S]*?<\/section>)/;
if(!heroPattern.test(html))throw new Error('トップページのheroセクションが見つかりません');
html=html.replace(heroPattern,`$1\n${sectionBlock}`);
const archiveScript='<script src="/kyokai-yawa/data/archive-tools.js"></script>';
if(!html.includes(archiveScript))throw new Error('archive-tools.js参照が見つかりません');
html=html.replace(archiveScript,`${scriptBlock}\n${archiveScript}`);
fs.writeFileSync(file,html);
console.log(`# 再訪者向け入口正規化\n\n- 続きから読む: 1枠\n- 最近読んだ作品: 最大3話\n- あとで読む: 最大3話\n- 未読のおすすめ: 最大3話\n- 履歴・保存なしの場合: 非表示\n- 更新: ${html===original?'なし':'あり'}\n`);