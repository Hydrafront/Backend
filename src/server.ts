import express, { Application, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "../config/database";
import path from "path";
import http from "http";
import { Server } from "socket.io";
import tokenSocket from "./socket/token";
import tokenRoute from "./routes/api/token";
import { generateSignature } from "./utils/getSignature";

dotenv.config();

const app: Application = express();

// Connect MongoDB
connectDB();

// Socket
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
tokenSocket(io);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

// API routes
app.use("/api/token", tokenRoute);

// Health check route
app.get("/testing", (req: Request, res: Response) => {
  res.send("API is running!!!!!");
});

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
  });
}

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Export app for Vercel
export default app;
