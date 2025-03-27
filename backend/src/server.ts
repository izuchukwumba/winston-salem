import dotenv from "dotenv";
import express from "express";
import chatRoutes from "./chat/chat_routes";
import mapRoutes from "./map/map_routes";
import cors from "cors";

dotenv.config(); // Load .env variables

const app = express();
const PORT = process.env.PORT;

app.use(cors());

app.use(express.json());

app.use("/chat", chatRoutes);
app.use("/map", mapRoutes);

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});
