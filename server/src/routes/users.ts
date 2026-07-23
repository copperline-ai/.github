import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { UserPatch, UserRepository } from "../repositories/types";
import { fetchGeoForZip } from "../services/geo";
import { createUserSchema, updateUserSchema } from "../validation";

const wrap =
  (handler: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };

export function usersRouter(repo: UserRepository): Router {
  const router = Router();

  router.post(
    "/",
    wrap(async (req, res) => {
      const parsed = createUserSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0].message });
        return;
      }
      const { name, zipCode } = parsed.data;
      const geo = await fetchGeoForZip(zipCode);
      const user = await repo.create({ name, zipCode, ...geo });
      res.status(201).json(user);
    })
  );

  router.get(
    "/",
    wrap(async (_req, res) => {
      res.json(await repo.list());
    })
  );

  router.get(
    "/:id",
    wrap(async (req, res) => {
      const user = await repo.get(req.params.id);
      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.json(user);
    })
  );

  router.put(
    "/:id",
    wrap(async (req, res) => {
      const parsed = updateUserSchema.safeParse(req.body);
      if (!parsed.success) {
        res.status(400).json({ error: parsed.error.issues[0].message });
        return;
      }

      const existing = await repo.get(req.params.id);
      if (!existing) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const { name, zipCode } = parsed.data;
      const patch: UserPatch = {};
      if (name !== undefined) patch.name = name;
      // Re-fetch latitude/longitude/timezone only when the zip code changes
      if (zipCode !== undefined && zipCode !== existing.zipCode) {
        const geo = await fetchGeoForZip(zipCode);
        patch.zipCode = zipCode;
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
        res.status(404).json({ error: "User not found" });
        return;
      }
      res.status(204).end();
    })
  );

  return router;
}
