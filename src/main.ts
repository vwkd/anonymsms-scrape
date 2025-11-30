import { Hono } from "@hono/hono";
import { getPage } from "./get.ts";
import { parsePage } from "./parse.ts";

console.info(`Starting AnonymSMS scrape...`);

const app = new Hono();

app.get(`/newest`, async (c) => {
  console.debug("Got request:", c.req.path);

  const html = await getPage();
  const newest = parsePage(html);
  const newestUrl = `https://anonymsms.com/number/${newest.slice(1)}/`;

  return Response.json({ number: newest, url: newestUrl });
});

Deno.serve(app.fetch);
