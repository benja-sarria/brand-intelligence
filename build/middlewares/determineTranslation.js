"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.determineTranslation = void 0;
const determineTranslation = (req, res, next) => {
    console.log(req.query.translation);
    if (req.query.translation !== "true" && req.query.translation !== "false") {
        const error = new Error();
        error.message = "You have to pass a boolean value";
        throw error;
    }
    if (req.query.translation === "false") {
        req.translation = false;
    }
    else {
        req.translation = true;
    }
    next();
};
exports.determineTranslation = determineTranslation;
//# sourceMappingURL=determineTranslation.js.map