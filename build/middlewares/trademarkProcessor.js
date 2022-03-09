"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trademarkProcessor = void 0;
const { Trademark: trademark } = require("../determineSimilarity.Trademark");
const trademarkProcessor = (req, res, next) => {
    if (!req.query.trademark) {
        res.json({
            error: "You have to send your trademark name through a query for us to evaluate",
        });
    }
    const currentTrademark = new trademark(req.query.trademark, req.translatedTrademark, req.translation);
    req.normalizedTrademark = req.query.trademark.toLowerCase();
    currentTrademark.determineSimilarity(next);
};
exports.trademarkProcessor = trademarkProcessor;
//# sourceMappingURL=trademarkProcessor.js.map