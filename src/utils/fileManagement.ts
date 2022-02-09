const fs = require("fs");
const util = require("util");
const path = require("path");

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

class Container {
    constructor(
        fileName: string,
        trademarkName: string,
        translate: boolean,
        trademarkTranslation: string = ""
    ) {
        this.fileName = fileName;
        this.trademarkName = trademarkName;
        this.finalPath = path.join(
            __dirname,
            "..",
            "data",
            "results",
            `${this.fileName.replace(/\s/g, "_")}.json`
        );
        this.translate = translate;
        this.trademarkTranslation = trademarkTranslation;
    }

    async createFile() {
        try {
            console.log("analizando crear archivo");
            console.log(fs.existsSync(`${this.finalPath}`));

            const fileExists = fs.existsSync(`${this.finalPath}`);
            if (fileExists) {
                await fs.unlink(`${this.finalPath}`, (error: any) => {
                    if (error) throw new Error(error);
                    console.log("deleted file");
                });
            }
            fs.writeFile(
                this.finalPath,
                `{"consultedTrademark": "${this.trademarkName}",${
                    this.translate
                        ? `"translation": "${this.trademarkTranslation}",`
                        : ""
                } "results": []}`,
                (error: any) => {
                    if (error) {
                        console.log(error.message);
                    }
                }
            );
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async save(object: savedResponse) {
        try {
            fs.writeFile(
                this.finalPath,
                `${JSON.stringify(object)}`,
                (error: any) => {
                    if (error) {
                        console.log(error.message);
                    }
                }
            );

            return;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    /* async getProductById(id) {
        try {
            const json = require("./products.json");

            const filteredJson = json.filter((product) => product.id === id);

            if (!filteredJson.length) {
                return null;
            }

            return filteredJson[0];
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async getAllProducts() {
        try {
            const json = require("./products.json");

            if (!json.length) {
                const error = new Error();
                error.message =
                    "There aren't any products saved in our DataBase";
                throw error;
            }

            return json;
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteById(id) {
        try {
            const json = require("./products.json");
            const filteredProduct = json.filter((product) => product.id === id);

            if (!filteredProduct.length) {
                const error = new Error();
                error.message =
                    "We couldn't find any product with that ID in our DataBase";
                throw error;
            }

            const filteredJson = json.filter((product) => product.id !== id);

            const parsedJson = JSON.stringify(filteredJson);

            await fs.writeFile(
                `${__dirname}/${this.fileName}`,
                `${parsedJson}`,
                (error) => {
                    if (error) {
                        console.log(error.message);
                    } else {
                        console.log("Archivo eliminado exitosamente");
                    }
                }
            );
        } catch (error) {
            throw new Error(error.message);
        }
    }

    async deleteAllProducts() {
        try {
            const json = require("./products.json");

            if (!json.length) {
                const error = new Error();
                error.message = "We couldn't find any products on our DataBase";
                throw error;
            }

            const wipedOutJson = [];

            const parsedJson = JSON.stringify(wipedOutJson);

            await fs.writeFile(
                `${__dirname}/${this.fileName}`,
                `${parsedJson}`,
                (error) => {
                    if (error) {
                        console.log(error.message);
                    } else {
                        console.log("Archivos eliminados exitosamente");
                    }
                }
            );
            console.log(wipedOutJson);
        } catch (error) {
            throw new Error(error.message);
        }
    } */
}

exports.Container = Container;

export default Container;
