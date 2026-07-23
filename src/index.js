require("dotenv").config();
const express = require("express");
const { createRepository } = require("./repositories");
const { scoreboardRouter } = require("./routes/scoreboard");
const { usersRouter } = require("./routes/users");
const { ZipNotFoundError } = require("./services/geo");

const app = express();
const repo = createRepository();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to the RentRedi interview!");
});

app.use("/api/users", usersRouter(repo));
app.use("/api/scoreboard", scoreboardRouter());

app.use((err, req, res, next) => {
  if (err instanceof ZipNotFoundError) {
    return res.status(400).json({ error: err.message });
  }
  console.error(err);
  res.status(502).json({ error: "Upstream request failed. Please try again." });
});

const port = Number(process.env.PORT) || 8080;
app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port} (user store: ${repo.backend})`);
});
