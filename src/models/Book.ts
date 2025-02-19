import { BookInfo } from "./BookInfo";

export interface BookProps {
  id?: string;
  bookInfo?: BookInfo;
  images?: string[];
  audio?: string[];
}

export class Book {
  constructor(private props: BookProps = {}) {}

  get id() {
    return this.props.id ?? "";
  }
  get bookInfo() {
    return this.props.bookInfo ?? new BookInfo();
  }
  get images() {
    return this.props.images ?? [];
  }
  get audio() {
    return this.props.audio ?? [];
  }

  toJSON() {
    return {
      id: this.id,
      bookInfo: this.bookInfo.toJson(),
      images: this.images,
      audio: this.audio,
    };
  }

  public static mapFromRaw(data: Partial<BookProps> = {}): Book {
    if (!data || typeof data !== "object") {
      console.warn("Invalid book data, using default values.");
      return new Book();
    }

    let bookInfo: BookInfo = new BookInfo();
    if (data.bookInfo && data.bookInfo instanceof BookInfo) {
      bookInfo = data.bookInfo;
    } else if (data.bookInfo && typeof data.bookInfo === "object") {
      bookInfo = BookInfo.mapFromRaw(data.bookInfo);
    }

    return new Book({
      id: data.id,
      bookInfo,
      images: data.images,
      audio: data.audio,
    });
  }
}
