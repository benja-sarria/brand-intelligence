"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.similarityWithoutTranslation = void 0;
const sw = require("stopword");
const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const metaphone = natural.Metaphone;
const fileManagement_1 = __importDefault(require("../utils/fileManagement"));
const trademarkDatabase_1 = require("../data/trademarkDatabase");
const universalSentenceEncoder_1 = require("../utils/universalSentenceEncoder");
const getAverage_1 = require("../utils/getAverage");
const phoneticAverage_1 = require("../utils/phoneticAverage");
const similarityWithoutTranslation = async (trademarkName, translate, next) => {
    console.log("ejecutando sin traducción");
    const createdFile = new fileManagement_1.default(trademarkName.toLowerCase(), trademarkName, translate);
    createdFile.createFile();
    const normalizedTrademark = trademarkName.toLowerCase();
    const tokenizedTrademark = tokenizer.tokenize(normalizedTrademark);
    const similarTrademarks = [];
    const processedTrademarks = [];
    trademarkDatabase_1.db.forEach(async (element, index) => {
        const normalizedDatabaseName = element.name.toLowerCase();
        const tokenizedDatabaseName = tokenizer.tokenize(normalizedDatabaseName);
        const cosineSimilarity = await (0, universalSentenceEncoder_1.universalSentenceEncoder)(trademarkName, element.name, "", "", translate); /* [] */
        if (!cosineSimilarity) {
            const error = new Error();
            error.message =
                "We had some trouble with the universal sentence encoder module";
            throw error;
        }
        const stringDistanceSimilarityDamerau = [];
        const stringDistanceSimilarityJaro = [];
        const phoneticSimilarity = [];
        const totalSimilarity = [];
        tokenizedTrademark.forEach((word) => {
            tokenizedDatabaseName.forEach((text) => {
                // shows number of characters that differ - Less is more similar
                stringDistanceSimilarityDamerau.push(natural.DamerauLevenshteinDistance(word, text, {
                    restricted: true,
                }));
                // shows similarity on a scale from 0 (unlike) to 1 (identical)
                stringDistanceSimilarityJaro.push(natural.JaroWinklerDistance(word, text));
                // Determines whether a word is similar by true/false
                phoneticSimilarity.push(metaphone.compare(word, text));
            });
        });
        if (stringDistanceSimilarityDamerau.length === 0) {
            const error = new Error();
            error.message = "We couldn't calculate Damerau's Average";
            throw error;
        }
        const avgDamerau = (0, getAverage_1.getAverage)(stringDistanceSimilarityDamerau);
        // Less is more similar
        totalSimilarity.push(avgDamerau);
        if (stringDistanceSimilarityJaro.length === 0) {
            const error = new Error();
            error.message = "We couldn't calculate Jaro's Average";
            throw error;
        }
        const avgJaro = (0, getAverage_1.getAverage)(stringDistanceSimilarityJaro);
        // Higher is more similar
        totalSimilarity.push(avgJaro);
        if (phoneticSimilarity.length === 0) {
            const error = new Error();
            error.message = "We couldn't calculate Phonetic's Average";
            throw error;
        }
        const avgPhonetic = (0, phoneticAverage_1.getPhoneticAverage)(phoneticSimilarity);
        // Higher or equal to .50 is similar
        totalSimilarity.push(avgPhonetic);
        totalSimilarity.push(cosineSimilarity);
        if ((totalSimilarity[0] <= 4 &&
            totalSimilarity[1] >= 0.45 &&
            totalSimilarity[2] >= 0.25) ||
            totalSimilarity[3] >= 0.7) {
            similarTrademarks.push({
                similarTrademark: element.name,
            });
        }
        const json = require(`../data/results/${trademarkName
            .toLowerCase()
            .replace(/\s/g, "_")}.json`);
        if (!processedTrademarks.some((trademark) => {
            return trademark.name === element.name;
        })) {
            processedTrademarks.push(element);
            console.log(processedTrademarks);
        }
        if (json.results.some((trademark) => {
            return trademark.trademarkName === element.name;
        })) {
            return;
        }
        else {
            if ((((totalSimilarity[0] <= 4 &&
                totalSimilarity[1] >= 0.45 &&
                totalSimilarity[2] >= 0.25) ||
                (totalSimilarity[3] >= 0.5 &&
                    (totalSimilarity[2] >= 0.25 ||
                        (totalSimilarity[1] >= 0.4 &&
                            totalSimilarity[3] >= 0.6))) ||
                (totalSimilarity[3] >= 0.57 &&
                    totalSimilarity[0] < 5 &&
                    totalSimilarity[1] > 0.37)) &&
                totalSimilarity[1] >= 0.65) ||
                totalSimilarity[1] >= 0.9 ||
                totalSimilarity[3] >= 0.8) {
                json.results.push({
                    trademarkName: element.name,
                    criteria: totalSimilarity,
                });
                createdFile.save(json);
            }
        }
        console.log(totalSimilarity);
        if (trademarkDatabase_1.db.every((element) => {
            return processedTrademarks.includes(element);
        })) {
            next();
        }
    });
    if (similarTrademarks.length === 0) {
        return "No similarities found";
    }
    return true;
    // /*  */
    //
    //
};
exports.similarityWithoutTranslation = similarityWithoutTranslation;
//# sourceMappingURL=similarityWithoutTranslation.js.map