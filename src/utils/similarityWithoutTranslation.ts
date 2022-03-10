const sw = require("stopword");
const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const metaphone = natural.Metaphone;

import Container from "../utils/fileManagement";
import { db as trademarkDatabase } from "../data/trademarkDatabase";
import { universalSentenceEncoder } from "../utils/universalSentenceEncoder";
import { getAverage } from "../utils/getAverage";
import { getPhoneticAverage } from "../utils/phoneticAverage";

export const similarityWithoutTranslation = async (
    trademarkName: string,
    translate: boolean,
    next: Function
) => {
    console.log("ejecutando sin traducción");

    const createdFile = new Container(
        trademarkName.toLowerCase(),
        trademarkName,
        translate
    );
    createdFile.createFile();
    const normalizedTrademark = trademarkName.toLowerCase();
    const tokenizedTrademark = tokenizer.tokenize(normalizedTrademark);

    const similarTrademarks: {}[] = [];
    const processedTrademarks: { name: string; niceClass: number[] }[] = [];
    trademarkDatabase.forEach(
        async (
            element: { name: string; niceClass: number[] },
            index: number
        ) => {
            const normalizedDatabaseName = element.name.toLowerCase();
            const tokenizedDatabaseName = tokenizer.tokenize(
                normalizedDatabaseName
            );

            const cosineSimilarity: [] = await universalSentenceEncoder(
                trademarkName,
                element.name,
                "",
                "",
                translate
            ); /* [] */
            if (!cosineSimilarity) {
                const error = new Error();
                error.message =
                    "We had some trouble with the universal sentence encoder module";
                throw error;
            }

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

            if (
                (totalSimilarity[0] <= 4 &&
                    totalSimilarity[1] >= 0.45 &&
                    totalSimilarity[2] >= 0.25) ||
                totalSimilarity[3] >= 0.7
            ) {
                similarTrademarks.push({
                    similarTrademark: element.name,
                });
            }
            const json = require(`../data/results/${trademarkName
                .toLowerCase()
                .replace(/\s/g, "_")}.json`);
            if (
                !processedTrademarks.some((trademark) => {
                    return trademark.name === element.name;
                })
            ) {
                processedTrademarks.push(element);
                console.log(processedTrademarks);
            }
            if (
                json.results.some(
                    (trademark: { trademarkName: string; criteria: [] }) => {
                        return trademark.trademarkName === element.name;
                    }
                )
            ) {
                return;
            } else {
                if (
                    (((totalSimilarity[0] <= 4 &&
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
                    totalSimilarity[3] >= 0.8
                ) {
                    json.results.push({
                        trademarkName: element.name,
                        criteria: totalSimilarity,
                        niceClass: element.niceClass,
                    });
                    createdFile.save(json);
                }
            }

            console.log(totalSimilarity);

            if (
                trademarkDatabase.every(
                    (element: { name: string; niceClass: number[] }) => {
                        return processedTrademarks.includes(element);
                    }
                )
            ) {
                next();
            }
        }
    );

    if (similarTrademarks.length === 0) {
        return "No similarities found";
    }
    return true;

    // /*  */
    //
    //
};
