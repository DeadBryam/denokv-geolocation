import { Context } from "https://deno.land/x/hono@v3.11.8/mod.ts";
import { kv } from "../services/ks.ts";

const okv = await kv.getKv();

const getVisits = async (c: Context) => {
  okv.atomic().sum(["visits"], 1n).commit();

  const visits = await okv.get(["visits"]);

  return c.text(`Visits: ${visits.value}`);
};

export { getVisits };
