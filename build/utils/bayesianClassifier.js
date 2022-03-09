"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BayesClassification = void 0;
const natural_1 = __importStar(require("natural"));
const niceClasses_1 = require("../data/niceClasses");
const fs = require("fs");
const classifier = new natural_1.default.BayesClassifier();
{
}
class BayesClassification {
    constructor() {
        this.niceClassification = [];
    }
    train() {
        const currentClasses = niceClasses_1.niceClasses;
        const niceKeys = Object.keys(niceClasses_1.niceClasses);
        niceKeys.forEach((niceKey) => {
            currentClasses[niceKey].terms.forEach((term) => {
                const stemmedElement = natural_1.PorterStemmerEs.stem(term);
                classifier.addDocument(stemmedElement, `${currentClasses[niceKey].class}`);
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
    async classify(subject, matchedClasses) {
        fs.readFile("./nbClassifier.json", "utf8", async function (err, data) {
            if (err) {
                console.log(err);
            }
            else {
                const parsedData = JSON.parse(data);
                const trainedClassifier = natural_1.default.BayesClassifier.restore(parsedData, natural_1.PorterStemmerEs);
                const classifications = await trainedClassifier
                    .getClassifications(subject)
                    .filter((niceClass) => {
                    return niceClass.value >= 0.0007;
                });
                // const matchedClasses: string[] = [];
                classifications.forEach((niceClass) => {
                    console.log(classifications);
                    if (classifications.length <= 3) {
                        matchedClasses.push(+niceClass.label);
                    }
                    else {
                        if (matchedClasses.length === 0) {
                            let highestToLowest = classifications.sort((a, b) => b.value - a.value);
                            const filteredResult = highestToLowest.slice(0, 2);
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
        });
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
exports.BayesClassification = BayesClassification;
const classification = new BayesClassification();
// classification.classify("campera");
// classification.train();
//# sourceMappingURL=bayesianClassifier.js.map