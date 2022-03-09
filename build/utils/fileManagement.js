"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const util = require("util");
const path = require("path");
class Container {
    constructor(fileName, trademarkName, translate, trademarkTranslation = "") {
        this.fileName = fileName;
        this.trademarkName = trademarkName;
        this.finalPath = path.join(__dirname, "..", "data", "results", `${this.fileName.replace(/\s/g, "_")}.json`);
        this.translate = translate;
        this.trademarkTranslation = trademarkTranslation;
    }
    async createFile() {
        try {
            console.log("analizando crear archivo");
            console.log(fs.existsSync(`${this.finalPath}`));
            const fileExists = fs.existsSync(`${this.finalPath}`);
            if (fileExists) {
                await fs.unlink(`${this.finalPath}`, (error) => {
                    if (error)
                        throw new Error(error);
                    console.log("deleted file");
                });
            }
            fs.writeFile(this.finalPath, `{"consultedTrademark": "${this.trademarkName}",${this.translate
                ? `"translation": "${this.trademarkTranslation}",`
                : ""} "results": []}`, (error) => {
                if (error) {
                    console.log(error.message);
                }
            });
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
    async save(object) {
        try {
            fs.writeFile(this.finalPath, `${JSON.stringify(object)}`, (error) => {
                if (error) {
                    console.log(error.message);
                }
            });
            return;
        }
        catch (error) {
            throw new Error(error.message);
        }
    }
}
exports.Container = Container;
exports.default = Container;
//# sourceMappingURL=fileManagement.js.map