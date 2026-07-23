const { Router } = require("express");
const { fetchGeoForZip } = require("../services/geo");
const { validateCreate, validateUpdate } = require("../validation");

// express 4 doesn't forward rejected promises to the error handler
const wrap = (handler) => (req, res, next) => {
  Promise.resolve(handler(req, res, next)).catch(next);
};

function usersRouter(repo) {
  const router = Router();

  router.post(
    "/",
    wrap(async (req, res) => {
      const parsed = validateCreate(req.body);
      if (parsed.error) {
        return res.status(400).json({ error: parsed.error });
      }
      const { name, zipCode } = parsed;
      const geo = await fetchGeoForZip(zipCode);
      const user = await repo.create({ name, zipCode, ...geo });
      res.status(201).json(user);
    })
  );

  router.get(
    "/",
    wrap(async (req, res) => {
      res.json(await repo.list());
    })
  );

  router.get(
    "/:id",
    wrap(async (req, res) => {
      const user = await repo.get(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    })
  );

  router.put(
    "/:id",
    wrap(async (req, res) => {
      const parsed = validateUpdate(req.body);
      if (parsed.error) {
        return res.status(400).json({ error: parsed.error });
      }

      const existing = await repo.get(req.params.id);
      if (!existing) {
        return res.status(404).json({ error: "User not found" });
      }

      const patch = {};
      if (parsed.name !== undefined) patch.name = parsed.name;
      // Re-fetch latitude/longitude/timezone only when the zip code changes
      if (parsed.zipCode !== undefined && parsed.zipCode !== existing.zipCode) {
        const geo = await fetchGeoForZip(parsed.zipCode);
        patch.zipCode = parsed.zipCode;
        patch.latitude = geo.latitude;
        patch.longitude = geo.longitude;
        patch.timezone = geo.timezone;
        patch.city = geo.city;
      }

      const updated = await repo.update(req.params.id, patch);
      res.json(updated);
    })
  );

  router.delete(
    "/:id",
    wrap(async (req, res) => {
      const deleted = await repo.delete(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(204).end();
    })
  );

  return router;
}

module.exports = { usersRouter };
