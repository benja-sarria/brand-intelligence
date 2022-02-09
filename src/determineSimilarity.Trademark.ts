import { similarityWithoutTranslation } from "./utils/similarityWithoutTranslation";
import { similarityWithTranslation } from "./utils/similarityWithTranslation";
import { translateWords } from "./utils/translator";

const { getAvg: getAverage } = require("./utils/getAverage");
const { getPhnticAvg: getPhoneticAverage } = require("./utils/phoneticAverage");
const {
    univSentEnc: universalSentenceEncoder,
} = require("./utils/universalSentenceEncoder");
const { Container: container } = require("./utils/fileManagement");

const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const metaphone = natural.Metaphone;
const { db: trademarkDatabase } = require("./data/trademarkDatabase");
// const sw = require("stopword");

interface Trademark {
    trademarkName: string;
    trademarkTranslation: string;
    translate: boolean;
}

class Trademark {
    cosineSimilarity!: [];
    constructor(
        trademarkName: string,
        trademarkTranslation: string,
        translate: string
    ) {
        this.trademarkName = trademarkName;
        this.trademarkTranslation = trademarkTranslation;
        this.translate = translate.toString() === "true";
    }

    determineSimilarity = async (/* res: any, */ next: Function) => {
        try {
            console.log(`This.translate= ${this.translate}`);

            if (!this.translate) {
                await similarityWithoutTranslation(
                    this.trademarkName,
                    this.translate,
                    next
                );
            } else {
                await similarityWithTranslation(
                    this.trademarkName,
                    this.trademarkTranslation,
                    this.translate,
                    next
                );
            }
        } catch (error: any) {
            throw new Error(error.message);
        }
    };
}

exports.Trademark = Trademark;
