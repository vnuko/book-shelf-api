import { Request, Response } from "express";
import { successResponse, errorResponse } from "../utils/response";
import { Book } from "../models/Book";
import { CacheService } from "../services/CacheService";
import { Author } from "../models/Author";

class BookController {
  public async getBooks(req: Request, res: Response) {
    const { authorId } = req.params;

    try {
      const cacheService = CacheService.getInstance();
      const authors: Map<string, Author> = await cacheService.getAuthors();

      const author: Author | undefined = authors.get(authorId);
      if (author === undefined) {
        res
          .status(404)
          .json(errorResponse(`Author with ID ${authorId} not found`));
        return;
      }

      const authorBooks = Array.from(author!.books.values()).filter((book) =>
        book.toJSON()
      );

      res.status(200).json(successResponse(authorBooks));
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      res.status(500).json(errorResponse(errorMessage));
    }
  }

  public async getBook(req: Request, res: Response) {
    const { authorId, bookId } = req.params;

    try {
      const cacheService = CacheService.getInstance();
      const authors: Map<string, Author> = await cacheService.getAuthors();

      // Find the author by authorId
      const author: Author | undefined = authors.get(authorId);
      if (author === undefined) {
        res
          .status(404)
          .json(errorResponse(`Author with ID ${authorId} not found`));
        return;
      }

      const books = author.books as Map<string, Book>;
      const book = books.get(bookId);
      if (book === undefined) {
        res
          .status(404)
          .json(
            errorResponse(
              `Book with ID ${bookId} not found for author ${authorId}`
            )
          );
        return;
      }

      res.status(200).json(successResponse(book.toJSON()));
    } catch (error: unknown) {
      let errorMessage = "An unexpected error occurred";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      res.status(500).json(errorResponse(errorMessage));
    }
  }
}

export default new BookController();
