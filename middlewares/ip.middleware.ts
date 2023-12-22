import { getIPLocation } from "https://deno.land/x/ip_location@v1.0.0/mod.ts";

import { Middleware } from "https://deno.land/x/oak@v12.6.1/mod.ts";

const ipMiddleware: Middleware = async (c, next) => {
  const ip = c.request.ip;
  const addr = await getIPLocation(ip);

  c.state = {
    addr:{
      name: addr?.country_name,
      code: addr?.country_code?.toLowerCase() || 'unknown',
      city: addr?.city,
      status: addr.error === true ? 'nodata' : 'success'
    }
  };
  
  await next();
};

export { ipMiddleware };
