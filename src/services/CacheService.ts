import fs from "fs";
import fsp from "fs/promises";
import path from "path";
import { Author } from "../models/Author";
import { parser } from "stream-json";
import { streamArray } from "stream-json/streamers/StreamArray";
import { logAndRethrow } from "../utils/helpers";
import { CACHE_FILE } from "../config/config";
import { Cache } from "./Cache";

/**
 * Service class responsible for caching author data to and from a file.
 * @implements {Cache<Map<string, Author>>}
 */
export class CacheService implements Cache<Map<string, Author>> {
  private static instance: CacheService;

  private authorsMap: Map<string, Author> | null = null;

  private constructor() {}

  /**
   * Retrieves the singleton instance of CacheService.
   * @returns {CacheService} The singleton instance.
   */
  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }

    return CacheService.instance;
  }

  /**
   * Retrieves the cached authors data.
   * @returns {Promise<Map<string, Author>>} A promise that resolves to a map of authors.
   */
  public async getAuthors(): Promise<Map<string, Author>> {
    return this.load();
  }

  /**
   * Loads authors data from cache if available, otherwise reads from file.
   * @returns {Promise<Map<string, Author>>} A promise that resolves to a map of authors.
   */
  public async load(): Promise<Map<string, Author>> {
    if (this.authorsMap === null) {
      return await this.loadFromCache();
    }

    return this.authorsMap!;
  }

  /**
   * Saves the authors data to the cache file.
   * @param {Map<string, Author>} authors - The authors data to be saved.
   * @returns {Promise<Map<string, Author>>} A promise that resolves to the saved map of authors.
   */
  public async save(
    authors: Map<string, Author>
  ): Promise<Map<string, Author>> {
    this.authorsMap = null;

    try {
      if (!authors.size) {
        console.warn("No authors found.");
        return authors;
      }

      const indexData: string = JSON.stringify(
        Array.from(authors.values()).map((author) => author.toJSON()),
        null,
        2
      );

      await fsp.mkdir(path.dirname(CACHE_FILE), { recursive: true });
      await fsp.writeFile(CACHE_FILE, indexData, "utf8");

      console.log("Data successfully cached.");

      return authors;
    } catch (err: unknown) {
      logAndRethrow("Failed to save cache.", err);
    }
  }

  /**
   * Reads and loads authors data from the cache file.
   * @returns {Promise<Map<string, Author>>} A promise that resolves to a map of authors.
   */
  private async loadFromCache(): Promise<Map<string, Author>> {
    return new Promise((resolve, reject) => {
      const authors: Map<string, Author> = new Map();

      const stream = fs
        .createReadStream(CACHE_FILE, { encoding: "utf8" })
        .pipe(parser())
        .pipe(streamArray());

      stream
        .on("data", ({ value }) => {
          const author = Author.mapFromRaw(value);
          authors.set(author.id, author);
        })
        .on("end", () => resolve(authors))
        .on("error", (err) => reject(err));
    });
  }
}
