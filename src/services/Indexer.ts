export interface Indexer<T> {
  save(authors: T): Promise<T>;
  load(): Promise<any[]>;
}
