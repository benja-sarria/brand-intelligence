"use strict";
const { getAvg: getAverage } = require("./utils/getAverage");
const { getPhnticAvg: getPhoneticAverage } = require("./utils/phoneticAverage");
const { univSentEnc: universalSentenceEncoder, } = require("./utils/universalSentenceEncoder");
const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const metaphone = natural.Metaphone;
const { db: trademarkDatabase } = require("./data/trademarkDatabase");
class Trademark {
    constructor(trademarkName) {
        this.determineSimilarity = async () => {
            try {
                const normalizedTrademark = this.trademarkName.toLowerCase();
                const tokenizedTrademark = tokenizer.tokenize(normalizedTrademark);
                const similarTrademarks = [];
                trademarkDatabase.forEach(async (element) => {
                    const normalizedDatabaseName = element.name.toLowerCase();
                    const tokenizedDatabaseName = tokenizer.tokenize(normalizedDatabaseName);
                    const cosineSimilarity = await universalSentenceEncoder(this.trademarkName, element.name); /* [] */
                    if (!cosineSimilarity) {
                        const error = new Error();
                        error.message =
                            "We had some trouble with the universal sentence encoder module";
                        throw error;
                    }
                    console.log(cosineSimilarity);
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
                    const avgDamerau = getAverage(stringDistanceSimilarityDamerau);
                    // Less is more similar
                    totalSimilarity.push(avgDamerau);
                    if (stringDistanceSimilarityJaro.length === 0) {
                        const error = new Error();
                        error.message = "We couldn't calculate Jaro's Average";
                        throw error;
                    }
                    const avgJaro = getAverage(stringDistanceSimilarityJaro);
                    // Higher is more similar
                    totalSimilarity.push(avgJaro);
                    if (phoneticSimilarity.length === 0) {
                        const error = new Error();
                        error.message = "We couldn't calculate Phonetic's Average";
                        throw error;
                    }
                    const avgPhonetic = getPhoneticAverage(phoneticSimilarity);
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
                    console.log(totalSimilarity);
                });
                console.log(tokenizedTrademark);
                if (similarTrademarks.length === 0) {
                    return "No similarities found";
                }
                return await similarTrademarks;
            }
            catch (error) {
                throw new Error(error.message);
            }
        };
        this.trademarkName = trademarkName;
    }
}
exports.Trademark = Trademark;
//# sourceMappingURL=index.js.map