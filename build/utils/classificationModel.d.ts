interface dataModel {
    [niceClass: string]: {
        class: number;
        terms: string[];
    };
}
interface tensorModel {
    kept: boolean;
    isDisposedInternal: boolean;
    shape: number[];
    dtype: string;
    size: number;
    strides: number[];
    dataId: {};
    id: number;
    rankType: string;
    scopeId: number;
}
export declare class TfClassification {
    private loadUse;
    formatEmbeddingsData(data: dataModel, createModel: Function): Promise<any>;
    formatTextData(data: dataModel): {
        text: string;
        niceClass: number;
    }[];
    createModel(data: tensorModel, totalTerms: {
        text: string;
        niceClass: number;
    }[]): Promise<void>;
    trainSequentialClassifier(niceClasses: any): Promise<void>;
    classifyProtection(word: string, matchedClasses: number[]): Promise<number[]>;
}
export {};
//# sourceMappingURL=classificationModel.d.ts.map