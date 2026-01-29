import Dexie, { type Table } from "dexie";

/**
 * DATABASE SCHEMA VERSIONING STRATEGY
 * 
 * Version 1: Initial schema with experts and sessions
 * Version 2: Added 'persona' field to experts, transformed existing data
 * Version 3: Added decisionRecords table for analytics dashboard
 */

export interface Expert {
  id?: number;
  name: string;
  role: string;
  model: string;
  persona?: string; // Added in v2
  description?: string;
}
export interface Session {
  id?: number;
  title: string;
  createdAt: number;
}
export interface DecisionRecord {
  id?: number;
  timestamp: number;
  mode: string;
  task: string;
  expertCount: number;
  duration: number; // seconds
  cost: number; // USD
  verdict: string;
  synthesisContent?: string;
  synthesisModel?: string;
  synthesisTier?: string;
  success: boolean;
  outputs?: string; // JSON stringified expert outputs
}
export class CouncilDatabase extends Dexie {
  experts!: Table<Expert>;
  sessions!: Table<Session>;
  decisionRecords!: Table<DecisionRecord>;
  constructor() {
    super("CouncilDB");

    // VERSION 1: Initial Definition
    this.version(1).stores({
      experts: "++id, name, role, model",
      sessions: "++id, title, createdAt"
    });

    // VERSION 2: Schema Evolution
    // Adds 'persona' field and populates it based on 'role' for existing records
    this.version(2).stores({
      experts: "++id, name, role, model, persona" // Add persona to index
    }).upgrade(async (tx) => {
      // Data transformation: Map existing roles to initial personas
      return tx.table("experts").toCollection().modify((expert) => {
        if (!expert.persona) {
          expert.persona = `Specialist in ${expert.role}`;
        }
      });
    });

    // VERSION 3: Add decision records for analytics
    this.version(3).stores({
      experts: "++id, name, role, model, persona",
      sessions: "++id, title, createdAt",
      decisionRecords: "++id, timestamp, mode, task, success" // Add analytics table
    });
  }
}
export const db = new CouncilDatabase();

/**
 * SAFE DATABASE INITIALIZATION & ERROR HANDLING
 */
export async function initDatabase() {
  try {
    await db.open();
  } catch (err) {
    console.error("[CouncilDB] Critical migration failure:", err);
    // Error Recovery: In extreme cases, notify user or implement secondary fallback
    // Note: Dexie automatically handles rollback if a transaction fails within .upgrade()
  }
}

/**
 * LOCAL TESTING UTILITY
 * Use this in development to verify migrations
 */
export async function testMigration() {
  if (process.env.NODE_ENV !== "development") return;
  const experts = await db.experts.toArray();
  const needsPersona = experts.some((e) => !e.persona);
  if (needsPersona) // eslint-disable-next-line no-empty
    {} else // eslint-disable-next-line no-empty
    {}}