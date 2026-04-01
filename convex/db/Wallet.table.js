import { defineTable } from "convex/schema";

export const Wallet = defineTable({
  name: "Wallet",
  fields: {
    userId: "string",         // Unique user identifier
    orgId: "string",          // Organization ID for grouping users
    balance: "number",        // Current wallet balance
    currency: "string",       // e.g., USD, BTC, etc.
    updatedAt: "datetime"     // Last update timestamp
  },
});
