"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const Token_1 = __importDefault(require("../../models/Token"));
const Transaction_1 = __importDefault(require("../../models/Transaction"));
const router = (0, express_1.Router)();
// @route   GET api/token/get-by-address/:tokenAddress
// @desc    Get token by address
// @access  Public
router.get("/get-by-address/:tokenAddress", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = yield Token_1.default.findOne({
            tokenAddress: req.params.tokenAddress,
        });
        if (!token) {
            return res.status(http_status_codes_1.default.NOT_FOUND).json({
                errors: [{ msg: "Token not found" }],
            });
        }
        res.json(token);
    }
    catch (err) {
        console.error(err.message);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
// @route   GET api/token/get-transaction-by-address/:tokenAddress
// @desc    Get transactions by token address
// @access  Public
router.get("/get-transactions-by-address/:tokenAddress", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield Transaction_1.default.find({
            tokenAddress: req.params.tokenAddress,
        }).sort({ createdAt: 1 });
        res.json(transactions);
    }
    catch (err) {
        console.error(err.message);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
router.get("/get-transactions-in-range/:tokenAddress/:from/:to", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tokenAddress, from, to } = req.params;
        const allTokens = yield Transaction_1.default.find({ tokenAddress }).sort({
            createdAt: 1,
        });
        const oldestToken = allTokens[0];
        const transactions = yield Transaction_1.default.find({
            tokenAddress,
            // createdAt: {
            //   $gte: new Date(Number(from) * 1000),
            //   $lte: new Date(Number(to) * 1000),
            // },
        }).sort({ createdAt: -1 });
        console.log(transactions.length);
        res.json({
            data: transactions,
            noData: new Date(oldestToken.createdAt) > new Date(Number(to) * 1000),
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
// @route   POST api/token
// @desc    Register presale token info
// @access  Public
router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res
            .status(http_status_codes_1.default.BAD_REQUEST)
            .json({ errors: errors.array() });
    }
    try {
        const { tokenAddress } = req.body;
        let token = yield Token_1.default.findOne({ tokenAddress });
        // if (token) {
        //   return res.status(HttpStatusCodes.BAD_REQUEST).json({
        //     errors: [{ msg: "Presale token already exists" }],
        //   });
        // }
        const tokenFields = Object.assign({ tokenAddress }, req.body.info);
        const newToken = yield Token_1.default.create(tokenFields);
        res.json({ token: newToken });
    }
    catch (err) {
        console.error(err.message);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
// @route   GET api/token/get-all
// @desc    Get all tokens
// @access  Public
router.post("/get", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { chainId, sort, dex, age, minProgress, maxProgress, boosted, ads, search, page, } = req.body;
    const query = {};
    if (chainId)
        query.chainId = chainId;
    if (dex)
        query.dex = dex;
    if (age) {
        if (age[0] === "≤")
            query.createdAt = {
                $lte: new Date(Date.now() -
                    Number(age.slice(1, age.length - 1)) * 24 * 60 * 60 * 1000),
            };
        if (age[0] === "≥")
            query.createdAt = {
                $gte: new Date(Date.now() -
                    Number(age.slice(1, age.length - 1)) * 24 * 60 * 60 * 1000),
            };
    }
    if (minProgress && !minProgress)
        query.progress = {
            $gte: Number(minProgress.slice(0, minProgress.length - 1)),
        };
    if (maxProgress && !maxProgress)
        query.progress = {
            $lte: Number(maxProgress.slice(0, maxProgress.length - 1)),
        };
    if (minProgress && maxProgress)
        query.progress = {
            $gte: Number(minProgress.slice(0, minProgress.length - 1)),
            $lte: Number(maxProgress.slice(0, maxProgress.length - 1)),
        };
    if (boosted)
        query.boost = { $gt: 0 };
    // if (ads) query.ads = ads;
    if (search)
        query.$or = [
            { name: { $regex: search, $options: "i" } },
            { symbol: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
            { tokenAddress: { $regex: search, $options: "i" } },
        ];
    const limit = 5;
    try {
        const tokenCount = yield Token_1.default.countDocuments(Object.assign({}, query)).sort({
            [sort]: -1,
        });
        const tokens = yield Token_1.default.find(Object.assign({}, query))
            .sort({ [sort]: -1 })
            .skip((page - 1) * limit)
            .limit(limit);
        res.json({ tokens, tokenCount });
    }
    catch (err) {
        console.error(err.message);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
// @route   POST api/token/save-transaction
// @desc    Save transaction
// @access  Public
router.post("/save-transaction", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { transaction } = req.body;
        const txFields = Object.assign({}, transaction);
        yield Token_1.default.findOneAndUpdate({ tokenAddress: transaction.tokenAddress }, { $inc: { transactionCount: 1, volume: transaction.usd } }, { new: true });
        const newTransaction = yield Transaction_1.default.create(txFields);
        res.json(newTransaction);
    }
    catch (err) {
        console.error(err.message);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
// @route   PUT api/token/update-boosted
// @desc    Update boosted
// @access  Public
router.put("/update-boosted", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tokenAddress, boost } = req.body;
        const token = yield Token_1.default.findOneAndUpdate({ tokenAddress }, { $inc: { boost } });
        res.json({ msg: "Token boosted updated", boost: token.boost });
    }
    catch (err) {
        console.error(err.message);
        res.status(http_status_codes_1.default.INTERNAL_SERVER_ERROR).send("Server Error");
    }
}));
exports.default = router;
//# sourceMappingURL=token.js.map