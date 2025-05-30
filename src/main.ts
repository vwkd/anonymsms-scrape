import { getPage } from "./get.ts";
import { sendNotification } from "./notify.ts";
import { parsePage } from "./parse.ts";

const CRON_SCHEDULE = Deno.env.get("CRON_SCHEDULE");

if (!CRON_SCHEDULE) {
  throw new Error("Missing env var 'CRON_SCHEDULE'");
}

/**
 * Current latest number
 */
let currentNum = "";

/**
 * Check AnonymSMS page for latest number
 *
 * - sends a notification if it has changed.
 */
async function checkNumber(): Promise<void> {
  const html = await getPage();

  if (html == undefined) {
    return;
  }

  const { num, url } = parsePage(html);

  if (num !== currentNum) {
    currentNum = num;

    await sendNotification(num, url);
  }
}

Deno.cron("check latest number", CRON_SCHEDULE, checkNumber);
