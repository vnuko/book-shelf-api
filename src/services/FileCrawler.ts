import fs from "fs/promises";
import path from "path";
import { readJson, logAndRethrow, logOnly } from "../utils/helpers";
import { Book } from "../models/Book";
import { BookInfo } from "../models/BookInfo";
import { AuthorInfo } from "../models/AuthorInfo";
import { Author } from "../models/Author";
import { Crawler } from "./Crawler";
import { DATA_DIR, INFO_FILE } from "../config/config";

/**
 * FileCrawler is a class that implements the `Crawler` interface to crawl author data from a given directory.
 *
 * This class is responsible for traversing the specified data directory, extracting author-related information,
 * and creating `Author` objects. It processes the data by accessing various files and directories, such as
 * author details, images, and associated books, then maps the data into a structured format.
 *
 * @implements {Crawler<Map<string, Author>>}
 */
export class FileCrawler implements Crawler<Map<string, Author>> {
  /**
   * Crawls the "data" directory for authors and their associated data.
   *
   * This function checks whether the "data" directory is accessible. If the directory
   * cannot be accessed (due to missing permissions or non-existence), an error is logged
   * and rethrown. If access is successful, the function proceeds to crawl the authors.
   *
   * @returns {Promise<Map<string, Author>>} A promise that resolves to a map of author UUIDs to `Author` objects.
   * @throws {Error} Will throw an error if the "data" directory is not accessible.
   */
  public async crawl(): Promise<Map<string, Author>> {
    try {
      await fs.access(DATA_DIR);
    } catch (err: unknown) {
      logAndRethrow(
        "The 'data' folder cannot be accessed! Please ensure that the folder exists and/or you have the correct permissions.",
        err
      );
    }

    return await this.crawlAuthors(DATA_DIR);
  }

  /**
   * Crawls a directory for authors, retrieving their information, images, and books.
   *
   * This function scans the specified `dataPath` directory for author directories,
   * extracts author metadata, images, and associated books, and maps them into `Author` objects.
   * Each `Author` object is stored in a `Map`, identified by a randomly generated id.
   *
   * @param {string} dataPath - The directory path where author data is stored.
   * @returns {Promise<Map<string, Author>>} A promise that resolves to a map of author UUIDs to `Author` objects.
   */
  private async crawlAuthors(dataPath: string): Promise<Map<string, Author>> {
    const authors: Map<string, Author> = new Map<string, Author>();

    const authorDirs: string[] = await this.listDirectories(dataPath);

    for (const authorDir of authorDirs) {
      const authorPath: string = path.join(dataPath, authorDir);
      const authorInfo: AuthorInfo = await this.getAuthorInfo(authorPath);

      const id: string = authorDir;
      const images: string[] = await this.listImages(authorPath);
      const books: Map<string, Book> = await this.crawlBooks(authorPath);

      authors.set(id, Author.mapFromRaw({ id, authorInfo, images, books }));
    }

    return authors;
  }

  /**
   * Crawls a directory for books, retrieving their information, images, and audio files.
   *
   * This function scans the specified `authorPath`, identifies book directories,
   * and collects book metadata, images, and audio files. The gathered data is then
   * mapped into `Book` objects, which are stored in a `Map` with randomly generated id.
   *
   * @param {string} authorPath - The directory path where the author's books are stored.
   * @returns {Promise<Map<string, Book>>} A promise that resolves to a map of book UUIDs to `Book` objects.
   */
  private async crawlBooks(authorPath: string): Promise<Map<string, Book>> {
    const books = new Map<string, Book>();

    const bookDirs = await this.listDirectories(authorPath);

    for (const bookDir of bookDirs) {
      const bookPath: string = path.join(authorPath, bookDir);
      const bookInfo: BookInfo = await this.getBookInfo(bookPath);

      const id: string = bookDir;
      const images: string[] = await this.listImages(bookPath);
      const audio: string[] = await this.listAudio(bookPath);

      books.set(id, Book.mapFromRaw({ id, bookInfo, images, audio }));
    }

    return books;
  }

  /**
   * Asynchronously lists all directories in a given base path.
   *
   * This function reads the contents of a directory at the specified `basePath` and checks each item to determine if it is a directory.
   * Only directories are added to the returned list of directory names.
   *
   * @param {string} basePath - The base directory path to list directories from.
   * @returns {Promise<string[]>} A promise that resolves to an array of directory names found in the specified base path.
   *
   * @throws {Error} If the directory reading or stat operation fails.
   */
  private async listDirectories(basePath: string): Promise<string[]> {
    const items = await fs.readdir(basePath);
    const directories = [];

    for (const item of items) {
      const fullPath = path.join(basePath, item);
      try {
        const stat = await fs.stat(fullPath);
        if (stat.isDirectory()) {
          directories.push(item);
        }
      } catch (error: unknown) {
        logOnly(`Failed to process directory: ${fullPath}`, error);
      }
    }

    return directories;
  }

  /**
   * Asynchronously lists image files with specific extensions in the given directory.
   *
   * This function reads the contents of the specified `imgPath` directory and filters
   * the results to include only files with allowed image extensions.
   * If an error occurs, it is logged, and an empty array is returned.
   *
   * **Supported image formats:**
   * - `.jpg`
   * - `.jpeg`
   * - `.png`
   * - `.svg`
   *
   * @param {string} imgPath - The directory path to search for image files.
   * @returns {Promise<string[]>} A promise that resolves to an array of image file names.
   */
  private async listImages(imgPath: string): Promise<string[]> {
    try {
      const allowedExtensions = [".jpg", ".jpeg", ".png", ".svg"];

      let relativePath = path.relative(DATA_DIR, imgPath);
      if (!relativePath.startsWith(path.sep)) {
        relativePath = path.sep + relativePath;
      }

      return (await fs.readdir(imgPath))
        .filter((file) =>
          allowedExtensions.some((ext) => file.toLowerCase().endsWith(ext))
        )
        .map((file) => path.join(relativePath, file));
    } catch (err) {
      logOnly(`Failed to read images from: ${imgPath}`, err);
      return [];
    }
  }

  /**
   * Asynchronously lists audio files with supported extensions in the given directory.
   *
   * This function reads the contents of the specified `audioPath` directory and filters
   * the results to include only files with common audio formats that can be played in Chrome.
   * If an error occurs, it is logged, and an empty array is returned.
   *
   * **Supported audio formats:**
   * - `.mp3` (MPEG Audio Layer III)
   * - `.wav` (Waveform Audio File Format)
   * - `.ogg` (Ogg Vorbis Audio)
   * - `.aac` (Advanced Audio Codec)
   *
   * @param {string} audioPath - The directory path to search for audio files.
   * @returns {Promise<string[]>} A promise that resolves to an array of audio file names.
   */
  private async listAudio(audioPath: string): Promise<string[]> {
    const allowedExtensions = [".mp3", ".wav", ".ogg", ".aac"];

    try {
      let relativePath = path.relative(DATA_DIR, audioPath);
      if (!relativePath.startsWith(path.sep)) {
        relativePath = path.sep + relativePath;
      }

      return (await fs.readdir(audioPath))
        .filter((file) =>
          allowedExtensions.some((ext) => file.toLowerCase().endsWith(ext))
        )
        .map((file) => path.join(relativePath, file));
    } catch (err) {
      logOnly(`Failed to read audio files from: ${audioPath}`, err);
      return [];
    }
  }

  /**
   * Retrieves author information from a JSON file.
   *
   * This function reads a JSON file containing author information from the specified `authorPath`
   * and maps it to an `AuthorInfo` object. If the file cannot be read or is invalid,
   * an empty `AuthorInfo` object is returned instead.
   *
   * @param {string} authorPath - The directory path where the author information file is located.
   * @returns {Promise<AuthorInfo>} A promise that resolves to an `AuthorInfo` object.
   */
  private async getAuthorInfo(authorPath: string): Promise<AuthorInfo> {
    try {
      const rawAuthorInfo = await readJson(path.join(authorPath, INFO_FILE));
      return AuthorInfo.mapFromRaw(rawAuthorInfo);
    } catch (err) {
      logOnly(`Failed to read author info from: ${authorPath}`, err);
      return new AuthorInfo();
    }
  }

  /**
   * Retrieves book information from a JSON file.
   *
   * This function reads a JSON file containing book information from the specified `bookPath`
   * and maps it to a `BookInfo` object. If the file cannot be read or is invalid,
   * an empty `BookInfo` object is returned instead.
   *
   * @param {string} bookPath - The directory path where the book information file is located.
   * @returns {Promise<BookInfo>} A promise that resolves to a `BookInfo` object.
   */
  private async getBookInfo(bookPath: string): Promise<BookInfo> {
    try {
      const rawBookInfo = await readJson(path.join(bookPath, INFO_FILE));
      return BookInfo.mapFromRaw(rawBookInfo);
    } catch (err) {
      logOnly(`Failed to load book info from: ${bookPath}`, err);
      return new BookInfo();
    }
  }
}
