import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const deposit = mutation({
  args: { userId: v.string(), orgId: v.string(), amount: v.number() },
  handler: async (ctx, { userId, orgId, amount }) => {
    if (amount <= 0) throw new Error("Deposit amount must be positive");

    // Update Wallet
    const wallet = await ctx.db.get("Wallet", userId);
    if (wallet) {
      await ctx.db.update("Wallet", wallet._id, {
        balance: wallet.balance + amount,
        updatedAt: new Date(),
      });
    } else {
      await ctx.db.insert("Wallet", {
        userId,
        orgId,
        balance: amount,
        currency: "USD",
        updatedAt: new Date(),
      });
    }

    // Record Transaction
    await ctx.db.insert("Transaction", {
      userId,
      orgId,
      type: "deposit",
      amount,
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { userId, newBalance: wallet ? wallet.balance + amount : amount };
  },
});
