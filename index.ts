// const Koa = require('koa');
import * as Koa from 'koa'
// import * as https from 'https'
import * as http from 'http'
import * as Router from '@koa/router'
import * as bodyparser from 'koa-body'
const app = new Koa();
const router = new Router();
import { v4 as uuidv4 } from 'uuid';
import * as fs from 'fs'
import * as path from 'path'
app.use(bodyparser({multipart:true}))

// logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  // if(ctx.method === 'OPTIONS') {
  //   let allow = ctx.get('Allow');
  //   ctx.set('Allow', `${allow}, OPTIONS`);
  // }
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// options请求处理
app.use(async (ctx, next) =>{
  if(ctx.method === 'OPTIONS') {
    ctx.status = 204
    ctx.set('Access-Control-Allow-Origin', `*`);
    ctx.set('Access-Control-Allow-Headers', `X-Requested-With, Content-Type, Accept, Authorization`);
    ctx.set('Access-Control-Allow-Methods', `GET,PUT,OPTIONS,DELETE,PATCH`);
    ctx.set('Access-Control-Max-Age', 3600);
    ctx.body = `sucess`
    return
  }
  await next();
})

// x-response-time

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
  ctx.set('Access-Control-Allow-Origin', `*`);
});

// response
router.get('/', (ctx, next) => {
  ctx.body = 'body';
  // ctx.router available
});
router.get('/static/:category/:src', async (ctx, next) => {
  let fullpath = path.join(__dirname, ctx.params.category, ctx.params.src)
  ctx.body = await file(fullpath);
  // ctx.type = 'image/png'
  // ctx.router available
});
app
  .use(router.routes())
  .use(router.allowedMethods());

async function file(filePath) {
  let content = await fs.readFileSync(filePath)
  return content
}
  
// app.listen(3000);
console.log('start1')
http.createServer(app.callback()).listen(3000);
// https.createServer(app.callback()).listen(3001);

function createToken(): string {
  return (uuidv4() as string).replace(/-/g, '')
}
