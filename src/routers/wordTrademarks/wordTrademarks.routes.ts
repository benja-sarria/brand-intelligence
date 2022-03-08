import * as express from "express";
import { allowAccess } from "../../middlewares/allowAcess";
import { determineTranslation } from "../../middlewares/determineTranslation";
import { trademarkProcessor } from "../../middlewares/trademarkProcessor";
import { trademarkTranslator } from "../../middlewares/trademarkTranslator";

export const router = express.Router();

router.get(
    "/",
    [
        allowAccess,
        determineTranslation,
        trademarkTranslator,
        trademarkProcessor,
    ],
    async (req: any, res: any) => {
        const query = req.query.trademark.replace(/\s/g, "_");

        const json = require(`../../data/results/${query}.json`);
        res.json(json);
        /* res.redirect(
            `/api/wordTrademark/result?trademark=${req.normalizedTrademark}&translation=${req.translation}`
        ); */
    }
);

router.get("/result", (req: any, res: any) => {
    const query = req.query.trademark.replace(/\s/g, "_");

    const json = require(`../../data/results/${query}.json`);
    res.json(json);
});
