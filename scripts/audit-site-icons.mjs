import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const worksPath = path.join(root, 'data', 'works.js');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(worksPath, 'utf8'), context, { filename: worksPath });
const works = context.window.KYOKAI_WORKS || [];
const errors = [];
const warnings = [];

const requiredAssets = [
  'manifest.webmanifest',
  'assets/app-icon.svg',
  'assets/app-icon-192.png',
  'assets/app-icon-512.png',
  'assets/apple-touch-icon.png',
];
for (const asset of requiredAssets) {
  if (!fs.existsSync(path.join(root, asset))) errors.push(`${asset}が存在しません`);
}

const readPngDimensions = file => {
  const buffer = fs.readFileSync(file);
  const signature = '89504e470d0a1a0a';
  if (buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== signature) return null;
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20), bytes: buffer.length };
};

const expectedPngs = [
  ['assets/app-icon-192.png', 192, 192],
  ['assets/app-icon-512.png', 512, 512],
  ['assets/apple-touch-icon.png', 180, 180],
];
for (const [asset, width, height] of expectedPngs) {
  const file = path.join(root, asset);
  if (!fs.existsSync(file)) continue;
  const dimensions = readPngDimensions(file);
  if (!dimensions) {
    errors.push(`${asset}が有効なPNGではありません`);
    continue;
  }
  if (dimensions.width !== width || dimensions.height !== height) {
    errors.push(`${asset}の寸法が${width}x${height}ではありません（${dimensions.width}x${dimensions.height}）`);
  }
  if (dimensions.bytes > 512 * 1024) warnings.push(`${asset}が512KiBを超えています`);
}

const manifestPath = path.join(root, 'manifest.webmanifest');
let manifest = null;
if (fs.existsSync(manifestPath)) {
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    errors.push(`manifest.webmanifestがJSONとして不正です（${error.message}）`);
  }
}
if (manifest) {
  if (manifest.name !== '境界夜話｜四つの怪談アーカイブ') errors.push('manifest nameが不正です');
  if (manifest.short_name !== '境界夜話') errors.push('manifest short_nameが不正です');
  if (manifest.start_url !== '/kyokai-yawa/') errors.push('manifest start_urlが不正です');
  if (manifest.scope !== '/kyokai-yawa/') errors.push('manifest scopeが不正です');
  if (manifest.display !== 'standalone') errors.push('manifest displayがstandaloneではありません');
  if (manifest.theme_color !== '#090b10' || manifest.background_color !== '#090b10') errors.push('manifestのテーマ色が不正です');
  const icons = Array.isArray(manifest.icons) ? manifest.icons : [];
  const icon192 = icons.find(icon => icon.sizes === '192x192');
  const icon512 = icons.find(icon => icon.sizes === '512x512');
  if (icon192?.src !== '/kyokai-yawa/assets/app-icon-192.png') errors.push('manifestの192pxアイコンが不正です');
  if (icon512?.src !== '/kyokai-yawa/assets/app-icon-512.png') errors.push('manifestの512pxアイコンが不正です');
  if (!String(icon192?.purpose || '').includes('maskable') || !String(icon512?.purpose || '').includes('maskable')) {
    errors.push('manifestアイコンにmaskable purposeがありません');
  }
}

const pages = [
  ['index.html', path.join(root, 'index.html')],
  ['404.html', path.join(root, '404.html')],
  ...works.map(work => [work.id, path.join(root, 'stories', work.file)]),
];
const requiredFragments = [
  '<link rel="manifest" href="/kyokai-yawa/manifest.webmanifest">',
  '<link rel="icon" type="image/svg+xml" href="/kyokai-yawa/assets/app-icon.svg">',
  '<link rel="icon" type="image/png" sizes="192x192" href="/kyokai-yawa/assets/app-icon-192.png">',
  '<link rel="apple-touch-icon" sizes="180x180" href="/kyokai-yawa/assets/apple-touch-icon.png">',
  '<meta name="application-name" content="境界夜話">',
  '<meta name="mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-capable" content="yes">',
  '<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">',
  '<meta name="apple-mobile-web-app-title" content="境界夜話">',
];
for (const [id, file] of pages) {
  if (!fs.existsSync(file)) {
    errors.push(`${id}: HTMLが存在しません`);
    continue;
  }
  const html = fs.readFileSync(file, 'utf8');
  for (const fragment of requiredFragments) {
    if (!html.includes(fragment)) errors.push(`${id}: ${fragment}がありません`);
  }
  if (!html.includes('<meta name="theme-color" content="#090b10">')) errors.push(`${id}: theme-colorが不正です`);
  const manifestCount = [...html.matchAll(/<link\s+rel=["']manifest["']/gi)].length;
  const appleCount = [...html.matchAll(/<link\s+rel=["']apple-touch-icon["']/gi)].length;
  if (manifestCount !== 1) errors.push(`${id}: manifestリンクが1件ではありません（${manifestCount}件）`);
  if (appleCount !== 1) errors.push(`${id}: apple-touch-iconが1件ではありません（${appleCount}件）`);
}

if (fs.existsSync(path.join(root, 'assets', 'app-icon.svg'))) {
  const svg = fs.readFileSync(path.join(root, 'assets', 'app-icon.svg'), 'utf8');
  if (!svg.includes('viewBox="0 0 512 512"')) errors.push('app-icon.svgのviewBoxが512x512ではありません');
  if (!svg.includes('fill="#090b10"')) errors.push('app-icon.svgにサイト背景色がありません');
}

const report = [
  '# 境界夜話 サイトアイコン・マニフェスト監査',
  '',
  `- HTML確認: ${pages.length}ページ`,
  `- アイコン・manifest資産: ${requiredAssets.length}件`,
  `- Web App Manifestアイコン: ${manifest?.icons?.length || 0}件`,
  `- エラー: ${errors.length}`,
  `- 警告: ${warnings.length}`,
  '',
  '## エラー',
  '',
  ...(errors.length ? errors.map(error => `- ${error}`) : ['- なし']),
  '',
  '## 警告',
  '',
  ...(warnings.length ? warnings.map(warning => `- ${warning}`) : ['- なし']),
  '',
].join('\n');

fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
fs.writeFileSync(path.join(root, 'reports', 'site-icons-audit.md'), report);
console.log(report);
if (errors.length) process.exitCode = 1;
