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
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = __importDefault(require("config"));
// Set strictQuery to false to prepare for Mongoose 7
mongoose_1.default.set('strictQuery', false);
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Try to get MongoDB URI from environment variable first, then config
        const mongoURI = process.env.MONGODB_URI || config_1.default.get('mongoURI');
        yield mongoose_1.default.connect(mongoURI);
        console.log('MongoDB Connected...');
    }
    catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        // Exit process with failure
        process.exit(1);
    }
});
exports.default = connectDB;
//# sourceMappingURL=database.js.map