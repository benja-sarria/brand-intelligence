declare const getAverage: any;
declare const getPhoneticAverage: any;
declare const universalSentenceEncoder: any;
declare const natural: any;
declare const tokenizer: any;
declare const metaphone: any;
declare const trademarkDatabase: any;
interface Trademark {
    trademarkName: string;
}
declare class Trademark {
    cosineSimilarity: [];
    constructor(trademarkName: string);
    determineSimilarity: () => Promise<"No similarities found" | {}[]>;
}
//# sourceMappingURL=index.d.ts.map