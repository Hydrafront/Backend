"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const database_1 = __importDefault(require("../config/database"));
const token_1 = __importDefault(require("./routes/api/token"));
const alchemy_1 = __importDefault(require("./alchemy"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
(0, alchemy_1.default)();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "*",
}));
// Connect MongoDB
(0, database_1.default)();
// Middleware
app.use(express_1.default.json());
// API routes
app.use("/api/token", token_1.default);
// Health check route
app.get("/api", (req, res) => {
    res.send("API Running");
});
// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "../../frontend/dist/index.html"));
    });
}
// Export app for Vercel
exports.default = app;
//# sourceMappingURL=server.js.map