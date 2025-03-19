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
const alchemyConfig_1 = __importDefault(require("./alchemyConfig"));
const path_1 = __importDefault(require("path"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const token_2 = __importDefault(require("./socket/token"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Connect MongoDB
(0, database_1.default)();
// Socket
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
(0, token_2.default)(io);
// Alchemy
(0, alchemyConfig_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: "*",
}));
// API routes
app.use("/api/token", token_1.default);
// Health check route
app.get("/testing", (req, res) => {
    res.send("API is running!!!!!");
});
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
// Serve frontend in production
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(path_1.default.join(__dirname, "../../frontend/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "../../frontend/dist/index.html"));
    });
}
const port = process.env.PORT || 5000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
// Export app for Vercel
exports.default = app;
//# sourceMappingURL=server.js.map