// Helper functions for database operations that work with both SQLite and Postgres
import db from '../database.js';

export async function dbAll(sql: string, params?: any): Promise<any[]> {
  const stmt = db.prepare(sql);
  if (params !== undefined) {
    const result = stmt.all(params);
    if (result instanceof Promise) {
      return await result;
    }
    return Array.isArray(result) ? result : [];
  } else {
    const result = stmt.all();
    if (result instanceof Promise) {
      return await result;
    }
    return Array.isArray(result) ? result : [];
  }
}

export async function dbGet(sql: string, params?: any): Promise<any> {
  const stmt = db.prepare(sql);
  const result = params !== undefined ? stmt.get(params) : stmt.get();
  if (result instanceof Promise) {
    return await result;
  }
  return result;
}

export async function dbRun(sql: string, params?: any): Promise<{ lastInsertRowid: number; changes: number }> {
  const stmt = db.prepare(sql);
  const result = params !== undefined ? stmt.run(params) : stmt.run();
  if (result instanceof Promise) {
    return await result;
  }
  return result;
}

export async function dbExec(sql: string): Promise<void> {
  const result = db.exec(sql);
  if (result instanceof Promise) {
    await result;
  }
}

