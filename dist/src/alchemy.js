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
Object.defineProperty(exports, "__esModule", { value: true });
const alchemy_sdk_1 = require("alchemy-sdk");
exports.default = () => __awaiter(void 0, void 0, void 0, function* () {
    const config = {
        apiKey: process.env.ALCHEMY_API_KEY,
        network: alchemy_sdk_1.Network.MATIC_AMOY,
    };
    const alchemy = new alchemy_sdk_1.Alchemy(config);
    alchemy.ws.on({
        address: process.env.CONTRACT_ADDRESS,
    }, (tx) => {
        console.log(tx.address);
    });
});
//# sourceMappingURL=alchemy.js.map