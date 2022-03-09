export declare class NiceClassification {
    bayesClassification: {
        classify: Function;
    };
    tfClassification: {
        classifyProtection: Function;
        formatTextData: Function;
    };
    constructor();
    classify(subject: string): Promise<number[]>;
}
//# sourceMappingURL=niceClassification.d.ts.map