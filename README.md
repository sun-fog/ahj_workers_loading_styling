# Cinema News - Loading Styling

[![Build and Deploy](https://github.com/sun-fog/ahj_workers_loading_styling/actions/workflows/deploy.yml/badge.svg)](https://github.com/sun-fog/ahj_workers_loading_styling/actions)

[Демо на GitHub Pages](https://sun-fog.github.io/ahj_workers_loading_styling/)

## Что реализовано

- Скелетон-интерфейс "Новости мира кино" до загрузки данных
- Состояние ошибки при недоступной сети
- Service Worker: cache-first для статики, network-only для API
- Серверная часть на Netlify Functions, локальный koa-сервер с middleware-задержкой

## Локальный запуск

```
npm install
npm run server   # koa на :3000 (укажите этот URL в API_URL)
npm start        # webpack dev server на :8080
```
