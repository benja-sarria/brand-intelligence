const { Trademark: trademark } = require("./index");

const express = require("express");

const PORT = process.env.PORT || 3000;

const app = express();

app.get("/", (req: any, res: any) => {
    const currentTrademark = new trademark(req.query.trademark);
    console.log(currentTrademark);

    res.send({
        consultedTrademark: req.query.trademark,
        results: currentTrademark.determineSimilarity(),
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
