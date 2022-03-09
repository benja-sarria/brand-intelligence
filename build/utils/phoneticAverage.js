"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPhoneticAverage = void 0;
const getPhoneticAverage = (arrayWithBooleans) => {
    let sum = 0;
    for (let i = 0; i < arrayWithBooleans.length; i += 1) {
        if (arrayWithBooleans[i] === true) {
            sum += 1;
        }
    }
    const avg = sum / arrayWithBooleans.length;
    return avg;
};
exports.getPhoneticAverage = getPhoneticAverage;
//# sourceMappingURL=phoneticAverage.js.map