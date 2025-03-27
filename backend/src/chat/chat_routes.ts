import { Router } from "express";
import { getChatResponse } from "./chat_controllers";

const router = Router();

router.post("/get-chat-response", getChatResponse);

export default router;
