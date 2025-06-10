import { getPage } from "./get.ts";
import { sendNotification } from "./notify.ts";
import { parsePage } from "./parse.ts";

const KV_PREFIX = ["latestNumber"];

/**
 * Database for latest number
 */
export class Database {
  #kv: Deno.Kv;
  /**
   * `+1234567890`
   */
  #latestNumber: string;

  private constructor(kv: Deno.Kv, latestNumber: string) {
    this.#kv = kv;
    this.#latestNumber = latestNumber;
  }

  /**
   * Create new database instance
   *
   * - loads latest number from Deno KV or fetches from AnonymSMS page if not yet stored
   *
   * @param kv Deno KV store
   * @returns Database instance
   */
  static async create(kv: Deno.Kv): Promise<Database> {
    let latestNumber: string;

    const entry = await kv.get<string>(KV_PREFIX);

    if (entry.value === null) {
      const html = await getPage();
      latestNumber = parsePage(html);

      console.debug(`Fetched latest number: '${latestNumber}'`);

      await kv.set(KV_PREFIX, latestNumber);
    } else {
      latestNumber = entry.value;

      console.debug(`Loaded latest number: '${latestNumber}'`);
    }

    return new Database(kv, latestNumber);
  }

  /**
   * Get latest number
   *
   * @returns latest number
   */
  get latestNumber(): string {
    return this.#latestNumber;
  }

  /**
   * Get latest number URL
   *
   * - `https://anonymsms.com/number/1234567890/`
   *
   * @returns latest number URL
   */
  get latestNumberUrl(): string {
    return `https://anonymsms.com/number/${this.#latestNumber.slice(1)}/`;
  }

  /**
   * Update latest number
   *
   * - fetches and parses latest number from AnonymSMS page
   * - if changed, sets latest number and sends notification
   */
  async updateLatestNumber(): Promise<void> {
    const html = await getPage();
    const newLatestNumber = parsePage(html);

    if (this.#latestNumber !== newLatestNumber) {
      console.debug(`Got new number: '${newLatestNumber}'`);

      this.#latestNumber = newLatestNumber;
      await this.#kv.set(KV_PREFIX, newLatestNumber);

      await sendNotification(this.latestNumber, this.latestNumberUrl);
    } else {
      console.debug("No new number");
    }
  }
}
