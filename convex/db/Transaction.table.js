import { defineTable } from "convex/schema";

export const Transaction = defineTable({
  name: "Transaction",
  fields: {
    userId: "string",        // User who made the transaction
    orgId: "string",         // Organization ID
    type: "string",          // deposit, withdrawal, bet, win
    amount: "number",        // Amount involved
    status: "string",        // pending, completed, failed
    createdAt: "datetime",   // Timestamp of transaction
    updatedAt: "datetime"    // Timestamp of last update
  },
});
