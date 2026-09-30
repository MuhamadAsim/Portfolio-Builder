import { PrismaClient } from "../src/generated/prisma/client/index.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "node:path";

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

const portfolios = await prisma.portfolio.findMany();
console.log("Portfolios in dev.db:", JSON.stringify(portfolios, null, 2));
await prisma.$disconnect();
