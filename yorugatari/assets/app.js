
const grid = document.querySelector('#storyGrid');
const search = document.querySelector('#searchInput');
const chips = [...document.querySelectorAll('.chip')];
const empty = document.querySelector('#emptyState');
let activeCategory = 'すべて';

function card(s){
  const flames='●'.repeat(s.fear)+'○'.repeat(5-s.fear);
  return `<a class="card" href="stories/${s.slug}.html" data-title="${s.title}" data-category="${s.category}" data-tags="${s.tags.join(' ')}">
    <div class="meta"><span class="badge">${s.category}</span><span>${s.length}</span><span>約${s.minutes}分</span></div>
    <h3>${s.title}</h3><p>${s.summary}</p>
    <div class="card-foot"><span class="fear" aria-label="怖さ ${s.fear}/5">${flames}</span><span>${s.views.toLocaleString()} views</span></div>
  </a>`
}
function render(){
  const q=(search?.value||'').trim().toLowerCase();
  const data=window.STORIES.filter(s => (activeCategory==='すべて'||s.category===activeCategory) && (!q || `${s.title} ${s.summary} ${s.tags.join(' ')}`.toLowerCase().includes(q)));
  grid.innerHTML=data.map(card).join('');
  empty.style.display=data.length?'none':'block';
  document.querySelector('#count').textContent=`${data.length}話`;
}
chips.forEach(chip=>chip.addEventListener('click',()=>{chips.forEach(c=>c.classList.remove('active'));chip.classList.add('active');activeCategory=chip.dataset.category;render()}));
search?.addEventListener('input',render);
document.querySelector('#randomBtn')?.addEventListener('click',()=>{const s=window.STORIES[Math.floor(Math.random()*window.STORIES.length)];location.href=`stories/${s.slug}.html`});
render();
