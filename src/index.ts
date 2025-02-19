import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authorRoutes from "./routes/authorRoutes";
import cacheRoutes from "./routes/cache.Routes";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors());

app.use("/api/authors", authorRoutes);
app.use("/api/cache", cacheRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
