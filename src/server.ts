const { Trademark: trademark } = require("./index");

const express = require("express");

const PORT = process.env.PORT || 3000;

const app = express();

app.get("/api", async (req: any, res: any) => {
    if (!req.query.trademark) {
        res.json({
            error: "You have to send your trademark name through a query for us to evaluate",
        });
    }
    const currentTrademark = new trademark(req.query.trademark);

    currentTrademark.determineSimilarity(res);
});

app.get("/result", (req: any, res: any) => {
    const query = req.query.trademark;
    const json = require(`./data/results/${query}.json`);
    res.json(json);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
