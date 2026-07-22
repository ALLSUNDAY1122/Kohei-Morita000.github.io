import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const worksPath = path.join(root, 'data', 'works.js');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(worksPath, 'utf8'), context, { filename: worksPath });
const works = context.window.KYOKAI_WORKS || [];

const start = '<!-- SITE_ICONS_START -->';
const end = '<!-- SITE_ICONS_END -->';
const block = `${start}
<link rel="manifest" href="/kyokai-yawa/manifest.webmanifest">
<link rel="icon" type="image/svg+xml" href="/kyokai-yawa/assets/app-icon.svg">
<link rel="icon" type="image/png" sizes="192x192" href="/kyokai-yawa/assets/app-icon-192.png">
<link rel="apple-touch-icon" sizes="180x180" href="/kyokai-yawa/assets/apple-touch-icon.png">
<meta name="application-name" content="境界夜話">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="境界夜話">
${end}`;

const files = [
  path.join(root, 'index.html'),
  path.join(root, '404.html'),
  ...works.map(work => path.join(root, 'stories', work.file)),
];

const legacyPatterns = [
  /<link\s+rel=["']manifest["'][^>]*>\s*/gi,
  /<link\s+rel=["'](?:shortcut\s+)?icon["'][^>]*>\s*/gi,
  /<link\s+rel=["']apple-touch-icon["'][^>]*>\s*/gi,
  /<meta\s+name=["']application-name["'][^>]*>\s*/gi,
  /<meta\s+name=["']mobile-web-app-capable["'][^>]*>\s*/gi,
  /<meta\s+name=["']apple-mobile-web-app-capable["'][^>]*>\s*/gi,
  /<meta\s+name=["']apple-mobile-web-app-status-bar-style["'][^>]*>\s*/gi,
  /<meta\s+name=["']apple-mobile-web-app-title["'][^>]*>\s*/gi,
];

let changed = 0;
for (const file of files) {
  let html = fs.readFileSync(file, 'utf8');
  const before = html;
  html = html.replace(new RegExp(`${start}[\\s\\S]*?${end}\\s*`, 'g'), '');
  for (const pattern of legacyPatterns) html = html.replace(pattern, '');

  const themeMeta = /<meta\s+name=["']theme-color["'][^>]*>/i;
  if (themeMeta.test(html)) {
    html = html.replace(themeMeta, match => `${match}\n${block}`);
  } else if (html.includes('</head>')) {
    html = html.replace('</head>', `${block}\n</head>`);
  } else {
    throw new Error(`${path.relative(root, file)}: </head>が見つかりません`);
  }

  if (html !== before) {
    fs.writeFileSync(file, html);
    changed += 1;
  }
}

console.log(`# サイトアイコン・マニフェスト正規化\n\n- 対象HTML: ${files.length}ページ\n- 更新HTML: ${changed}ページ\n- favicon: SVG＋192px PNG\n- Apple Touch Icon: 180px PNG\n- Web App Manifest: manifest.webmanifest\n`);
