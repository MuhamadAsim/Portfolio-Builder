import path from "node:path";
import os from "node:os";
import fs from "node:fs";
import crypto from "node:crypto";
import Database from "better-sqlite3";
import { afterAll } from "vitest";

// 1. Isolate test uploads directory
const testUploadsDir = path.join(os.tmpdir(), `pb-test-uploads-${crypto.randomUUID()}`);
fs.mkdirSync(path.join(testUploadsDir, "tmp"), { recursive: true });
process.env.UPLOAD_DIR = testUploadsDir;

// 2. Isolate test database
const testDbPath = path.join(os.tmpdir(), `pb-test-${crypto.randomUUID()}.db`);
process.env.DATABASE_URL = `file:${testDbPath}`;

// Initialize SQLite schema in isolated test database
const db = new Database(testDbPath);
db.exec(`
  CREATE TABLE IF NOT EXISTS "Portfolio" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "slug" TEXT NOT NULL,
      "templateId" TEXT NOT NULL,
      "data" TEXT NOT NULL,
      "editTokenHash" TEXT NOT NULL,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
  );
  CREATE UNIQUE INDEX IF NOT EXISTS "Portfolio_slug_key" ON "Portfolio"("slug");
`);
db.close();

// Cleanup on test run completion
afterAll(async () => {
  try {
    fs.rmSync(testUploadsDir, { recursive: true, force: true });
  } catch {
    // Ignore cleanup error
  }
  try {
    fs.rmSync(testDbPath, { force: true });
    fs.rmSync(`${testDbPath}-wal`, { force: true });
    fs.rmSync(`${testDbPath}-shm`, { force: true });
  } catch {
    // Ignore cleanup error
  }
});
