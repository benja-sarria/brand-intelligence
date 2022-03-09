"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const similarityWithoutTranslation_1 = require("./utils/similarityWithoutTranslation");
const similarityWithTranslation_1 = require("./utils/similarityWithTranslation");
const { getAvg: getAverage } = require("./utils/getAverage");
const { getPhnticAvg: getPhoneticAverage } = require("./utils/phoneticAverage");
const { univSentEnc: universalSentenceEncoder, } = require("./utils/universalSentenceEncoder");
const { Container: container } = require("./utils/fileManagement");
const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const metaphone = natural.Metaphone;
const { db: trademarkDatabase } = require("./data/trademarkDatabase");
class Trademark {
    constructor(trademarkName, trademarkTranslation, translate) {
        this.determineSimilarity = async (/* res: any, */ next) => {
            try {
                console.log(`This.translate= ${this.translate}`);
                if (!this.translate) {
                    await (0, similarityWithoutTranslation_1.similarityWithoutTranslation)(this.trademarkName, this.translate, next);
                }
                else {
                    await (0, similarityWithTranslation_1.similarityWithTranslation)(this.trademarkName, this.trademarkTranslation, this.translate, next);
                }
            }
            catch (error) {
                throw new Error(error.message);
            }
        };
        this.trademarkName = trademarkName;
        this.trademarkTranslation = trademarkTranslation;
        this.translate = translate.toString() === "true";
    }
}
exports.Trademark = Trademark;
//# sourceMappingURL=determineSimilarity.Trademark.js.map