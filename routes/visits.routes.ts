
import { Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { getVisits } from "../controllers/index.ts";

const visitsRoutes = new Router({
    prefix: "/api",
});

visitsRoutes.get("/visits", getVisits);

export { visitsRoutes };