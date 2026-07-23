import { Router } from "express";
import { SUPPORTED_LEAGUES, fetchScoreboard } from "../services/espn";

export function scoreboardRouter(): Router {
  const router = Router();

  router.get("/", (req, res, next) => {
    const league = String(req.query.league ?? "").toLowerCase();
    if (!SUPPORTED_LEAGUES[league]) {
      res.status(400).json({
        error: `league must be one of: ${Object.keys(SUPPORTED_LEAGUES).join(", ")}`,
      });
      return;
    }
    fetchScoreboard(league)
      .then((games) => res.json({ league, games }))
      .catch(next);
  });

  return router;
}
