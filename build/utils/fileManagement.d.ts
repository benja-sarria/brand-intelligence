interface Container {
    fileName: string;
    trademarkName: string;
    finalPath: string;
    translate: boolean;
    trademarkTranslation: string;
}
interface savedResponse {
    consultedTrademark: string;
    results: {
        trademarkName: string;
        criteria: number[];
    }[];
}
declare class Container {
    constructor(fileName: string, trademarkName: string, translate: boolean, trademarkTranslation?: string);
    createFile(): Promise<void>;
    save(object: savedResponse): Promise<void>;
}
export default Container;
//# sourceMappingURL=fileManagement.d.ts.map