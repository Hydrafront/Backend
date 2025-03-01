"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const traderSchema = new mongoose_1.Schema({
    address: {
        type: String,
        required: true,
    },
    transactions: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Transaction",
        },
    ],
});
const Trader = (0, mongoose_1.model)("Trader", traderSchema);
exports.default = Trader;
//# sourceMappingURL=Trader.js.map