import { sleep } from "workflow";

// -------------------
// 1️⃣ War Game Workflow
// -------------------
export async function handleWarGame(playerId: string, betAmount: number) {
  "use workflow";

  const player = await getPlayer(playerId);
  const bet = await placeBet(playerId, betAmount);

  await sleep("2s"); // simulate suspense

  const result = await runWarGameLogic(player, bet);
  await settleBet(result, player);

  return { playerId, result, balance: player.balance };
}

// -------------------
// 2️⃣ Dice Game Workflow
// -------------------
export async function handleDiceGame(playerId: string, betAmount: number) {
  "use workflow";

  const player = await getPlayer(playerId);
  const bet = await placeBet(playerId, betAmount);

  await sleep("1s");

  const roll = Math.floor(Math.random() * 6) + 1;
  const win = roll >= 4; // example win condition
  const result = { roll, win };

  await settleBet({ winner: win ? "player" : "computer", betAmount: bet.amount }, player);

  return { playerId, result, balance: player.balance };
}

// -------------------
// 3️⃣ Slot Game Workflow
// -------------------
export async function handleSlotGame(playerId: string, betAmount: number) {
  "use workflow";

  const player = await getPlayer(playerId);
  const bet = await placeBet(playerId, betAmount);

  await sleep("2s");

  const symbols = ["🍒", "🍋", "🍊", "⭐", "7"];
  const spin = [
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
    symbols[Math.floor(Math.random() * symbols.length)],
  ];

  const win = spin[0] === spin[1] && spin[1] === spin[2];

  await settleBet({ winner: win ? "player" : "computer", betAmount: bet.amount }, player);

  return { playerId, spin, win, balance: player.balance };
}

// -------------------
// --- Workflow Steps ---
// -------------------
async function getPlayer(playerId: string) {
  "use step";
  // fetch wallet from Convex
  console.log(`Fetching player ${playerId}`);
  return { id: playerId, balance: 1000 }; // placeholder
}

async function placeBet(playerId: string, amount: number) {
  "use step";
  console.log(`Placing bet of ${amount} for player ${playerId}`);
  return { playerId, amount };
}

async function runWarGameLogic(player: { id: string }, bet: { amount: number }) {
  "use step";
  const winner = Math.random() < 0.5 ? "player" : "computer";
  console.log(`War game winner: ${winner}`);
  return { winner, betAmount: bet.amount };
}

async function settleBet(result: { winner: string; betAmount: number }, player: { id: string; balance: number }) {
  "use step";
  console.log(`Settling bet for ${result.winner} with amount ${result.betAmount}`);
  if (result.winner === "player") {
    player.balance += result.betAmount;
  } else {
    player.balance -= result.betAmount;
  }
  // update Convex wallet here
}
