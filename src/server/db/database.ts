/**
 * Festiya Unified Database Layer
 * Works seamlessly with Cloudflare D1 in production, and provides
 * a memory/local database for unit testing and local development.
 */

import { DatabaseAdapter } from "./databaseTypes.ts";
import { MemoryDatabaseAdapter } from "./memoryDb.ts";
import { D1DatabaseAdapter, D1Database } from "./d1Adapter.ts";

export type { DatabaseAdapter };
export { MemoryDatabaseAdapter, D1DatabaseAdapter };

const memoryInstance: DatabaseAdapter = new MemoryDatabaseAdapter();
let activeInstance: DatabaseAdapter = memoryInstance;

export function setD1Binding(d1: D1Database) {
  if (d1 && !(activeInstance instanceof D1DatabaseAdapter)) {
    activeInstance = new D1DatabaseAdapter(d1);
  }
}

export function resetDatabase() {
  activeInstance = memoryInstance;
}

export const db: DatabaseAdapter = new Proxy({} as DatabaseAdapter, {
  get(_target, prop) {
    const val = (activeInstance as any)[prop];
    if (typeof val === "function") {
      return val.bind(activeInstance);
    }
    return val;
  },
});
