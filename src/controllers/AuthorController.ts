import { Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/response";
import { Author } from "../models/Author";
import { CacheService } from "../services/CacheService";

class AuthorController {
  public async getAuthors(req: Request, res: Response) {
    try {
      const cacheService = CacheService.getInstance();
      const authors: Map<string, Author> = await cacheService.getAuthors();

      const authorsJson = Array.from(authors.values()).map((author) =>
        author.toJSON()
      );

      res.status(200).json(successResponse(authorsJson));
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      res.status(500).json(errorResponse(errorMessage));
    }
  }

  public async getAuthor(req: Request, res: Response) {
    const { authorId } = req.params;

    try {
      const cacheService = CacheService.getInstance();
      const authors: Map<string, Author> = await cacheService.getAuthors();

      const author = authors.get(authorId);

      if (author) {
        res.status(200).json(successResponse(author.toJSON()));
      } else {
        res
          .status(404)
          .json(errorResponse(`Author with ID ${authorId} not found`));
      }
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      res.status(500).json(errorResponse(errorMessage));
    }
  }
}

export default new AuthorController();
