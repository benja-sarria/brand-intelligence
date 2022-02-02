const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const metaphone = natural.Metaphone;
const { db: trademarkDatabase } = require("./data/trademarkDatabase");

interface Trademark {
    trademarkName: string;
}

class Trademark {
    constructor(trademarkName: string) {
        this.trademarkName = trademarkName;
    }

    private getAverage = (arrayWithNumbers: string[]) => {
        let sum = 0;
        for (let i = 0; i < arrayWithNumbers.length; i += 1) {
            sum += parseFloat(arrayWithNumbers[i]); //don't forget to add the base
        }

        const avg = sum / arrayWithNumbers.length;
        return avg;
    };
    private getPhoneticAverage = (arrayWithBooleans: boolean[]) => {
        let sum = 0;
        for (let i = 0; i < arrayWithBooleans.length; i += 1) {
            if (arrayWithBooleans[i] === true) {
                sum += 1;
            }
        }

        const avg = sum / arrayWithBooleans.length;
        return avg;
    };

    determineSimilarity = () => {
        try {
            const normalizedTrademark = this.trademarkName.toLowerCase();
            const tokenizedTrademark = tokenizer.tokenize(normalizedTrademark);

            const similarTrademarks: {}[] = [];

            trademarkDatabase.forEach((element: { name: string }) => {
                const normalizedDatabaseName = element.name.toLowerCase();
                const tokenizedDatabaseName = tokenizer.tokenize(
                    normalizedDatabaseName
                );

                const stringDistanceSimilarityDamerau: string[] = [];
                const stringDistanceSimilarityJaro: string[] = [];
                const phoneticSimilarity: boolean[] = [];
                const totalSimilarity = [];
                tokenizedTrademark.forEach((word: string) => {
                    tokenizedDatabaseName.forEach((text: string) => {
                        // shows number of characters that differ - Less is more similar
                        stringDistanceSimilarityDamerau.push(
                            natural.DamerauLevenshteinDistance(word, text, {
                                restricted: true,
                            })
                        );
                        // shows similarity on a scale from 0 (unlike) to 1 (identical)
                        stringDistanceSimilarityJaro.push(
                            natural.JaroWinklerDistance(word, text)
                        );

                        // Determines whether a word is similar by true/false
                        phoneticSimilarity.push(metaphone.compare(word, text));
                    });
                });
                if (stringDistanceSimilarityDamerau.length === 0) {
                    const error = new Error();
                    error.message = "We couldn't calculate Damerau's Average";
                    throw error;
                }
                const avgDamerau = this.getAverage(
                    stringDistanceSimilarityDamerau
                );
                // Less is more similar
                totalSimilarity.push(avgDamerau);
                if (stringDistanceSimilarityJaro.length === 0) {
                    const error = new Error();
                    error.message = "We couldn't calculate Jaro's Average";
                    throw error;
                }
                const avgJaro = this.getAverage(stringDistanceSimilarityJaro);
                // Higher is more similar
                totalSimilarity.push(avgJaro);
                if (phoneticSimilarity.length === 0) {
                    const error = new Error();
                    error.message = "We couldn't calculate Phonetic's Average";
                    throw error;
                }
                const avgPhonetic = this.getPhoneticAverage(phoneticSimilarity);
                // Higher or equal to .50 is similar
                totalSimilarity.push(avgPhonetic);

                if (
                    totalSimilarity[0] <= 2 &&
                    totalSimilarity[1] > 0.7 &&
                    totalSimilarity[2] >= 0.25
                ) {
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

            return similarTrademarks;
        } catch (error: any) {
            throw new Error(error.message);
        }
    };
}

exports.Trademark = Trademark;
