import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "../config/database";
import token from "./routes/api/token";
import alchemy from "./alchemy";
import path from "path";

dotenv.config();
alchemy();

const app: Application = express();

app.use(
  cors({
    origin: "*",
  })
);

// Connect MongoDB
connectDB();

// Middleware
app.use(express.json());

// API routes
app.use("/api/token", token);

// Health check route
app.get("/api", (req: Request, res: Response) => {
  res.send("API Running");
});

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });
}

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export app for Vercel
export default app;
