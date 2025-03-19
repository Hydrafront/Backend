"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Token_1 = __importDefault(require("../models/Token"));
exports.default = (io) => {
    io.on("connection", (socket) => {
        console.log("New client connected");
        socket.on("token-created", (token) => {
            io.emit("token-created", token);
        });
        socket.on("save-transaction", (transaction) => {
            io.emit("save-transaction", transaction);
        });
        socket.on("update-token-info", (data) => {
            Token_1.default.findOneAndUpdate({ tokenAddress: data.tokenAddress }, { $set: Object.assign({}, data) }, { new: true }, (err, token) => {
                if (err) {
                    console.log(err);
                }
                else {
                    io.emit("update-token-info", token);
                }
            });
        });
        socket.on("update-boosted", (boost) => {
            io.emit("update-boosted", boost);
        });
        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });
};
//# sourceMappingURL=token.js.map