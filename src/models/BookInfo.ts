interface BookInfoProps {
  title?: string;
  subtitle?: string;
  series?: string;
  genre?: string;
  year?: number;
  readerAgeGroup?: string;
  language?: string;
  description?: string;
  keywords?: string[];
}

export class BookInfo {
  constructor(private props: BookInfoProps = {}) {}

  get title() {
    return this.props.title ?? "";
  }
  get subtitle() {
    return this.props.subtitle ?? "";
  }
  get series() {
    return this.props.series ?? "";
  }
  get genre() {
    return this.props.genre ?? "";
  }
  get year() {
    return this.props.year ?? 0;
  }
  get readerAgeGroup() {
    return this.props.readerAgeGroup ?? "";
  }
  get language() {
    return this.props.language ?? "";
  }
  get description() {
    return this.props.description ?? "";
  }
  get keywords() {
    return this.props.keywords ?? [];
  }

  toJson(): BookInfoProps {
    return { ...this.props };
  }

  public static mapFromRaw(data: Partial<BookInfoProps> = {}): BookInfo {
    if (!data || typeof data !== "object") {
      console.warn("Invalid book info data, using default values.");
      return new BookInfo();
    }

    return new BookInfo(data);
  }
}
