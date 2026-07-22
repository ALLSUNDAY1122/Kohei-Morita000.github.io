import fs from 'node:fs';
import path from 'node:path';

const indexPath=path.join(process.cwd(),'index.html');
let html=fs.readFileSync(indexPath,'utf8');
const before=html;
const legacyPattern=/\s*<script>\s*const works=window\.KYOKAI_WORKS\|\|\[\],seriesInfo=window\.KYOKAI_SERIES\|\|\{\};[\s\S]*?document\.querySelector\('\.series-anchor-fallbacks'\)\?\.remove\(\);\s*<\/script>/;
html=html.replace(legacyPattern,'');
if(/document\.getElementById\('work-grid'\)\.innerHTML=works\.map/.test(html))throw new Error('旧作品カード描画処理を削除できませんでした');
if(/document\.getElementById\('series-grid'\)\.innerHTML=Object\.entries/.test(html))throw new Error('旧シリーズ描画処理を削除できませんでした');
fs.writeFileSync(indexPath,html);
console.log(`# トップページ静的描画の正規化\n\n- 旧作品カード再描画: 削除済み\n- 旧シリーズ再描画: 削除済み\n- 静的HTMLをJavaScript実行後も維持: はい\n- 更新: ${html===before?'なし':'あり'}\n`);
