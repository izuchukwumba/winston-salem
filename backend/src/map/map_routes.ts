import { RequestHandler, Router } from "express";
import { directions, searchPlaces } from "./map_controllers";

const router = Router();

router.get("/places/search", searchPlaces as RequestHandler);
router.get("/directions", directions as RequestHandler);

export default router;
