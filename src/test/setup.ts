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

// Initialize SQLite schema in isolated test database using real migration files
const db = new Database(testDbPath);
const migrationsDir = path.resolve(process.cwd(), "prisma", "migrations");

if (fs.existsSync(migrationsDir)) {
  const migrationDirs = fs
    .readdirSync(migrationsDir)
    .sort()
    .filter((entry) => fs.statSync(path.join(migrationsDir, entry)).isDirectory());

  for (const dir of migrationDirs) {
    const sqlPath = path.join(migrationsDir, dir, "migration.sql");
    if (fs.existsSync(sqlPath)) {
      const sql = fs.readFileSync(sqlPath, "utf-8");
      db.exec(sql);
    }
  }
}
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
