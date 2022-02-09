const express = require("express");

import { router as apiRoutes } from "./routers/index";

const PORT = process.env.PORT || 3000;

const app = express();

// ROUTES
app.use("/api", apiRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
