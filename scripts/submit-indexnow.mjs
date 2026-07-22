import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const base = 'https://allsunday1122.github.io/kyokai-yawa/';
const host = 'allsunday1122.github.io';
const key = 'fed96e1bf41cc21699d874b7735427b8';
const keyLocation = `${base}${key}.txt`;
const reportsDir = path.join(root, 'reports');
const reportPath = path.join(reportsDir, 'indexnow-submission.md');
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data', 'works.js'), 'utf8'), context);
const works = context.window.KYOKAI_WORKS || [];
const seriesPages = ['makabe.html', 'kurose.html', 'sakaki.html', 'kansoku.html'];
const urlList = [
  base,
  ...seriesPages.map(file => `${base}series/${file}`),
  ...works.map(work => `${base}stories/${work.file}`),
];

const writeReport = ({ status = '-', result, detail = '' }) => {
  fs.mkdirSync(reportsDir, { recursive: true });
  fs.writeFileSync(reportPath, [
    '# 境界夜話 IndexNow送信レポート',
    '',
    `- 実行日時: ${new Date().toISOString()}`,
    `- 送信URL: ${urlList.length}件`,
    `- API HTTP状態: ${status}`,
    `- 結果: ${result}`,
    `- キー配置: ${keyLocation}`,
    ...(detail ? ['', '## 詳細', '', detail] : []),
    '',
  ].join('\n'));
};

try {
  if (works.length !== 48) throw new Error(`作品数が48話ではありません（${works.length}話）`);
  for (const file of seriesPages) {
    if (!fs.existsSync(path.join(root, 'series', file))) throw new Error(`series/${file}が存在しません`);
  }
  if (urlList.length !== 53) throw new Error(`送信URLが53件ではありません（${urlList.length}件）`);
  if (!urlList.every(url => url.startsWith(base))) throw new Error('通知対象に/kyokai-yawa/外のURLがあります');

  const keyResponse = await fetch(keyLocation, { redirect: 'follow' });
  const keyBody = (await keyResponse.text()).trim();
  if (!keyResponse.ok || keyBody !== key) {
    throw new Error(`公開キーを確認できません（HTTP ${keyResponse.status}）`);
  }

  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'content-type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key, keyLocation, urlList }),
  });
  const body = (await response.text()).trim();
  if (!response.ok) {
    writeReport({ status: response.status, result: '失敗', detail: body || '応答本文なし' });
    throw new Error(`IndexNow送信失敗（HTTP ${response.status}）${body ? `: ${body}` : ''}`);
  }

  writeReport({ status: response.status, result: '送信受理', detail: body || '応答本文なし' });
  console.log(`IndexNowへ${urlList.length} URLを送信しました（HTTP ${response.status}）`);
} catch (error) {
  if (!fs.existsSync(reportPath)) writeReport({ result: '失敗', detail: error.message });
  throw error;
}
