import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { createRepository } from "./repositories";
import { scoreboardRouter } from "./routes/scoreboard";
import { usersRouter } from "./routes/users";
import { ZipNotFoundError } from "./services/geo";

const app = express();
const repo = createRepository();

app.use(express.json());

app.get("/", (_req, res) => {
  res.send("Welcome to the RentRedi interview!");
});

app.use("/api/users", usersRouter(repo));
app.use("/api/scoreboard", scoreboardRouter());

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof ZipNotFoundError) {
    res.status(400).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(502).json({ error: "Upstream request failed. Please try again." });
});

const port = Number(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port} (user store: ${repo.backend})`);
});
