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
  console.debug(`Checking current number '${currentNum}'`);

  const html = await getPage();

  if (html == undefined) {
    return;
  }

  const { num, url } = parsePage(html);

  console.debug(`Got new number: '${num}'`);

  if (num !== currentNum) {
    currentNum = num;

    await sendNotification(num, url);
  }
}

console.info(`Starting AnonymSMS notifier on schedule '${CRON_SCHEDULE}'...`);

Deno.cron("check latest number", CRON_SCHEDULE, checkNumber);
