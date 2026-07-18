from pathlib import Path

index_path = Path('index.html')
sitemap_path = Path('sitemap.xml')
index = index_path.read_text(encoding='utf-8')
sitemap = sitemap_path.read_text(encoding='utf-8')

skk_url = '/kyokai-yawa/stories/skk-009-chichi-ga-wasureta-tanjobi.html'
kks_url = '/kyokai-yawa/stories/kks-s1e09-katarite-no-shiranai-shashin.html'

skk_card = '      <a class="work-card" href="' + skk_url + '"><div><span class="id">SKK-009 · 榊家異聞</span><h3>父が忘れた誕生日</h3><p>家族に該当者のいない十月十二日の祝いが、紙の記録を通じて語り手の誕生日と年齢を組み替える。</p></div><div class="work-meta"><span class="tag">中編</span><span class="tag">約11分</span><span class="tag">恐怖 3</span></div></a>\n'
kks_card = '      <a class="work-card" href="' + kks_url + '"><div><span class="id">KKS-S1E09 · 境界観測記</span><h3>語り手の知らない写真</h3><p>2008年の避難所写真に記憶のない佐伯が写り、同一番号の複数原版から人物の輪郭だけが外れていく。</p></div><div class="work-meta"><span class="tag">長編</span><span class="tag">約16分</span><span class="tag">恐怖 5</span></div></a>\n'

skk_card_anchor = '      <a class="work-card" href="/kyokai-yawa/stories/skk-010-futatsu-no-ie-no-komoriuta.html">'
kks_card_anchor = '      <a class="work-card" href="/kyokai-yawa/stories/kks-s1e08-kyu-kansokuto-no-kagi.html"><div><span class="id">KKS-S1E08 · 境界観測記</span><h3>旧観測棟の鍵</h3><p>同じ鍵を回した扉を、三人はそれぞれ別の位置にあると記憶する。物理記録を分担して危険区画を特定する。</p></div><div class="work-meta"><span class="tag">長編</span><span class="tag">約14分</span><span class="tag">恐怖 4</span></div></a>\n'

if skk_url not in index:
    if skk_card_anchor not in index:
        raise SystemExit('SKK card anchor missing')
    index = index.replace(skk_card_anchor, skk_card + skk_card_anchor, 1)

if kks_url not in index:
    if kks_card_anchor not in index:
        raise SystemExit('KKS card anchor missing')
    index = index.replace(kks_card_anchor, kks_card_anchor + kks_card, 1)

skk_item = '<li><a class="story-link" href="' + skk_url + '"><span class="story-id">SKK-009</span><span class="story-title">父が忘れた誕生日</span><span class="story-arrow">›</span></a></li>'
kks_item = '<li><a class="story-link" href="' + kks_url + '"><span class="story-id">KKS-S1E09</span><span class="story-title">語り手の知らない写真</span><span class="story-arrow">›</span></a></li>'

skk_list_anchor = '<li><a class="story-link" href="/kyokai-yawa/stories/skk-010-futatsu-no-ie-no-komoriuta.html">'
kks_list_anchor = '<li><a class="story-link" href="/kyokai-yawa/stories/kks-s1e08-kyu-kansokuto-no-kagi.html"><span class="story-id">KKS-S1E08</span><span class="story-title">旧観測棟の鍵</span><span class="story-arrow">›</span></a></li>'

if skk_item not in index:
    if skk_list_anchor not in index:
        raise SystemExit('SKK list anchor missing')
    index = index.replace(skk_list_anchor, skk_item + skk_list_anchor, 1)

if kks_item not in index:
    if kks_list_anchor not in index:
        raise SystemExit('KKS list anchor missing')
    index = index.replace(kks_list_anchor, kks_list_anchor + kks_item, 1)

index = index.replace('<h3>榊家異聞</h3><span class="series-count">9話公開</span>', '<h3>榊家異聞</h3><span class="series-count">10話公開</span>', 1)
index = index.replace('<h3>境界観測記</h3><span class="series-count">8話公開</span>', '<h3>境界観測記</h3><span class="series-count">9話公開</span>', 1)
index_path.write_text(index, encoding='utf-8')

entries = [
    '  <url><loc>https://allsunday1122.github.io' + skk_url + '</loc><lastmod>2026-07-18</lastmod></url>\n',
    '  <url><loc>https://allsunday1122.github.io' + kks_url + '</loc><lastmod>2026-07-18</lastmod></url>\n',
]
for entry in entries:
    loc = entry.split('<loc>', 1)[1].split('</loc>', 1)[0]
    if loc not in sitemap:
        sitemap = sitemap.replace('</urlset>', entry + '</urlset>')
sitemap_path.write_text(sitemap, encoding='utf-8')

for temp in [
    Path('.github/scripts/publish_kks09_skk09.py'),
    Path('.github/workflows/publish-kks09-skk09.yml'),
    Path('.github/publish-kks09-skk09.trigger'),
]:
    if temp.exists():
        temp.unlink()

print('Published KKS-S1E09 and SKK-009')
