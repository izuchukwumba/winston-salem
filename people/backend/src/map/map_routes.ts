import { RequestHandler, Router } from "express";
import {
  directions_controller,
  searchPlaces_controller,
} from "./map_controllers";

const router = Router();

router.get("/places/search", searchPlaces_controller as RequestHandler);
router.get("/directions", directions_controller as RequestHandler);

export default router;
