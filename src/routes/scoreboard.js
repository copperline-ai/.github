const { Router } = require("express");
const { SUPPORTED_LEAGUES, fetchScoreboard } = require("../services/espn");

function scoreboardRouter() {
  const router = Router();

  router.get("/", (req, res, next) => {
    const league = String(req.query.league || "").toLowerCase();
    if (!SUPPORTED_LEAGUES[league]) {
      return res.status(400).json({
        error: `league must be one of: ${Object.keys(SUPPORTED_LEAGUES).join(", ")}`,
      });
    }
    fetchScoreboard(league)
      .then((games) => res.json({ league, games }))
      .catch(next);
  });

  return router;
}

module.exports = { scoreboardRouter };
