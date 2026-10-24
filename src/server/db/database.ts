/**
 * Festiya Unified Database Layer
 * Works seamlessly with Cloudflare D1 in production, and provides
 * a memory/local database for unit testing and local development.
 */

import { DatabaseAdapter } from "./databaseTypes.ts";
import { MemoryDatabaseAdapter } from "./memoryDb.ts";

export type { DatabaseAdapter };
export { MemoryDatabaseAdapter };

// Global default singleton instance
export const db: DatabaseAdapter = new MemoryDatabaseAdapter();
