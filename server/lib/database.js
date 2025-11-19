import { createClient } from "@supabase/supabase-js";
import { defaultMasterData, defaultUnits } from "../seed/masterData.js";

class InMemoryDatabase {
  constructor() {
    this.users = new Map();
    this.masterData = new Map();
  }

  async init() {
    defaultMasterData.forEach((record) => {
      this.masterData.set(record.id, record);
    });
  }

  async createUser(user) {
    this.users.set(user.id, user);
    return user;
  }

  async findUserByEmail(email) {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  async getUserById(id) {
    return this.users.get(id) || null;
  }

  async upsertMasterRecord(record) {
    this.masterData.set(record.id, record);
    return record;
  }

  async getMasterDataByType(type) {
    return Array.from(this.masterData.values()).filter((record) => record.type === type);
  }
}

class SupabaseDatabase {
  constructor() {
    this.client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
  }

  async init() {
    if (process.env.SKIP_REMOTE_SEED === "true") return;
    for (const record of defaultMasterData) {
      await this.client.from("master_data").upsert(record, { onConflict: "id" });
    }
  }

  async createUser(user) {
    const payload = {
      id: user.id,
      email: user.email,
      password_hash: user.passwordHash,
      full_name: user.fullName,
      role: user.role,
      organization: user.organization,
      units: user.units,
      created_at: user.createdAt,
    };
    const { error } = await this.client.from("users").insert(payload);
    if (error) throw new Error(error.message);
    return user;
  }

  async findUserByEmail(email) {
    const { data, error } = await this.client.from("users").select("*").eq("email", email).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? this.deserializeUser(data) : null;
  }

  async getUserById(id) {
    const { data, error } = await this.client.from("users").select("*").eq("id", id).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? this.deserializeUser(data) : null;
  }

  async upsertMasterRecord(record) {
    const { error } = await this.client.from("master_data").upsert(record, { onConflict: "id" });
    if (error) throw new Error(error.message);
    return record;
  }

  async getMasterDataByType(type) {
    const { data, error } = await this.client.from("master_data").select("*").eq("type", type);
    if (error) throw new Error(error.message);
    return data || [];
  }

  deserializeUser(row) {
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      fullName: row.full_name,
      role: row.role,
      organization: row.organization,
      units: row.units || defaultUnits,
      createdAt: row.created_at,
    };
  }
}

const isSupabaseConfigured = Boolean(
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
);

export const db = isSupabaseConfigured ? new SupabaseDatabase() : new InMemoryDatabase();
export { defaultUnits };
