import express from "express";
import { start } from "workflow/api";
import { handleUserSignup } from "../workflows/user-signup.js";
import { handleGameWorkflow } from "../workflows/game-workflow.js";

const app = express();
app.use(express.json());

app.post("/api/signup", async (req, res) => {
  const { email } = req.body;
  await start(handleUserSignup, [email]);
  return res.json({ message: "User signup workflow started" });
});

app.post("/api/play", async (req, res) => {
  const { userId, betAmount } = req.body;
  await start(handleGameWorkflow, [userId, betAmount]);
  return res.json({ message: "Game workflow executed" });
});

app.listen(3000, () => console.log("Backend running on port 3000"));
