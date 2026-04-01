import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const bet = mutation({
  args: { userId: v.string(), orgId: v.string(), amount: v.number() },
  handler: async (ctx, { userId, orgId, amount }) => {
    if (amount <= 0) throw new Error("Bet amount must be positive");

    const wallet = await ctx.db.get("Wallet", userId);
    if (!wallet || wallet.balance < amount) throw new Error("Insufficient balance");

    // Deduct bet from Wallet
    await ctx.db.update("Wallet", wallet._id, {
      balance: wallet.balance - amount,
      updatedAt: new Date(),
    });

    // Record Bet Transaction
    await ctx.db.insert("Transaction", {
      userId,
      orgId,
      type: "bet",
      amount,
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return { userId, newBalance: wallet.balance - amount };
  },
});
