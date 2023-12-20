import { Hono } from "https://deno.land/x/hono@v3.11.8/mod.ts";
import { compress, cors } from "https://deno.land/x/hono@v3.11.8/middleware.ts";

const app = new Hono();

app.use(cors());
app.use('*', compress())

app.get("/", (c) => c.text("Hello Hono!"));

Deno.serve(app.fetch);
