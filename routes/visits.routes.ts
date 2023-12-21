import { Hono } from 'https://deno.land/x/hono@v3.11.8/mod.ts';
import { getVisits } from "../controllers/index.ts";

const visitsRoutes = new Hono();

visitsRoutes.get("/visits", getVisits);

export { visitsRoutes };