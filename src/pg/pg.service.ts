// src/database/database.service.ts
import { Injectable, OnModuleDestroy } from "@nestjs/common";
import { Pool } from "pg";

@Injectable()
export class PgService implements OnModuleDestroy {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      connectionString: process.env.DATABASE_CITY_HALL,
    });
  }

  async query(sql: string, params?: any[]) {
    const client = await this.pool.connect();
    try {
      const result = await client.query(sql, params);
      return result.rows;
    } finally {
      client.release();
    }
  }

  async onModuleDestroy() {
    await this.pool.end();
  }
}
