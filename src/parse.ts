import { DOMParser } from "@b-fuze/deno-dom";

const ELEMENT_SELECTOR = "section.latest-added p.latest-added__title a";

/**
 * Parse latest number from AnonymSMS page
 *
 * @param html HTML of AnonymSMS page
 * @returns latest number
 */
export function parsePage(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");

  const element = doc.querySelector(ELEMENT_SELECTOR);

  if (!element) {
    throw new Error(`Element not found`);
  }

  const latestNumber = element.textContent.trim();

  return latestNumber;
}
