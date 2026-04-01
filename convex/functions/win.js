import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const win = mutation({
  args: { userId: v.string(), orgId: v.string(), amount: v.number() },
  handler: async (ctx, { userId, orgId, amount }) => {
    if (amount <= 0) throw new Error("Win amount must be positive");

    const wallet = await ctx.db.get("Wallet", userId);
    const newBalance = (wallet ? wallet.balance : 0) + amount;

    // Update Wallet
    if (wallet) {
      await ctx.db.update("Wallet", wallet._id, {
        balance: newBalance,
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

    // Record Win Transaction
    await ctx.db.insert("Transaction", {
      userId,
      orgId,
      type: "win",
      amount,
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { userId, newBalance };
  },
});
