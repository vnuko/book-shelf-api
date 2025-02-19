import path from "path";

const ROOT_DIR = process.cwd();

export const INFO_FILE = "info.json";
export const DATA_DIR = path.join(ROOT_DIR, "data");
export const CACHE_DIR = path.join(ROOT_DIR, "cache");
export const CACHE_FILE = path.join(CACHE_DIR, "index.json");
