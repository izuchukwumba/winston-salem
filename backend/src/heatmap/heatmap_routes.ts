import { Router } from "express";
import { saveCSVEntry, getCSVEntries } from "./heatmap_controller";

const router = Router();

router.post("/save-entry", saveCSVEntry);
router.get("/get-entries", getCSVEntries);
export default router;
