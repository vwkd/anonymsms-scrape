const NTFY_BASE_URL = "https://ntfy.sh/";

const NTFY_TOPIC = Deno.env.get("NTFY_TOPIC");

if (!NTFY_TOPIC) {
  throw new Error("Missing env var 'NTFY_TOPIC'");
}

/**
 * Send NTFY notification for new number
 *
 * @param latestNumber latest number
 * @param latestNumberUrl latest number URL
 */
export async function sendNotification(
  latestNumber: string,
  latestNumberUrl: string,
): Promise<void> {
  console.debug(`Sending notification`);

  const res = await fetch(NTFY_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      topic: NTFY_TOPIC,
      title: `New AnonymSMS number`,
      message: latestNumber,
      click: latestNumberUrl,
      actions: [{ action: "view", label: "Open page", url: latestNumberUrl }],
    }),
  });

  if (!res.ok) {
    throw new Error(
      `Failed to send notification: ${res.status} ${res.statusText}`,
    );
  }
}
