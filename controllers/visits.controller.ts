import { Context } from "https://deno.land/x/hono@v3.11.8/mod.ts";
import { streamSSE } from "https://deno.land/x/hono@v3.11.8/helper.ts";

import { Country } from "../@types/index.ts";
import { db } from "../services/index.ts";


const okv = await db.getKv();

const getVisits = async (c: Context) => {
  const ip = c.get("X-IP");
  const listOfKeys = [
    ["visits", "count"],
    ["visits", "last"],
  ];

  let country: Country = {
    name: "Unknown",
    code: "XX",
    city: "Unknown",
    status: "idle",
  };

  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`,
    );
    const json = await res.json();

    country = {
      name: json.country,
      code: json.countryCode,
      city: json.city,
      status: json.status,
    };
  } catch (error) {
    console.error(error);
    country.status = "error";
  }

  const op = okv.atomic();

  if (country.status === "success") {
    op.set(["visits", "last"], country);
  }

  op.sum(["visits", "count"], 1n);

  await op.commit();

  return streamSSE(c, async (stream) => {
    const streaming = okv.watch(listOfKeys);

    for await (const streams of streaming) {
      const { value: count } = streams[0] as {
        value: bigint;
      };
      const { value: country } = streams[1] as {
        value: Country;
      };

      const message = {
        count: count.toString(),
        country,
      };
      await stream.writeSSE({
        data: JSON.stringify(message),
        event: "visits",
      });
    }
  });
};

export { getVisits };
