export interface Cache<T> {
  load(): Promise<T>;
  save(collection: T): Promise<T>;
}
