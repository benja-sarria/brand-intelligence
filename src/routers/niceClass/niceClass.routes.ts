import * as express from "express";
import { niceClasses } from "../../data/niceClasses";
import { allowAccess } from "../../middlewares/allowAcess";
import { NiceClassification } from "../../niceClassification";

export const router = express.Router();

router.get("/", [allowAccess], async (req: any, res: any) => {
    if (req.query.length !== 0) {
        console.log(req.query);
        const niceClassification = new NiceClassification();

        const niceClass = await niceClassification.classify(
            req.query.classificationSubject.toLowerCase()
        );
        const allTerms =
            await niceClassification.tfClassification.formatTextData(
                niceClasses
            );

        res.json({ niceClass: niceClass, wholeClassification: allTerms });
    }
});
