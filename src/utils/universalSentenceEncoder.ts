require("@tensorflow/tfjs");
const use = require("@tensorflow-models/universal-sentence-encoder");
// Import @tensorflow/tfjs-core
const tf = require("@tensorflow/tfjs-core");
// Adds the CPU backend to the global backend registry.
require("@tensorflow/tfjs-backend-cpu");

const dot = (a: any, b: any) => {
    var hasOwnProperty = Object.prototype.hasOwnProperty;
    var sum = 0;
    for (var key in a) {
        if (hasOwnProperty.call(a, key) && hasOwnProperty.call(b, key)) {
            sum += a[key] * b[key];
        }
    }
    return sum;
};

const similarity = (a: any, b: any) => {
    var magnitudeA = Math.sqrt(dot(a, a));
    var magnitudeB = Math.sqrt(dot(b, b));
    if (magnitudeA && magnitudeB) return dot(a, b) / (magnitudeA * magnitudeB);
    else return false;
};

const cosine_similarity_matrix = (matrix: any) => {
    let cosine_similarity_matrix: any = [];
    for (let i = 0; i < matrix.length; i++) {
        let row: any = [];
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

    return cosine_similarity_matrix as any;
};

const univSentEnc = async (trademarkName: string, databaseName: string) => {
    // Load the model.
    const currentModel: any = await use.load();

    // Embed an array of sentences.
    const sentences = [trademarkName, databaseName];
    const embeddings = await currentModel.embed(sentences);
    // `embeddings` is a 2D tensor consisting of the 512-dimensional embeddings for each sentence.
    // So in this example `embeddings` has the shape [2, 512].

    // console.log(embeddings);

    let current_cosine_similarity_matrix: any = await cosine_similarity_matrix(
        embeddings.arraySync()
    );

    // console.log(cosine_similarity_matrix);

    console.log(databaseName);

    return await current_cosine_similarity_matrix[0][1];
};

exports.univSentEnc = univSentEnc;
