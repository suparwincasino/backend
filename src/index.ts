import express from "express";
import { start } from "workflow/api";
import { handleUserSignup } from "../workflows/user-signup.js";
import { handleGame } from "../workflows/game-workflow.js";

const app = express();
app.use(express.json());

app.post("/api/signup", async (req, res) => {
  const { email } = req.body;
  await start(handleUserSignup, [email]);
  return res.json({ message: "Signup workflow started" });
});

app.post("/api/game", async (req, res) => {
  const { userId, betAmount } = req.body;
  await start(handleGame, [userId, betAmount]);
  return res.json({ message: "Game workflow started" });
});

app.listen(3000, () => console.log("Backend running on port 3000"));
