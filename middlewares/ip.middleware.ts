import { MiddlewareHandler } from "https://deno.land/x/hono@v3.11.8/mod.ts";
import { getIPLocation } from "https://deno.land/x/ip_location@v1.0.0/mod.ts";

const ipMiddleware: MiddlewareHandler = async (c, next) => {
  const netAddr = await getIPLocation();

  console.log(netAddr);

  c.set("X-IP", netAddr.ip);

  await next();
};

export { ipMiddleware };
