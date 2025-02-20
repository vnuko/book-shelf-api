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
 * Service responsible for managing the caching process of author data.
 */
export class CacheService implements Cache<Map<string, Author>> {
  private static instance: CacheService;

  private authorsMap: Map<string, Author> | null = null;

  private constructor() {}

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }

    return CacheService.instance;
  }

  public async getAuthors(): Promise<Map<string, Author>> {
    return this.load();
  }

  public async load(): Promise<Map<string, Author>> {
    if (this.authorsMap === null) {
      return await this.load();
    }

    return this.authorsMap!;
  }

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
