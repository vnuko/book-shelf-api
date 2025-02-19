import { Router } from "express";
import cacheContoller from "../controllers/cacheController";

const router: Router = Router();
router.get("/", cacheContoller.doCache);

export default router;
