"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (io) => {
    io.on("connection", (socket) => {
        console.log("New client connected");
        socket.on("token-created", (token) => {
            io.emit("token-created", token);
        });
        socket.on("save-transaction", (transaction) => {
            io.emit("save-transaction", transaction);
        });
        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
};
//# sourceMappingURL=token.js.map