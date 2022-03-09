"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.similarityWithTranslation = void 0;
const sw = require("stopword");
const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const metaphone = natural.Metaphone;
const fileManagement_1 = __importDefault(require("../utils/fileManagement"));
const trademarkDatabase_1 = require("../data/trademarkDatabase");
const universalSentenceEncoder_1 = require("../utils/universalSentenceEncoder");
const getAverage_1 = require("../utils/getAverage");
const phoneticAverage_1 = require("../utils/phoneticAverage");
const translator_1 = require("./translator");
const similarityWithTranslation = async (trademarkName, trademarkTranslation, translate, next) => {
    {
        const createdFile = new fileManagement_1.default(trademarkName.toLowerCase(), trademarkName, translate, trademarkTranslation);
        console.log("clasificando con traducción");
        console.log(trademarkName);
        console.log(trademarkTranslation);
        createdFile.createFile();
        const normalizedTrademark = trademarkTranslation.toLowerCase();
        const translatedTokenizedTrademark = sw.removeStopwords(tokenizer.tokenize(normalizedTrademark), sw.es);
        const sourceTokenizedTrademark = sw.removeStopwords(tokenizer.tokenize(trademarkName.toLowerCase()), sw.es);
        console.log(translatedTokenizedTrademark);
        const similarTrademarks = [];
        const processedTrademarks = [];
        trademarkDatabase_1.db.forEach(async (element, index) => {
            const normalizedDatabaseName = element.name.toLowerCase();
            const translatedDbName = await (0, translator_1.translateWords)(normalizedDatabaseName, async (translatedDbName) => {
                console.log(translatedDbName);
                const spanishTokenizedDatabaseName = tokenizer.tokenize(translatedDbName);
                const originalTokenizedDatabaseName = tokenizer.tokenize(normalizedDatabaseName);
                console.log(spanishTokenizedDatabaseName);
                const cosineSimilarity = await (0, universalSentenceEncoder_1.universalSentenceEncoder)(trademarkName, element.name, trademarkTranslation, translatedDbName, translate); /* [] */
                if (!cosineSimilarity) {
                    const error = new Error();
                    error.message =
                        "We had some trouble with the universal sentence encoder module";
                    throw error;
                }
                const stringDistanceSimilarityDamerauEsToEs = [];
                const stringDistanceSimilarityDamerauEsToSrc = [];
                const stringDistanceSimilarityJaroEsToEs = [];
                const stringDistanceSimilarityJaroEsToSrc = [];
                const phoneticSimilarityEsToEs = [];
                const phoneticSimilarityEsToSrc = [];
                const stringDistanceSimilarityDamerauSrcToEs = [];
                const stringDistanceSimilarityDamerauSrcToSrc = [];
                const stringDistanceSimilarityJaroSrcToEs = [];
                const stringDistanceSimilarityJaroSrcToSrc = [];
                const phoneticSimilaritySrcToEs = [];
                const phoneticSimilaritySrcToSrc = [];
                const totalSimilarity = [];
                translatedTokenizedTrademark.forEach((word) => {
                    console.log(`The tokenized trademark is: ${translatedTokenizedTrademark}`);
                    console.log(spanishTokenizedDatabaseName);
                    console.log(originalTokenizedDatabaseName);
                    spanishTokenizedDatabaseName.forEach((text) => {
                        // shows number of characters that differ - Less is more similar
                        stringDistanceSimilarityDamerauEsToEs.push(natural.DamerauLevenshteinDistance(word, text, {
                            restricted: true,
                        }));
                        // shows similarity on a scale from 0 (unlike) to 1 (identical)
                        stringDistanceSimilarityJaroEsToEs.push(natural.JaroWinklerDistance(word, text));
                        // Determines whether a word is similar by true/false
                        phoneticSimilarityEsToEs.push(metaphone.compare(word, text));
                    });
                    originalTokenizedDatabaseName.forEach((text) => {
                        // shows number of characters that differ - Less is more similar
                        stringDistanceSimilarityDamerauEsToSrc.push(natural.DamerauLevenshteinDistance(word, text, {
                            restricted: true,
                        }));
                        // shows similarity on a scale from 0 (unlike) to 1 (identical)
                        stringDistanceSimilarityJaroEsToSrc.push(natural.JaroWinklerDistance(word, text));
                        // Determines whether a word is similar by true/false
                        phoneticSimilarityEsToSrc.push(metaphone.compare(word, text));
                    });
                });
                sourceTokenizedTrademark.forEach((word) => {
                    spanishTokenizedDatabaseName.forEach((text) => {
                        // shows number of characters that differ - Less is more similar
                        stringDistanceSimilarityDamerauSrcToEs.push(natural.DamerauLevenshteinDistance(word, text, {
                            restricted: true,
                        }));
                        // shows similarity on a scale from 0 (unlike) to 1 (identical)
                        stringDistanceSimilarityJaroSrcToEs.push(natural.JaroWinklerDistance(word, text));
                        // Determines whether a word is similar by true/false
                        phoneticSimilaritySrcToEs.push(metaphone.compare(word, text));
                    });
                    originalTokenizedDatabaseName.forEach((text) => {
                        // shows number of characters that differ - Less is more similar
                        stringDistanceSimilarityDamerauSrcToSrc.push(natural.DamerauLevenshteinDistance(word, text, {
                            restricted: true,
                        }));
                        // shows similarity on a scale from 0 (unlike) to 1 (identical)
                        stringDistanceSimilarityJaroSrcToSrc.push(natural.JaroWinklerDistance(word, text));
                        // Determines whether a word is similar by true/false
                        phoneticSimilaritySrcToSrc.push(metaphone.compare(word, text));
                    });
                });
                console.log(`Damerau EsToEs: ${stringDistanceSimilarityDamerauEsToEs}`);
                console.log(`Damerau EsToEs: ${stringDistanceSimilarityDamerauEsToSrc}`);
                console.log(`Damerau EsToEs: ${stringDistanceSimilarityDamerauSrcToEs}`);
                console.log(`Damerau EsToEs: ${stringDistanceSimilarityDamerauSrcToSrc}`);
                if (stringDistanceSimilarityDamerauEsToEs.length ===
                    0 ||
                    stringDistanceSimilarityDamerauEsToSrc.length ===
                        0 ||
                    stringDistanceSimilarityDamerauSrcToEs.length ===
                        0 ||
                    stringDistanceSimilarityDamerauSrcToSrc.length === 0) {
                    const error = new Error();
                    error.message =
                        "We couldn't calculate Damerau's Average";
                    throw error;
                }
                const avgDamerauEsToEs = (0, getAverage_1.getAverage)(stringDistanceSimilarityDamerauEsToEs);
                const avgDamerauEsToSrc = (0, getAverage_1.getAverage)(stringDistanceSimilarityDamerauEsToSrc);
                const avgDamerauSrcToEs = (0, getAverage_1.getAverage)(stringDistanceSimilarityDamerauSrcToEs);
                const avgDamerauSrcToSrc = (0, getAverage_1.getAverage)(stringDistanceSimilarityDamerauSrcToSrc);
                const betterDamerauEs = avgDamerauEsToEs < avgDamerauEsToSrc
                    ? avgDamerauEsToEs
                    : avgDamerauEsToSrc;
                const betterDamerauSrc = avgDamerauSrcToEs < avgDamerauSrcToSrc
                    ? avgDamerauSrcToEs
                    : avgDamerauSrcToSrc;
                // Less is more similar
                totalSimilarity.push(betterDamerauEs < betterDamerauSrc
                    ? betterDamerauEs
                    : betterDamerauSrc);
                if (stringDistanceSimilarityJaroEsToEs.length === 0 ||
                    stringDistanceSimilarityJaroEsToSrc.length === 0 ||
                    stringDistanceSimilarityJaroSrcToEs.length === 0 ||
                    stringDistanceSimilarityJaroSrcToSrc.length === 0) {
                    const error = new Error();
                    error.message =
                        "We couldn't calculate Jaro's Average";
                    throw error;
                }
                const avgJaroEsToEs = (0, getAverage_1.getAverage)(stringDistanceSimilarityJaroEsToEs);
                const avgJaroEsToSrc = (0, getAverage_1.getAverage)(stringDistanceSimilarityJaroEsToSrc);
                const avgJaroSrcToEs = (0, getAverage_1.getAverage)(stringDistanceSimilarityJaroSrcToEs);
                const avgJaroSrcToSrc = (0, getAverage_1.getAverage)(stringDistanceSimilarityJaroSrcToSrc);
                const betterJaroEs = avgJaroEsToEs > avgJaroEsToSrc
                    ? avgJaroEsToEs
                    : avgJaroEsToSrc;
                const betterJaroSrc = avgJaroSrcToEs > avgJaroSrcToSrc
                    ? avgJaroSrcToEs
                    : avgJaroSrcToSrc;
                // Higher is more similar
                totalSimilarity.push(betterJaroEs > betterJaroSrc
                    ? betterJaroEs
                    : betterJaroSrc);
                if (phoneticSimilarityEsToEs.length === 0 ||
                    phoneticSimilarityEsToSrc.length === 0 ||
                    phoneticSimilaritySrcToEs.length === 0 ||
                    phoneticSimilaritySrcToSrc.length === 0) {
                    const error = new Error();
                    error.message =
                        "We couldn't calculate Phonetic's Average";
                    throw error;
                }
                const avgPhoneticEsToEs = (0, phoneticAverage_1.getPhoneticAverage)(phoneticSimilarityEsToEs);
                const avgPhoneticEsToSrc = (0, phoneticAverage_1.getPhoneticAverage)(phoneticSimilarityEsToSrc);
                const avgPhoneticSrcToEs = (0, phoneticAverage_1.getPhoneticAverage)(phoneticSimilaritySrcToEs);
                const avgPhoneticSrcToSrc = (0, phoneticAverage_1.getPhoneticAverage)(phoneticSimilaritySrcToSrc);
                const betterPhoneticEs = avgPhoneticEsToEs > avgPhoneticEsToSrc
                    ? avgPhoneticEsToEs
                    : avgPhoneticEsToSrc;
                const betterPhoneticSrc = avgPhoneticSrcToEs > avgPhoneticSrcToSrc
                    ? avgPhoneticSrcToEs
                    : avgPhoneticSrcToSrc;
                // Higher or equal to .50 is similar
                totalSimilarity.push(betterPhoneticEs > betterPhoneticSrc
                    ? betterPhoneticEs
                    : betterPhoneticSrc);
                totalSimilarity.push(+cosineSimilarity);
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
                    return (trademark.trademarkName === element.name);
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
        });
        console.log(translatedTokenizedTrademark);
        console.log(sourceTokenizedTrademark);
        if (similarTrademarks.length === 0) {
            return "No similarities found";
        }
        return true;
    }
};
exports.similarityWithTranslation = similarityWithTranslation;
//# sourceMappingURL=similarityWithTranslation.js.map