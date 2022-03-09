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
const niceClasses_1 = require("../../data/niceClasses");
const allowAcess_1 = require("../../middlewares/allowAcess");
const niceClassification_1 = require("../../niceClassification");
exports.router = express.Router();
exports.router.get("/", [allowAcess_1.allowAccess], async (req, res) => {
    if (req.query.length !== 0) {
        console.log(req.query);
        const niceClassification = new niceClassification_1.NiceClassification();
        const niceClass = await niceClassification.classify(req.query.classificationSubject.toLowerCase());
        const allTerms = await niceClassification.tfClassification.formatTextData(niceClasses_1.niceClasses);
        res.json({ niceClass: niceClass, wholeClassification: allTerms });
    }
});
//# sourceMappingURL=niceClass.routes.js.map