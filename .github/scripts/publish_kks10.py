from pathlib import Path

index_path = Path('index.html')
sitemap_path = Path('sitemap.xml')
index = index_path.read_text(encoding='utf-8')
sitemap = sitemap_path.read_text(encoding='utf-8')

url = '/kyokai-yawa/stories/kks-s1e10-uchigawa-o-muku-kyokaisen.html'
card = '      <a class="work-card" href="' + url + '"><div><span class="id">KKS-S1E10 · 境界観測記</span><h3>内側を向く境界線</h3><p>豪雨前の避難区域図で全ての矢印が内側を向き、避難対象と安全側の分類だけが観測者ごとに反転する。</p></div><div class="work-meta"><span class="tag">長編</span><span class="tag">約15分</span><span class="tag">恐怖 4</span></div></a>\n'
card_anchor = '      <a class="work-card" href="/kyokai-yawa/stories/kks-s1e09-katarite-no-shiranai-shashin.html"><div><span class="id">KKS-S1E09 · 境界観測記</span><h3>語り手の知らない写真</h3><p>2008年の避難所写真に記憶のない佐伯が写り、同一番号の複数原版から人物の輪郭だけが外れていく。</p></div><div class="work-meta"><span class="tag">長編</span><span class="tag">約16分</span><span class="tag">恐怖 5</span></div></a>\n'
if url not in index:
    if card_anchor not in index:
        raise SystemExit('card anchor missing')
    index = index.replace(card_anchor, card_anchor + card, 1)

item = '<li><a class="story-link" href="' + url + '"><span class="story-id">KKS-S1E10</span><span class="story-title">内側を向く境界線</span><span class="story-arrow">›</span></a></li>'
item_anchor = '<li><a class="story-link" href="/kyokai-yawa/stories/kks-s1e09-katarite-no-shiranai-shashin.html"><span class="story-id">KKS-S1E09</span><span class="story-title">語り手の知らない写真</span><span class="story-arrow">›</span></a></li>'
if item not in index:
    if item_anchor not in index:
        raise SystemExit('list anchor missing')
    index = index.replace(item_anchor, item_anchor + item, 1)
index = index.replace('<h3>境界観測記</h3><span class="series-count">9話公開</span>', '<h3>境界観測記</h3><span class="series-count">10話公開</span>', 1)
index_path.write_text(index, encoding='utf-8')

loc = 'https://allsunday1122.github.io' + url
entry = '  <url><loc>' + loc + '</loc><lastmod>2026-07-18</lastmod></url>\n'
if loc not in sitemap:
    sitemap = sitemap.replace('</urlset>', entry + '</urlset>')
sitemap_path.write_text(sitemap, encoding='utf-8')

for temp in [Path('.github/scripts/publish_kks10.py'), Path('.github/workflows/publish-kks10.yml'), Path('.github/publish-kks10.trigger')]:
    if temp.exists():
        temp.unlink()
print('Published KKS-S1E10')
