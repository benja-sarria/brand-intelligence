const tf = require("@tensorflow/tfjs");
const use = require("@tensorflow-models/universal-sentence-encoder");

import { niceClasses } from "../data/niceClasses";

interface dataModel {
    [niceClass: string]: { class: number; terms: string[] };
}
{
}

class TfClassification {
    private async loadUse() {
        const currentUse = await use.load();

        return await currentUse;
    }

    formatData(data: dataModel) {
        const objectKeys = Object.keys(data);
        const totalTerms: { text: string; niceClass: number }[] = [];

        objectKeys.forEach((niceClass: string) => {
            if (niceClass === "class25" || niceClass === "class43") {
                const termArray = data[niceClass as keyof dataModel].terms.map(
                    (term) => {
                        return {
                            text: term,
                            niceClass: data[niceClass as keyof dataModel].class,
                        };
                    }
                );

                totalTerms.push(...termArray);
            }
        });

        return totalTerms;
    }

    async sequentialClassifier(niceClasses: any, word: string) {
        const currentUse = await this.loadUse();

        const data: { text: string; niceClass: number }[] =
            await this.formatData(niceClasses);
        const sentences = data.map((t) => t.text.toLowerCase());

        const embeddings = await currentUse.embed(sentences);

        const xTrain = embeddings;
        const yTrain = tf.tensor2d(
            data.map((t) => [
                t.niceClass === 1 ? 1 : 0,
                t.niceClass === 2 ? 1 : 0,
                t.niceClass === 3 ? 1 : 0,
                t.niceClass === 4 ? 1 : 0,
                t.niceClass === 5 ? 1 : 0,
                t.niceClass === 6 ? 1 : 0,
                t.niceClass === 7 ? 1 : 0,
                t.niceClass === 8 ? 1 : 0,
                t.niceClass === 9 ? 1 : 0,
                t.niceClass === 10 ? 1 : 0,
                t.niceClass === 11 ? 1 : 0,
                t.niceClass === 12 ? 1 : 0,
                t.niceClass === 13 ? 1 : 0,
                t.niceClass === 14 ? 1 : 0,
                t.niceClass === 15 ? 1 : 0,
                t.niceClass === 16 ? 1 : 0,
                t.niceClass === 17 ? 1 : 0,
                t.niceClass === 18 ? 1 : 0,
                t.niceClass === 19 ? 1 : 0,
                t.niceClass === 20 ? 1 : 0,
                t.niceClass === 21 ? 1 : 0,
                t.niceClass === 22 ? 1 : 0,
                t.niceClass === 23 ? 1 : 0,
                t.niceClass === 24 ? 1 : 0,
                t.niceClass === 25 ? 1 : 0,
                t.niceClass === 26 ? 1 : 0,
                t.niceClass === 27 ? 1 : 0,
                t.niceClass === 28 ? 1 : 0,
                t.niceClass === 29 ? 1 : 0,
                t.niceClass === 30 ? 1 : 0,
                t.niceClass === 31 ? 1 : 0,
                t.niceClass === 32 ? 1 : 0,
                t.niceClass === 33 ? 1 : 0,
                t.niceClass === 34 ? 1 : 0,
                t.niceClass === 35 ? 1 : 0,
                t.niceClass === 36 ? 1 : 0,
                t.niceClass === 37 ? 1 : 0,
                t.niceClass === 38 ? 1 : 0,
                t.niceClass === 39 ? 1 : 0,
                t.niceClass === 40 ? 1 : 0,
                t.niceClass === 41 ? 1 : 0,
                t.niceClass === 42 ? 1 : 0,
                t.niceClass === 43 ? 1 : 0,
                t.niceClass === 44 ? 1 : 0,
                t.niceClass === 45 ? 1 : 0,
            ])
        );

        const N_CLASSES = 45;

        // Define a model for linear regression.
        const model = tf.sequential();
        model.add(
            tf.layers.dense({
                units: N_CLASSES,
                inputShape: [xTrain.shape[1]],
                activation: "softmax",
            })
        );

        model.compile({
            loss: "categoricalCrossentropy",
            optimizer: tf.train.adam(0.001),
            metrics: ["accuracy"],
        });

        /* // Generate some synthetic data for training.
        const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
        const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]); */

        await model
            .fit(xTrain, yTrain, {
                batchSize: 32,
                validationSplit: 0.1,
                shuffle: true,
                epochs: 150,
                /* callbacks: tfvis.show.fitCallbacks(
              lossContainer,
              ["loss", "val_loss", "acc", "val_acc"],
              {
                callbacks: ["onEpochEnd"],
              }
            ), */
            })
            .then(async () => {
                const threshold = 0.5;
                const matchedClasses: number[] = [];
                const sentences = [{ text: word }].map((t) =>
                    t.text.toLowerCase()
                );
                const embeddings = await currentUse.embed(sentences);
                const xPredict = embeddings;

                const prediction = await model.predict(xPredict).data();
                console.log(`Prediction 0:${prediction[0]};
                Prediction 25: ${prediction[24]};
                Prediction 43: ${prediction[42]}`);

                prediction.forEach((matchingRate: number, index: number) => {
                    if (matchingRate > 0.65) {
                        console.log(`La Clase ${index + 1} matchea`);

                        matchedClasses.push(index + 1);
                    }
                });
                console.log(await matchedClasses);
                return await matchedClasses;

                // Use the model to do inference on a data point the model hasn't seen before: */
                // model.predict(tf.tensor2d([5], [1, 1])).print();
                // Open the browser devtools to see the output
            });
    }
}
// console.log(niceClasses);

const trial = new TfClassification();

// trial.sequentialClassifier("que tal");

trial.sequentialClassifier(niceClasses, "gorra de marinero").then((res) => {
    console.log(`La clase niza a la que corresponde es: ${res}`);
});
