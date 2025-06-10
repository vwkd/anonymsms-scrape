const PAGE_URL = "https://anonymsms.com";

/**
 * Fetch AnonymSMS page
 *
 * @returns HTML of AnonymSMS page
 */
export async function getPage(): Promise<string> {
  const res = await fetch(PAGE_URL);

  if (!res.ok) {
    throw new Error(`Failed to fetch page: ${res.status} ${res.statusText}`);
  }

  return res.text();
}
