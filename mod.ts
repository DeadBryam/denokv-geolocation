import { Hono } from "https://deno.land/x/hono@v3.11.8/mod.ts";
import { compress, cors } from "https://deno.land/x/hono@v3.11.8/middleware.ts";
import { ipMiddleware } from "./middlewares/ip.middleware.ts";

const app = new Hono();

//BASIC SETUP
app.use(cors());
app.use('*', compress())

//MIDDLEWARES
app.use(ipMiddleware);

app.get("/", (c) => c.text("Hello Hono!"));

Deno.serve(app.fetch);
