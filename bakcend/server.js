import express from "express";
import authRoutes from "./routes/auth.routes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectToDatabase } from "./lib/connectDb.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

connectToDatabase();
app.listen(PORT, () => {
  console.log(`app listening on port ${PORT}`);
});
