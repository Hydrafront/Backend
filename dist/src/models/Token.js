"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const tokenSchema = new mongoose_1.Schema({
    type: {
        type: String,
        required: true,
    },
    tokenAddress: {
        type: String,
        required: true,
    },
    chainId: {
        type: Number,
        required: true,
    },
    dex: {
        name: String,
        address: String,
    },
    name: {
        type: String,
        required: true,
    },
    symbol: {
        type: String,
        required: true,
    },
    creator: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    logo: {
        type: String,
    },
    banner: {
        type: String,
    },
    decimals: {
        type: Number,
        default: 18,
    },
    website: {
        type: String,
    },
    telegram: {
        type: String,
    },
    twitter: {
        type: String,
    },
    discord: {
        type: String,
    },
    initialBuy: {
        type: Number,
        default: 0,
    },
    boost: {
        type: Number,
        default: 0,
    },
    progress: {
        type: Number,
        required: true,
    },
    marketCap: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    volume: {
        type: Number,
        default: 0,
    },
    holders: [String],
    transactionCount: {
        type: Number,
        default: 0,
    },
    makerCount: {
        type: Number,
        default: 0,
    },
    _5M: {
        type: Number,
        default: 0,
    },
    _1H: {
        type: Number,
        default: 0,
    },
    _6H: {
        type: Number,
        default: 0,
    },
    _24H: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });
const Token = (0, mongoose_1.model)("Token", tokenSchema);
exports.default = Token;
//# sourceMappingURL=Token.js.map