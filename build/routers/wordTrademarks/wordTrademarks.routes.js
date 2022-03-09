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
const allowAcess_1 = require("../../middlewares/allowAcess");
const determineTranslation_1 = require("../../middlewares/determineTranslation");
const trademarkProcessor_1 = require("../../middlewares/trademarkProcessor");
const trademarkTranslator_1 = require("../../middlewares/trademarkTranslator");
exports.router = express.Router();
exports.router.get("/", [
    allowAcess_1.allowAccess,
    determineTranslation_1.determineTranslation,
    trademarkTranslator_1.trademarkTranslator,
    trademarkProcessor_1.trademarkProcessor,
], async (req, res) => {
    const query = req.query.trademark.replace(/\s/g, "_");
    const json = require(`../../data/results/${query}.json`);
    res.json(json);
    /* res.redirect(
        `/api/wordTrademark/result?trademark=${req.normalizedTrademark}&translation=${req.translation}`
    ); */
});
exports.router.get("/result", (req, res) => {
    const query = req.query.trademark.replace(/\s/g, "_");
    const json = require(`../../data/results/${query}.json`);
    res.json(json);
});
//# sourceMappingURL=wordTrademarks.routes.js.map