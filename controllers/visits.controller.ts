import { ServerSentEvent } from "https://deno.land/x/oak@v12.6.1/deps.ts";
import { Context } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { Country } from "../@types/index.ts";
import { db } from "../services/index.ts";

const okv = await db.getKv();

const getVisits = async (ctx: Context) => {
  ctx.response.headers.set("Content-Type", "text/event-stream");
  ctx.response.headers.set("Cache-Control", "no-cache");
  ctx.response.headers.set("Connection", "keep-alive");

  const target = ctx.sendEvents();

  target.dispatchMessage({ message: "Connected" });

  const addr = ctx.state.addr;
  const ip = ctx.request.ip;

  const country: Country = await fetchLocation({ ip, addr });

  const listOfKeys = [
    ["visits", "count"],
    ["visits", "last"],
  ];

  const op = okv.atomic();

  if (country.status === "success") {
    op.set(["visits", "last"], country);
  }

  op.sum(["visits", "count"], 1n);

  await op.commit();

  const streaming = okv.watch(listOfKeys);

  iterateStream(streaming, {
    callback: (value) => {
      const [
        { value: count },
        { value: last },
      ] = value as unknown as [
        { value: bigint },
        { value: Country },
      ];

      const event = new ServerSentEvent(
        "visits",
        {
          data: JSON.stringify({
            count: `${count}`,
            country: last,
          }),
        },
      );

      target.dispatchEvent(event);
    },
  });
};

const iterateStream = async (
  streaming: ReadableStream<Deno.KvEntryMaybe<unknown>[]>,
  {
    callback,
  }: {
    callback?: (value: Deno.KvEntryMaybe<unknown>[]) => void;
  } = {},
): Promise<void> => {
  for await (const stream of streaming) {
    callback?.call(null, stream);
  }
};

const fetchLocation = async ({
  ip,
  addr,
}: {
  ip: string;
  addr: Country;
}): Promise<Country> => {
  let country: Country = {
    name: "Unknown",
    code: "XX",
    city: "Unknown",
    status: "idle",
  };

  if (addr.status === "success") {
    return addr;
  }

  try {
    const res = await fetch(
      `http://ip-api.com/json/${ip}?fields=status,country,countryCode,city`,
    );
    const json = await res.json();

    country = {
      name: json.country,
      code: json.countryCode?.toLowerCase(),
      city: json.city,
      status: json.status,
    };
  } catch (error) {
    console.error(error);
    country.status = "error";
  }

  return country;
};

export { getVisits };
