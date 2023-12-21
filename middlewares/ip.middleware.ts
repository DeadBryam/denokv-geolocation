import { getIP } from "https://deno.land/x/get_ip@v2.0.0/mod.ts";
import { MiddlewareHandler } from "https://deno.land/x/hono@v3.11.8/mod.ts";

const ipMiddleware: MiddlewareHandler = async (c, next) => {
  const ip = await getIP({ ipv6: true });

  console.log(`Your public IP is ${ip}`);
  
    c.set('X-IP', ip);

  await next();
};

export { ipMiddleware };

