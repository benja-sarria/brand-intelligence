"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const index_1 = require("./routers/index");
const PORT = process.env.PORT || 8080;
const app = express();
// ROUTES
app.use("/api", index_1.router);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map