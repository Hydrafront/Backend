"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true,
    },
    chainId: {
        type: Number,
        required: true,
    },
    tokenAddress: {
        type: String,
        required: true,
    },
    maker: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    usd: {
        type: Number,
        required: true,
    },
    eth: {
        type: Number,
        required: true,
    },
    token: {
        type: Number,
        required: true,
    },
    txHash: {
        type: String,
        required: true,
    },
}, { timestamps: true });
const Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
exports.default = Transaction;
//# sourceMappingURL=Transaction.js.map