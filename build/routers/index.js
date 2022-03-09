"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express = __importStar(require("express"));
const wordTrademarks_routes_1 = require("./wordTrademarks/wordTrademarks.routes");
const niceClass_routes_1 = require("./niceClass/niceClass.routes");
exports.router = express.Router();
// MIDDLEWARES
exports.router.use(express.json());
exports.router.use(express.urlencoded({ extended: true }));
// ROUTES
exports.router.use("/wordTrademark", wordTrademarks_routes_1.router);
exports.router.use("/niceClass", niceClass_routes_1.router);
//# sourceMappingURL=index.js.map