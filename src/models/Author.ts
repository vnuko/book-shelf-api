import { AuthorInfo } from "./AuthorInfo";
import { Book, BookProps } from "./Book";

export interface AuthorProps {
  id?: string;
  authorInfo?: AuthorInfo;
  images?: string[];
  books?: Map<string, Book> | [];
}

export class Author {
  constructor(private props: AuthorProps = {}) {
    this.props.books = this.props.books ?? new Map<string, Book>();
  }

  get id() {
    return this.props.id ?? "";
  }
  get authorInfo() {
    return this.props.authorInfo ?? new AuthorInfo();
  }
  get images() {
    return this.props.images ?? [];
  }
  get books() {
    return this.props.books ?? new Map<string, Book>();
  }

  toJSON() {
    return {
      id: this.id,
      authorInfo: this.authorInfo.toJson(),
      images: this.images,
      books: Array.from(this.books.values()).map((book) => book.toJSON()),
    };
  }

  public static mapFromRaw(data: Partial<AuthorProps> = {}): Author {
    if (!data || typeof data !== "object") {
      console.warn("Invalid author data, using default values.");
      return new Author();
    }

    let books: Map<string, Book> = new Map<string, Book>();

    if (data.books instanceof Map) {
      books = data.books;
    } else if (Array.isArray(data.books)) {
      books = new Map<string, Book>();
      data.books.forEach((book: Partial<BookProps>) => {
        if (book?.id) {
          books.set(book.id, Book.mapFromRaw(book));
        }
      });
    }

    let authorInfo: AuthorInfo = new AuthorInfo();
    if (data.authorInfo && data.authorInfo instanceof AuthorInfo) {
      authorInfo = data.authorInfo;
    } else if (data.authorInfo && typeof data.authorInfo === "object") {
      authorInfo = AuthorInfo.mapFromRaw(data.authorInfo);
    }

    return new Author({
      id: data.id,
      authorInfo,
      images: data.images,
      books,
    });
  }
}
