import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const withdraw = mutation({
  args: { userId: v.string(), orgId: v.string(), amount: v.number() },
  handler: async (ctx, { userId, orgId, amount }) => {
    if (amount <= 0) throw new Error("Withdrawal amount must be positive");

    const wallet = await ctx.db.get("Wallet", userId);
    if (!wallet || wallet.balance < amount) {
      throw new Error("Insufficient balance");
    }

    // Update Wallet
    await ctx.db.update("Wallet", wallet._id, {
      balance: wallet.balance - amount,
      updatedAt: new Date(),
    });

    // Record Transaction
    await ctx.db.insert("Transaction", {
      userId,
      orgId,
      type: "withdrawal",
      amount,
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { userId, newBalance: wallet.balance - amount };
  },
});
