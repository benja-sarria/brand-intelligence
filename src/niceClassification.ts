import { BayesClassification } from "./utils/bayesianClassifier";
import { TfClassification } from "./utils/classificationModel";

class NiceClassification {
    bayesClassification: {
        classify: Function;
    };
    tfClassification: {
        classifyProtection: Function;
    };

    constructor() {
        this.bayesClassification = new BayesClassification();
        this.tfClassification = new TfClassification();
    }

    async classify(subject: string) {
        const matchedClasses: number[] = [];
        const matchedBayes = await this.bayesClassification.classify(
            subject,
            matchedClasses
        );

        const matchedTf = await this.tfClassification.classifyProtection(
            subject,
            matchedClasses
        );

        /* const matchedClasses = await [...matchedBayes, ...matchedTf].map(
            (niceClass) => {
                return +niceClass;
            }
        );
            
        console.log(await matchedTf);
        console.log(await matchedBayes);
        console.log(await matchedClasses); */
        console.log(matchedClasses);
    }
}

const trial = new NiceClassification();

trial.classify("venta de ropa");
