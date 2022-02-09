const { Trademark: trademark } = require("../determineSimilarity.Trademark");

export const trademarkProcessor = (req: any, res: any, next: Function) => {
    if (!req.query.trademark) {
        res.json({
            error: "You have to send your trademark name through a query for us to evaluate",
        });
    }
    const currentTrademark = new trademark(
        req.query.trademark,
        req.translatedTrademark,
        req.translation
    );
    req.normalizedTrademark = req.query.trademark.toLowerCase();
    currentTrademark.determineSimilarity(next);
};
