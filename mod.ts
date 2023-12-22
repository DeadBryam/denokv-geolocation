import { visitsRoutes } from "./routes/index.ts";
import { Application, send } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { ipMiddleware } from "./middlewares/index.ts";

const app = new Application();

//BASIC SETUP
app.use(oakCors());

//MIDDLEWARES
app.use(ipMiddleware);

//ROUTES
app.use(visitsRoutes.allowedMethods());
app.use(visitsRoutes.routes());

app.use(async (ctx) => {
  await send(ctx, ctx.request.url.pathname, {
    root: `${Deno.cwd()}/views`,
    index: "index.html",
  });
});

await app.listen({ port: 8000 });
