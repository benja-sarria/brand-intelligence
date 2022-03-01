import natural, { PorterStemmerEs } from "natural";
import { niceClasses } from "../data/niceClasses";

const fs = require("fs");

const classifier = new natural.BayesClassifier();
// console.log(classifier);
// console.log(niceClasses.class1);

interface dataModel {
    [niceClass: string]: { class: number; terms: string[] };
}
{
}

export class BayesClassification {
    niceClassification: {}[] = [];

    train() {
        const currentClasses: dataModel = niceClasses;
        const niceKeys = Object.keys(niceClasses);
        niceKeys.forEach((niceKey: string) => {
            currentClasses[niceKey as keyof dataModel].terms.forEach((term) => {
                const stemmedElement = PorterStemmerEs.stem(term);
                classifier.addDocument(
                    stemmedElement,
                    `${currentClasses[niceKey as keyof dataModel].class}`
                );
            });
        });
        /*  niceClasses.class1.terms.forEach((element) => {
            const stemmedElement = PorterStemmerEs.stem(element);
            classifier.addDocument(
                stemmedElement,
                `${niceClasses.class1.class}`
            );
        });
        niceClasses.class25.terms.forEach((element) => {
            const stemmedElement = PorterStemmerEs.stem(element);
            classifier.addDocument(
                stemmedElement,
                `${niceClasses.class25.class}`
            );
        }); */
        classifier.train();

        classifier.save("nbClassifier.json", (err, classifier) => {
            console.log(classifier);
        });
    }
    async classify(subject: string, matchedClasses: number[]) {
        fs.readFile(
            "./nbClassifier.json",
            "utf8",
            async function (err: any, data: any) {
                if (err) {
                    console.log(err);
                } else {
                    const parsedData = JSON.parse(data);
                    const trainedClassifier = natural.BayesClassifier.restore(
                        parsedData,
                        PorterStemmerEs
                    );
                    const classifications: { label: string; value: number }[] =
                        await trainedClassifier
                            .getClassifications(subject)
                            .filter((niceClass) => {
                                return niceClass.value >= 0.0007;
                            });
                    // const matchedClasses: string[] = [];

                    classifications.forEach((niceClass) => {
                        console.log(classifications);

                        if (classifications.length <= 3) {
                            matchedClasses.push(+niceClass.label);
                        } else {
                            if (matchedClasses.length === 0) {
                                let highestToLowest = classifications.sort(
                                    (a, b) => b.value - a.value
                                );
                                const filteredResult = highestToLowest.slice(
                                    0,
                                    2
                                );
                                console.log(highestToLowest);
                                console.log(filteredResult);
                                filteredResult.forEach((element) => {
                                    matchedClasses.push(+element.label);
                                });
                            }
                        }
                    });
                    console.log(matchedClasses);

                    return matchedClasses;
                }
            }
        );
        /* const trainedClassifier = JSON.parse(savedClassifier);
        natural.BayesClassifier.load(
            "nbClassifier.json",
            natural.PorterStemmer,
            function (err, classifier) {
                console.log(classifier);

                return classifier.classify(subject);
            }
        );
        const classifiedSubject = classifier.classify(subject);
        console.log(classifiedSubject); */
    }
}

const classification = new BayesClassification();

// classification.classify("campera");
// classification.train();
