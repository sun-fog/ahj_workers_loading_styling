import './css/style.css';

const API_URL = 'https://ВАШ-САЙТ.netlify.app/.netlify/functions/news';
// const API_URL = 'http://localhost:3000/news';


const card = document.querySelector('.card');
const feed = document.querySelector('.feed');
const errorBox = document.querySelector('.error');
const refreshBtn = document.querySelector('.card__refresh');

const skeletonItem = `
  <li class="news">
    <div class="news__category skeleton"></div>
    <div class="news__row">
      <div class="news__image skeleton"></div>
      <div class="news__text">
        <div class="news__line skeleton"></div>
        <div class="news__line skeleton"></div>
      </div>
    </div>
  </li>`;

function showSkeleton() {
  card.classList.remove('is-error');
  errorBox.classList.add('hidden');
  feed.innerHTML = skeletonItem.repeat(3);
}

function renderNews(items) {
  card.classList.remove('is-error');
  errorBox.classList.add('hidden');
  feed.innerHTML = items
    .map(
      (item) => `
    <li class="news">
      <div class="news__title">${item.category}</div>
      <div class="news__row">
        <img class="news__img" src="${item.image}" alt="" />
        <div class="news__text">
          <p class="news__title">${item.title}</p>
          <p class="news__desc">${item.description}</p>
        </div>
      </div>
    </li>`
    )
    .join('');
}

function withTimeout(ms) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), ms);
  return controller.signal;
}

async function loadNews() {
  showSkeleton();
  try {
    const response = await fetch(API_URL, { signal: withTimeout(10000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    renderNews(await response.json());
  } catch (e) {
    card.classList.add('is-error');
    errorBox.classList.remove('hidden');
  }
}

refreshBtn.addEventListener('click', (e) => {
  e.preventDefault();
  loadNews();
});

loadNews();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js');
  });
}
