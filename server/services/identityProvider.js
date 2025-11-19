import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";
import { hashPassword, verifyPassword } from "../utils/password.js";

const hasSupabaseCredentials = Boolean(
  process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
);

class LocalIdentityProvider {
  constructor() {
    this.mode = "local";
  }

  async signup({ password }) {
    return {
      id: randomUUID(),
      passwordHash: hashPassword(password),
    };
  }

  async verify({ user, password }) {
    if (!user || !user.passwordHash) {
      throw new Error("Account is missing credentials");
    }
    if (!verifyPassword(password, user.passwordHash)) {
      throw new Error("Invalid email or password");
    }
    return { id: user.id };
  }
}

class SupabaseIdentityProvider {
  constructor() {
    this.mode = "supabase";
    this.client = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    );
  }

  async signup({ email, password, fullName }) {
    const { data, error } = await this.client.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { fullName },
    });
    if (error || !data?.user) {
      throw new Error(error?.message || "Unable to provision account");
    }
    return {
      id: data.user.id,
      passwordHash: null,
    };
  }

  async verify({ email, password }) {
    const { data, error } = await this.client.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data?.user) {
      throw new Error("Invalid email or password");
    }
    return { id: data.user.id };
  }
}

export const identityProvider = hasSupabaseCredentials
  ? new SupabaseIdentityProvider()
  : new LocalIdentityProvider();
