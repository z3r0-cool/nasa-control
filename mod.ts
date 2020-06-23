import { Application, send } from "https://deno.land/x/oak@v5.0.0/mod.ts";

const app = new Application();
const PORT = 8000;

// next async controls when next piece of mw is caleld
app.use(async (ctx, next) => {
  // codes keep running waiting for the next from the api
  await next();
  const time = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url}: ${time}`);
});

// measuring time
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const delta = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${delta}ms`);
});

// serving file
app.use(async (ctx) => {
  // endpoint
  const filePath = ctx.request.url.pathname;
  const fileWhitelist = [
    "/index.html",
    "/javascript/scrip.js",
    "/stylesheets/styles.css",
    "/images/favicon.png"
  ];
  if(fileWhitelist.includes(filePath)) {
    await send(ctx, filePath, {
      root: `${Deno.cwd()}/public`
    })
  }
});

// middleware function. ctx contains current state of app, two main props: request and response. check oak docs for more.

app.use(async (ctx, next) => {
  // endpoint
  ctx.response.body = `                  
    _ __   __ _ ___  __ _ 
   | '_   / _' / __|/ _' |
   | | | | (_|  __   (_| |
   |_| |_| __,_|___/ __,_|

      Misson Control API`;
  await next();
});

if (import.meta.main) {
  await app.listen({
    port: PORT,
  });
}