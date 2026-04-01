import { mutation } from "./_generated/server";
import { v } from "convex/values";
import { bet, win } from "./_generated/api";

// Simple example: random dice roll game
export const playDice = mutation({
  args: { userId: v.string(), orgId: v.string(), betAmount: v.number() },
  handler: async (ctx, { userId, orgId, betAmount }) => {
    // Deduct bet
    const betResult = await ctx.runMutation(bet, { userId, orgId, amount: betAmount });

    // Roll dice (1-6)
    const diceRoll = Math.floor(Math.random() * 6) + 1;
    let winAmount = 0;

    if (diceRoll >= 5) { // Win condition
      winAmount = betAmount * 2; // payout 2x
      await ctx.runMutation(win, { userId, orgId, amount: winAmount });
    }

    return {
      userId,
      betAmount,
      diceRoll,
      winAmount,
      newBalance: betResult.newBalance + winAmount
    };
  },
});
