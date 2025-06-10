import { Database } from "./database.ts";

const CRON_SCHEDULE = Deno.env.get("CRON_SCHEDULE");

if (!CRON_SCHEDULE) {
  throw new Error("Missing env var 'CRON_SCHEDULE'");
}

console.info(`Starting AnonymSMS notifier on schedule '${CRON_SCHEDULE}'...`);

const kv = await Deno.openKv();

const db = await Database.create(kv);

Deno.serve(() =>
  new Response(
    `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Latest AnonymSMS number</title>
</head>
<body>
  <h1>Latest AnonymSMS Number</h1>
  <p>The latest AnonymSMS number is: <a href="${db.latestNumberUrl}" target="_blank" rel="noreferrer">${db.latestNumber}</a></p>
</body>
</html>`,
    {
      headers: {
        "Content-Type": "text/html",
      },
    },
  )
);

Deno.cron(
  "check latest number",
  CRON_SCHEDULE,
  db.updateLatestNumber.bind(db),
);
