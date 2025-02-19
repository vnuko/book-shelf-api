import { Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/response";
import { CacheService } from "../services/CacheService";
import { FileCrawler } from "../services/FileCrawler";
import { Author } from "../models/Author";

class CacheController {
  async doCache(req: Request, res: Response): Promise<void> {
    const startTime: DOMHighResTimeStamp = performance.now();

    try {
      const fileCrawler = new FileCrawler();

      const cacheService = CacheService.getInstance();
      const authors: Map<string, Author> = await cacheService.save(
        await fileCrawler.crawl()
      );

      const response: object = {
        processedAuthors: authors.size,
        processingTimeSec: Number(
          (performance.now() - startTime) / 1000
        ).toFixed(2),
      };

      res.status(200).json(successResponse([], "Cached successfully"));
    } catch (err: unknown) {
      res
        .status(500)
        .json(
          errorResponse(err instanceof Error ? err.message : (err as string))
        );
    }
  }
}

export default new CacheController();
