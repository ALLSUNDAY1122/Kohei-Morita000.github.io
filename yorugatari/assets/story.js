const progress = document.querySelector('.progress');

addEventListener('scroll', () => {
  const d = document.documentElement;
  const max = d.scrollHeight - d.clientHeight;
  if (progress) progress.style.width = (max ? d.scrollTop / max * 100 : 0) + '%';
}, { passive: true });

const expBtn = document.querySelector('#explainBtn');
const exp = document.querySelector('#explanation');

if (expBtn && exp) {
  exp.id ||= 'explanation';
  expBtn.setAttribute('aria-controls', exp.id);
  expBtn.setAttribute('aria-expanded', 'false');
  expBtn.addEventListener('click', () => {
    const isOpen = exp.classList.toggle('open');
    expBtn.setAttribute('aria-expanded', String(isOpen));
    expBtn.textContent = isOpen ? '解説を閉じる' : '解説を見る';
  });
}

const fav = document.querySelector('#favoriteBtn');
const slug = document.body.dataset.slug;
const key = 'yorugatari-favorites';
let favorites = [];

try {
  const stored = JSON.parse(localStorage.getItem(key) || '[]');
  favorites = Array.isArray(stored) ? stored : [];
} catch {
  favorites = [];
}

function drawFavorite() {
  const selected = favorites.includes(slug);
  fav?.classList.toggle('active', selected);
  fav?.setAttribute('aria-pressed', String(selected));
  if (fav) fav.textContent = selected ? '★ お気に入り済み' : '☆ お気に入り';
}

fav?.addEventListener('click', () => {
  favorites = favorites.includes(slug)
    ? favorites.filter(item => item !== slug)
    : [...favorites, slug];
  localStorage.setItem(key, JSON.stringify(favorites));
  drawFavorite();
});

drawFavorite();

document.querySelector('#shareBtn')?.addEventListener('click', async event => {
  const button = event.currentTarget;
  const data = {
    title: document.title,
    text: document.querySelector('meta[name="description"]')?.content,
    url: location.href
  };

  try {
    if (navigator.share) {
      await navigator.share(data);
      return;
    }
    await navigator.clipboard.writeText(location.href);
    const original = button.textContent;
    button.textContent = 'URLをコピーしました';
    setTimeout(() => { button.textContent = original; }, 1800);
  } catch (error) {
    if (error?.name !== 'AbortError') {
      button.textContent = '共有できませんでした';
      setTimeout(() => { button.textContent = '共有'; }, 1800);
    }
  }
});
