"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NiceClassification = void 0;
const bayesianClassifier_1 = require("./utils/bayesianClassifier");
const classificationModel_1 = require("./utils/classificationModel");
class NiceClassification {
    constructor() {
        this.bayesClassification = new bayesianClassifier_1.BayesClassification();
        this.tfClassification = new classificationModel_1.TfClassification();
    }
    async classify(subject) {
        const matchedClasses = [];
        const matchedBayes = await this.bayesClassification.classify(subject, matchedClasses);
        const matchedTf = await this.tfClassification.classifyProtection(subject, matchedClasses);
        /* const matchedClasses = await [...matchedBayes, ...matchedTf].map(
            (niceClass) => {
                return +niceClass;
            }
        );
            
        console.log(await matchedTf);
        console.log(await matchedBayes);
        console.log(await matchedClasses); */
        console.log(matchedClasses);
        return await matchedClasses;
    }
}
exports.NiceClassification = NiceClassification;
/* const trial = new NiceClassification();

trial.classify("Ropa"); */
//# sourceMappingURL=niceClassification.js.map