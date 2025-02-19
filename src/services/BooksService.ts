import { Author } from "../models/Author";
import { Book } from "../models/Book";
import { logAndRethrow } from "../utils/helpers";

export class BookService {
  // public async getAuthorBooks(
  //   authorId: string
  // ): Promise<Map<string, Book> | null> {
  //   try {
  //     const authorsMap: Map<string, Author> = await this.indexer.load();
  //     const author: Author | undefined = authorsMap.get(authorId);
  //     if (!author) return null; // Author not found
  //     return author.books;
  //   } catch (error) {
  //     logAndRethrow(`Failed to fetch books for author ID: ${authorId}`, error);
  //   }
  //   return null;
  // }
  // public async getBookByAuthor(
  //   authorId: string,
  //   bookId: string
  // ): Promise<Book | null> {
  //   try {
  //     const authorsMap: Map<string, Author> = await this.indexer.load();
  //     const author: Author | undefined = authorsMap.get(authorId);
  //     if (!author) return null; // Author not found
  //     const books: Map<string, Book> = author.books;
  //     // Find the book in the author's books array
  //     const book: Book | undefined = books.get(bookId);
  //     if (!book) return null; // Author not found
  //     return book;
  //   } catch (error) {
  //     logAndRethrow(
  //       `Failed to fetch book (ID: ${bookId}) for author (ID: ${authorId})`,
  //       error
  //     );
  //   }
  //   return null;
  // }
}
