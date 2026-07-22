import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { performance } from 'node:perf_hooks';

const root = process.cwd();
const base = 'https://allsunday1122.github.io/kyokai-yawa/';
const context = { window: {} };
const worksPath = path.join(root, 'data', 'works.js');
vm.runInNewContext(fs.readFileSync(worksPath, 'utf8'), context, { filename: worksPath });
const works = context.window.KYOKAI_WORKS || [];
const errors = [];
const warnings = [];
const rows = [];

const request = async (url, accept = '*/*') => {
  const started = performance.now();
  const response = await fetch(url, {
    cache: 'no-store',
    headers: { 'user-agent': 'KyokaiYawa-Reader-Audit/1.0', accept },
  });
  const body = await response.text();
  return { response, body, elapsed: performance.now() - started };
};

const requiredFragments = [
  '<link rel="stylesheet" href="/kyokai-yawa/data/reader-tools.css">',
  '<script src="/kyokai-yawa/data/reader-tools.js" defer></script>',
];

for (const work of works) {
  const url = `${base}stories/${work.file}`;
  try {
    const { response, body, elapsed } = await request(url, 'text/html');
    rows.push({ id: work.id, status: response.status, type: response.headers.get('content-type') || '', elapsed });
    if (response.status !== 200) errors.push(`${work.id}: HTTP ${response.status}`);
    for (const fragment of requiredFragments) if (!body.includes(fragment)) errors.push(`${work.id}: 読書ツール参照がありません（${fragment}）`);
    if (!/<article\b[^>]*id=["']story["']/i.test(body)) errors.push(`${work.id}: article#storyがありません`);
    if (!/<nav\b[^>]*class=["'][^"']*footer-nav/i.test(body)) errors.push(`${work.id}: 前後話ナビゲーションがありません`);
  } catch (error) {
    errors.push(`${work.id}: 取得失敗（${error.message}）`);
  }
}

const assets = [
  ['data/reader-tools.css', 'text/css', ['min-height:44px', 'max-width:43em', 'prefers-reduced-motion']],
  ['data/reader-tools.js', 'javascript', ['aria-valuenow', 'kyokai-yawa-reader-size', 'kyokai-yawa-reader-position']],
];
for (const [asset, expectedType, tokens] of assets) {
  try {
    const { response, body, elapsed } = await request(`${base}${asset}`);
    const type = response.headers.get('content-type') || '';
    rows.push({ id: asset, status: response.status, type, elapsed });
    if (response.status !== 200) errors.push(`${asset}: HTTP ${response.status}`);
    if (!type.toLowerCase().includes(expectedType)) errors.push(`${asset}: Content-Type不一致（${type || 'なし'}）`);
    for (const token of tokens) if (!body.includes(token)) errors.push(`${asset}: ${token}がありません`);
  } catch (error) {
    errors.push(`${asset}: 取得失敗（${error.message}）`);
  }
}

const timings = rows.map(row => row.elapsed).sort((a, b) => a - b);
const median = timings.length ? timings[Math.floor(timings.length / 2)] : 0;
const p95 = timings.length ? timings[Math.min(timings.length - 1, Math.ceil(timings.length * .95) - 1)] : 0;
if (p95 > 2000) warnings.push(`読書関連本番取得のp95が2秒を超えています（${Math.round(p95)}ms）`);

const report = [
  '# 境界夜話 本番スマートフォン読書体験監査',
  '',
  `- 実行日時: ${new Date().toISOString()}`,
  `- 作品HTML確認: ${works.length}話`,
  `- 読書関連資産: ${assets.length}件`,
  '- 確認内容: 読了進捗、文字サイズ、位置保存、本文先頭リンク、前後話導線',
  `- エラー: ${errors.length}`,
  `- 警告: ${warnings.length}`,
  `- 応答時間中央値: ${Math.round(median)}ms`,
  `- 応答時間p95: ${Math.round(p95)}ms`,
  '',
  '## エラー',
  '',
  ...(errors.length ? errors.map(error => `- ${error}`) : ['- なし']),
  '',
  '## 警告',
  '',
  ...(warnings.length ? warnings.map(warning => `- ${warning}`) : ['- なし']),
  '',
  '## 配信確認',
  '',
  '| 対象 | HTTP | Content-Type | 応答 |',
  '|---|---:|---|---:|',
  ...rows.map(row => `| ${row.id} | ${row.status} | ${row.type.replaceAll('|', '｜')} | ${Math.round(row.elapsed)}ms |`),
  '',
].join('\n');

fs.mkdirSync(path.join(root, 'reports'), { recursive: true });
fs.writeFileSync(path.join(root, 'reports', 'live-reader-experience-audit.md'), report);
console.log(report);
if (errors.length) process.exitCode = 1;
