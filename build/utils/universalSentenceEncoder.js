"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.universalSentenceEncoder = void 0;
require("@tensorflow/tfjs");
const use = require("@tensorflow-models/universal-sentence-encoder");
// Import @tensorflow/tfjs-core
const tf = require("@tensorflow/tfjs-core");
// Adds the CPU backend to the global backend registry.
require("@tensorflow/tfjs-backend-cpu");
const dot = (a, b) => {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var sum = 0;
    for (var key in a) {
        if (hasOwnProperty.call(a, key) && hasOwnProperty.call(b, key)) {
            sum += a[key] * b[key];
        }
    }
    return sum;
};
const similarity = (a, b) => {
    var magnitudeA = Math.sqrt(dot(a, a));
    var magnitudeB = Math.sqrt(dot(b, b));
    if (magnitudeA && magnitudeB)
        return dot(a, b) / (magnitudeA * magnitudeB);
    else
        return false;
};
const cosine_similarity_matrix = (matrix) => {
    let cosine_similarity_matrix = [];
    for (let i = 0; i < matrix.length; i++) {
        let row = [];
        for (let j = 0; j < i; j++) {
            row.push(cosine_similarity_matrix[j][i]);
        }
        row.push(1);
        for (let j = i + 1; j < matrix.length; j++) {
            row.push(similarity(matrix[i], matrix[j]));
        }
        cosine_similarity_matrix.push(row);
    }
    // console.log(cosine_similarity_matrix);
    return cosine_similarity_matrix;
};
const universalSentenceEncoder = async (trademarkName, databaseName, translatedName, translatedDbName, translate) => {
    // Load the model.
    const currentModel = await use.load();
    // Embed an array of sentences.
    const englishSentences = [trademarkName, databaseName];
    const englishEmbeddings = await currentModel.embed(englishSentences);
    // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
    // So in this example `embeddings` has the shape [2, 512].
    let current_cosine_similarity_matrix_english = await cosine_similarity_matrix(englishEmbeddings.arraySync());
    console.log(databaseName);
    if (translate) {
        const spanishSentences = [translatedName, translatedDbName];
        const spanishEmbeddings = await currentModel.embed(spanishSentences);
        let current_cosine_similarity_matrix_spanish = await cosine_similarity_matrix(spanishEmbeddings.arraySync());
        return await (current_cosine_similarity_matrix_english[0][1] >
            current_cosine_similarity_matrix_spanish[0][1]
            ? current_cosine_similarity_matrix_english[0][1]
            : current_cosine_similarity_matrix_spanish[0][1]);
    }
    return current_cosine_similarity_matrix_english[0][1];
};
exports.universalSentenceEncoder = universalSentenceEncoder;
//# sourceMappingURL=universalSentenceEncoder.js.map