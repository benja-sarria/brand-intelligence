const sw = require("stopword");
const natural = require("natural");
const tokenizer = new natural.WordTokenizer();
const metaphone = natural.Metaphone;

import Container from "../utils/fileManagement";
import { db as trademarkDatabase } from "../data/trademarkDatabase";
import { universalSentenceEncoder } from "../utils/universalSentenceEncoder";
import { getAverage } from "../utils/getAverage";
import { getPhoneticAverage } from "../utils/phoneticAverage";
import { translateWords } from "./translator";

export const similarityWithTranslation = async (
    trademarkName: string,
    trademarkTranslation: string,
    translate: boolean,
    next: Function
) => {
    {
        const createdFile = new Container(
            trademarkName.toLowerCase(),
            trademarkName,
            translate,
            trademarkTranslation
        );
        console.log("clasificando con traducción");

        console.log(trademarkName);
        console.log(trademarkTranslation);

        createdFile.createFile();
        const normalizedTrademark = trademarkTranslation.toLowerCase();
        const translatedTokenizedTrademark = sw.removeStopwords(
            tokenizer.tokenize(normalizedTrademark),
            sw.es
        );
        const sourceTokenizedTrademark = sw.removeStopwords(
            tokenizer.tokenize(trademarkName.toLowerCase()),
            sw.es
        );
        console.log(translatedTokenizedTrademark);

        const similarTrademarks: {}[] = [];
        const processedTrademarks: { name: string; id: number }[] = [];
        trademarkDatabase.forEach(
            async (element: { name: string; id: number }, index: number) => {
                const normalizedDatabaseName = element.name.toLowerCase();
                const translatedDbName = await translateWords(
                    normalizedDatabaseName,
                    async (translatedDbName: string) => {
                        console.log(translatedDbName);

                        const spanishTokenizedDatabaseName =
                            tokenizer.tokenize(translatedDbName);
                        const originalTokenizedDatabaseName =
                            tokenizer.tokenize(normalizedDatabaseName);
                        console.log(spanishTokenizedDatabaseName);

                        const cosineSimilarity: [] =
                            await universalSentenceEncoder(
                                trademarkName,
                                element.name,
                                trademarkTranslation,
                                translatedDbName,
                                translate
                            ); /* [] */
                        if (!cosineSimilarity) {
                            const error = new Error();
                            error.message =
                                "We had some trouble with the universal sentence encoder module";
                            throw error;
                        }

                        const stringDistanceSimilarityDamerauEsToEs: string[] =
                            [];
                        const stringDistanceSimilarityDamerauEsToSrc: string[] =
                            [];
                        const stringDistanceSimilarityJaroEsToEs: string[] = [];
                        const stringDistanceSimilarityJaroEsToSrc: string[] =
                            [];
                        const phoneticSimilarityEsToEs: boolean[] = [];
                        const phoneticSimilarityEsToSrc: boolean[] = [];
                        const stringDistanceSimilarityDamerauSrcToEs: string[] =
                            [];
                        const stringDistanceSimilarityDamerauSrcToSrc: string[] =
                            [];
                        const stringDistanceSimilarityJaroSrcToEs: string[] =
                            [];
                        const stringDistanceSimilarityJaroSrcToSrc: string[] =
                            [];
                        const phoneticSimilaritySrcToEs: boolean[] = [];
                        const phoneticSimilaritySrcToSrc: boolean[] = [];
                        const totalSimilarity: number[] = [];
                        translatedTokenizedTrademark.forEach((word: string) => {
                            console.log(
                                `The tokenized trademark is: ${translatedTokenizedTrademark}`
                            );
                            console.log(spanishTokenizedDatabaseName);
                            console.log(originalTokenizedDatabaseName);

                            spanishTokenizedDatabaseName.forEach(
                                (text: string) => {
                                    // shows number of characters that differ - Less is more similar
                                    stringDistanceSimilarityDamerauEsToEs.push(
                                        natural.DamerauLevenshteinDistance(
                                            word,
                                            text,
                                            {
                                                restricted: true,
                                            }
                                        )
                                    );
                                    // shows similarity on a scale from 0 (unlike) to 1 (identical)
                                    stringDistanceSimilarityJaroEsToEs.push(
                                        natural.JaroWinklerDistance(word, text)
                                    );

                                    // Determines whether a word is similar by true/false
                                    phoneticSimilarityEsToEs.push(
                                        metaphone.compare(word, text)
                                    );
                                }
                            );
                            originalTokenizedDatabaseName.forEach(
                                (text: string) => {
                                    // shows number of characters that differ - Less is more similar
                                    stringDistanceSimilarityDamerauEsToSrc.push(
                                        natural.DamerauLevenshteinDistance(
                                            word,
                                            text,
                                            {
                                                restricted: true,
                                            }
                                        )
                                    );
                                    // shows similarity on a scale from 0 (unlike) to 1 (identical)
                                    stringDistanceSimilarityJaroEsToSrc.push(
                                        natural.JaroWinklerDistance(word, text)
                                    );

                                    // Determines whether a word is similar by true/false
                                    phoneticSimilarityEsToSrc.push(
                                        metaphone.compare(word, text)
                                    );
                                }
                            );
                        });
                        sourceTokenizedTrademark.forEach((word: string) => {
                            spanishTokenizedDatabaseName.forEach(
                                (text: string) => {
                                    // shows number of characters that differ - Less is more similar
                                    stringDistanceSimilarityDamerauSrcToEs.push(
                                        natural.DamerauLevenshteinDistance(
                                            word,
                                            text,
                                            {
                                                restricted: true,
                                            }
                                        )
                                    );
                                    // shows similarity on a scale from 0 (unlike) to 1 (identical)
                                    stringDistanceSimilarityJaroSrcToEs.push(
                                        natural.JaroWinklerDistance(word, text)
                                    );

                                    // Determines whether a word is similar by true/false
                                    phoneticSimilaritySrcToEs.push(
                                        metaphone.compare(word, text)
                                    );
                                }
                            );
                            originalTokenizedDatabaseName.forEach(
                                (text: string) => {
                                    // shows number of characters that differ - Less is more similar
                                    stringDistanceSimilarityDamerauSrcToSrc.push(
                                        natural.DamerauLevenshteinDistance(
                                            word,
                                            text,
                                            {
                                                restricted: true,
                                            }
                                        )
                                    );
                                    // shows similarity on a scale from 0 (unlike) to 1 (identical)
                                    stringDistanceSimilarityJaroSrcToSrc.push(
                                        natural.JaroWinklerDistance(word, text)
                                    );

                                    // Determines whether a word is similar by true/false
                                    phoneticSimilaritySrcToSrc.push(
                                        metaphone.compare(word, text)
                                    );
                                }
                            );
                        });
                        console.log(
                            `Damerau EsToEs: ${stringDistanceSimilarityDamerauEsToEs}`
                        );
                        console.log(
                            `Damerau EsToEs: ${stringDistanceSimilarityDamerauEsToSrc}`
                        );
                        console.log(
                            `Damerau EsToEs: ${stringDistanceSimilarityDamerauSrcToEs}`
                        );
                        console.log(
                            `Damerau EsToEs: ${stringDistanceSimilarityDamerauSrcToSrc}`
                        );

                        if (
                            stringDistanceSimilarityDamerauEsToEs.length ===
                                0 ||
                            stringDistanceSimilarityDamerauEsToSrc.length ===
                                0 ||
                            stringDistanceSimilarityDamerauSrcToEs.length ===
                                0 ||
                            stringDistanceSimilarityDamerauSrcToSrc.length === 0
                        ) {
                            const error = new Error();
                            error.message =
                                "We couldn't calculate Damerau's Average";
                            throw error;
                        }
                        const avgDamerauEsToEs = getAverage(
                            stringDistanceSimilarityDamerauEsToEs
                        );
                        const avgDamerauEsToSrc = getAverage(
                            stringDistanceSimilarityDamerauEsToSrc
                        );
                        const avgDamerauSrcToEs = getAverage(
                            stringDistanceSimilarityDamerauSrcToEs
                        );
                        const avgDamerauSrcToSrc = getAverage(
                            stringDistanceSimilarityDamerauSrcToSrc
                        );

                        const betterDamerauEs =
                            avgDamerauEsToEs < avgDamerauEsToSrc
                                ? avgDamerauEsToEs
                                : avgDamerauEsToSrc;
                        const betterDamerauSrc =
                            avgDamerauSrcToEs < avgDamerauSrcToSrc
                                ? avgDamerauSrcToEs
                                : avgDamerauSrcToSrc;
                        // Less is more similar
                        totalSimilarity.push(
                            betterDamerauEs < betterDamerauSrc
                                ? betterDamerauEs
                                : betterDamerauSrc
                        );
                        if (
                            stringDistanceSimilarityJaroEsToEs.length === 0 ||
                            stringDistanceSimilarityJaroEsToSrc.length === 0 ||
                            stringDistanceSimilarityJaroSrcToEs.length === 0 ||
                            stringDistanceSimilarityJaroSrcToSrc.length === 0
                        ) {
                            const error = new Error();
                            error.message =
                                "We couldn't calculate Jaro's Average";
                            throw error;
                        }
                        const avgJaroEsToEs = getAverage(
                            stringDistanceSimilarityJaroEsToEs
                        );
                        const avgJaroEsToSrc = getAverage(
                            stringDistanceSimilarityJaroEsToSrc
                        );
                        const avgJaroSrcToEs = getAverage(
                            stringDistanceSimilarityJaroSrcToEs
                        );
                        const avgJaroSrcToSrc = getAverage(
                            stringDistanceSimilarityJaroSrcToSrc
                        );

                        const betterJaroEs =
                            avgJaroEsToEs > avgJaroEsToSrc
                                ? avgJaroEsToEs
                                : avgJaroEsToSrc;
                        const betterJaroSrc =
                            avgJaroSrcToEs > avgJaroSrcToSrc
                                ? avgJaroSrcToEs
                                : avgJaroSrcToSrc;
                        // Higher is more similar
                        totalSimilarity.push(
                            betterJaroEs > betterJaroSrc
                                ? betterJaroEs
                                : betterJaroSrc
                        );
                        if (
                            phoneticSimilarityEsToEs.length === 0 ||
                            phoneticSimilarityEsToSrc.length === 0 ||
                            phoneticSimilaritySrcToEs.length === 0 ||
                            phoneticSimilaritySrcToSrc.length === 0
                        ) {
                            const error = new Error();
                            error.message =
                                "We couldn't calculate Phonetic's Average";
                            throw error;
                        }
                        const avgPhoneticEsToEs = getPhoneticAverage(
                            phoneticSimilarityEsToEs
                        );
                        const avgPhoneticEsToSrc = getPhoneticAverage(
                            phoneticSimilarityEsToSrc
                        );
                        const avgPhoneticSrcToEs = getPhoneticAverage(
                            phoneticSimilaritySrcToEs
                        );
                        const avgPhoneticSrcToSrc = getPhoneticAverage(
                            phoneticSimilaritySrcToSrc
                        );

                        const betterPhoneticEs =
                            avgPhoneticEsToEs > avgPhoneticEsToSrc
                                ? avgPhoneticEsToEs
                                : avgPhoneticEsToSrc;
                        const betterPhoneticSrc =
                            avgPhoneticSrcToEs > avgPhoneticSrcToSrc
                                ? avgPhoneticSrcToEs
                                : avgPhoneticSrcToSrc;

                        // Higher or equal to .50 is similar
                        totalSimilarity.push(
                            betterPhoneticEs > betterPhoneticSrc
                                ? betterPhoneticEs
                                : betterPhoneticSrc
                        );

                        totalSimilarity.push(+cosineSimilarity);

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
                                (trademark: {
                                    trademarkName: string;
                                    criteria: [];
                                }) => {
                                    return (
                                        trademark.trademarkName === element.name
                                    );
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
                                });
                                createdFile.save(json);
                            }
                        }

                        console.log(totalSimilarity);

                        if (
                            trademarkDatabase.every(
                                (element: { name: string; id: number }) => {
                                    return processedTrademarks.includes(
                                        element
                                    );
                                }
                            )
                        ) {
                            next();
                        }
                    }
                );
            }
        );

        console.log(translatedTokenizedTrademark);
        console.log(sourceTokenizedTrademark);
        if (similarTrademarks.length === 0) {
            return "No similarities found";
        }
        return true;
    }
};
