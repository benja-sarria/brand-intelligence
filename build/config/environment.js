"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.environment = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.environment = {
    X_RAPIDAPI_KEY: process.env.X_RAPIDAPI_KEY,
    X_RAPIDAPI_HOST: process.env.X_RAPIDAPI_HOST,
    X_RAPIDAPI_ENDPOINT: process.env.X_RAPIDAPI_ENDPOINT,
    X_RAPIDAPI_ENDPOINT_DETECT: process.env.X_RAPIDAPI_ENDPOINT_DETECT,
};
//# sourceMappingURL=environment.js.map