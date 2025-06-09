import { getPage } from "./get.ts";
import { sendNotification } from "./notify.ts";
import { parsePage } from "./parse.ts";

const KV_PREFIX = ["currentNum"];

const CRON_SCHEDULE = Deno.env.get("CRON_SCHEDULE");

if (!CRON_SCHEDULE) {
  throw new Error("Missing env var 'CRON_SCHEDULE'");
}

/**
 * Current latest number
 */
let currentNum: string | null = null;

/**
 * Check AnonymSMS page for latest number
 *
 * - sends a notification if it has changed.
 */
async function checkNumber(): Promise<void> {
  if (!currentNum) {
    currentNum = (await kv.get<string>(KV_PREFIX)).value;
  }

  const html = await getPage();

  if (html == undefined) {
    return;
  }

  const { num, url } = parsePage(html);

  if (!currentNum || num !== currentNum) {
    console.debug(`Got new number: '${num}'`);

    currentNum = num;
    await kv.set(KV_PREFIX, num);

    await sendNotification(num, url);
  } else {
    console.debug("No new number");
  }
}

console.info(`Starting AnonymSMS notifier on schedule '${CRON_SCHEDULE}'...`);

const kv = await Deno.openKv();

Deno.cron("check latest number", CRON_SCHEDULE, checkNumber);
