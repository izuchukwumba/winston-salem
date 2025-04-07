import { Router } from "express";
import { saveCSVEntry } from "./heatmap_controller";

const router = Router();

router.post("/save-entry", saveCSVEntry);

export default router;
