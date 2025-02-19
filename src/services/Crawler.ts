export interface Crawler<T> {
  crawl(): Promise<T>;
}
