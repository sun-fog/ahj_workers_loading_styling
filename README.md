# Cinema News - Loading Styling

[![Build and Deploy](https://github.com/sun-fog/ahj_workers_loading_styling/actions/workflows/deploy.yml/badge.svg)](https://github.com/sun-fog/ahj_workers_loading_styling/actions)

[Демо на GitHub Pages](https://sun-fog.github.io/ahj_workers_loading_styling/)

## Архитектура и решения

### Общая схема

```
GitHub (push в main)
   │
   ├──► GitHub Actions: webpack build (--mode production)
   │        │
   │        └──► deploy dist/ на GitHub Pages
   │
   └──► Netlify: деплой + serverless-функция /.netlify/functions/news
            (эмуляция медленного API, CORS-заголовки)
```

- **Сборка** — Webpack 5: JS и CSS собираются бандлами с contenthash, HTML генерируется
  HtmlWebpackPlugin, иконки и manifest копируются CopyWebpackPlugin.
- **Статика** — GitHub Pages (основной адрес приложения).
- **API** — Netlify Function отдаёт ленту новостей с искусственной задержкой,
  чтобы продемонстрировать экран загрузки. Ответ снабжён CORS-заголовками,
  поэтому Pages-версия обращается к функции напрямую.

### Офлайн-режим: Service Worker на Workbox

Service Worker генерируется через **Workbox** (плагин `workbox-webpack-plugin`,
режим `InjectManifest`), а не пишется на голых API:

- **Precaching на этапе сборки.** `InjectManifest` внедряет в `sw.js` манифест всех
  собранных ассетов (`self.__WB_MANIFEST`): `index.html`, `bundle.<contenthash>.js`,
  `style.<contenthash>.css`. Файлы кладутся в кеш `workbox-precache-v2-*` уже при
  установке SW — до первого рантайм-запроса. Хешированные имена бандлов решают
  проблему устаревшего кеша: новая сборка автоматически вытесняет старую.
- **Навигация офлайн.** Маршрут `NavigationRoute` отдаёт закешированный `index.html`,
  поэтому без сети страница открывается в режиме «загрузки», а не ошибкой браузера.
- **API новостей** — стратегия `NetworkFirst` с таймаутом 3 сек
  (`networkTimeoutSeconds`): пока есть сеть показываются свежие данные, при сбое —
  копия из кеша `api-cache`. Ответы кешируются только со статусом 200
  (`CacheableResponsePlugin`).
- **Изображения** — стратегия `StaleWhileRevalidate` (кеш `image-cache`): мгновенный
  ответ из кеша, обновление в фоне.
- **Обратная совместимость.** `cleanupOutdatedCaches()` удаляет кеши старых версий
  Workbox, обработчик `activate` точечно удаляет кеш `cinema-news-v1` от ручной
  версии SW — у всех посетителей после обновления.

### Почему InjectManifest, а не GenerateSW

`GenerateSW` генерирует Service Worker целиком «из коробки» — с ним precache
работает сразу, но кастомизировать логику сложнее: маршруты описываются
через конфиг плагина, а неявные правила приходится угадывать. В проекте
нужны три специфичных маршрута: офлайн-навигация на `index.html`,
`NetworkFirst` с таймаутом для API и `StaleWhileRevalidate` для картинок.
Поэтому выбран `InjectManifest`: SW пишется вручную (логика полностью
прозрачна и контролируема), а Workbox в этой связке отвечает за то, ради
чего его обычно и используют — автоматический precache-манифест собранных
ассетов с хешами. Получается лучший из двух миров: полная явность роутинга
+ надёжный precaching без ручного перечисления файлов.

### PWA: manifest.json

Приложение устанавливаемо как PWA: подключён `manifest.json` (название, цвета,
`display: standalone`, `start_url`) и иконки 192×192 и 512×512 (`src/icons/`,
сгенерированы и подключены через `<link rel="icon">` и `theme-color`).

### Локальный запуск

```bash
npm install
npm run build        # сборка в dist/ (sw.js соберёт InjectManifest)
npx webpack serve    # dev-сервер на :8080
```

Для проверки офлайн-режима локально в devServer включён `writeToDisk: true`,
иначе dev-сервер не пишет `sw.js` на диск и SW не регистрируется.

### Проверка офлайна

1. DevTools → Application → Cache Storage: должны быть кеши
   `workbox-precache-v2-…`, `api-cache`, `image-cache`.
2. DevTools → Network → Offline → перезагрузка: страница открывается,
   новости — из `api-cache`, картинки — из `image-cache`.
   