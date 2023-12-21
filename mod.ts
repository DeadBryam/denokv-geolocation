import { Hono } from "https://deno.land/x/hono@v3.11.8/mod.ts";
import { compress, cors, serveStatic } from "https://deno.land/x/hono@v3.11.8/middleware.ts";
import { ipMiddleware } from "./middlewares/ip.middleware.ts";
import { visitsRoutes } from "./routes/index.ts";

const app = new Hono();

//BASIC SETUP
app.use(cors());
app.use("*", compress());

//MIDDLEWARES
app.use(ipMiddleware);


//ROUTES
app.get("/api", (c) => c.text("Deno Deploy!"));
app.route("/api", visitsRoutes);
app.get("/", serveStatic({path: "./views/index.html"}));

Deno.serve(app.fetch);
