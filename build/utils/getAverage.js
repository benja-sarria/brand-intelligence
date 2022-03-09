"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAverage = void 0;
const getAverage = (arrayWithNumbers) => {
    let sum = 0;
    for (let i = 0; i < arrayWithNumbers.length; i += 1) {
        sum += parseFloat(arrayWithNumbers[i]); //don't forget to add the base
    }
    const avg = sum / arrayWithNumbers.length;
    return avg;
};
exports.getAverage = getAverage;
//# sourceMappingURL=getAverage.js.map