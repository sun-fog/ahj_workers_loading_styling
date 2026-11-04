const Koa = require('koa');
const cors = require('@koa/cors');
const news = require('./news');

const app = new Koa();

// middleware для эмуляции задержки
const slow = (ms = 3000) => async (ctx, next) => {
  await new Promise((resolve) => setTimeout(resolve, ms));
  await next();
};

app.use(cors());
app.use(slow(3000));
app.use((ctx) => {
  ctx.set('Content-Type', 'application/json');
  ctx.body = news;
});

app.listen(3000, () => console.log('Server: http://localhost:3000/news'));
