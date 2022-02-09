const unirest = require("unirest");
import { environment } from "../config/environment";

export const trademarkTranslator = async (
    req: any,
    res: any,
    next: Function
) => {
    if (!req.query.trademark) {
        res.json({
            error: "You have to send your trademark name through a query for us to evaluate",
        });
    }
    console.log(req.translation);

    if (!req.translation) {
        req.translatedTrademark = "";
        next();
    } else {
        console.log("Traduciendo marca en middleware");
        console.log(await environment.X_RAPIDAPI_ENDPOINT);

        const requirement = unirest(
            "POST",
            `${await process.env.X_RAPIDAPI_ENDPOINT}`
        );

        requirement.query({
            to: "es",
            "api-version": "3.0",
            profanityAction: "NoAction",
            textType: "plain",
        });

        requirement.headers({
            "content-type": "application/json",
            "x-rapidapi-key": environment.X_RAPIDAPI_KEY,
            "x-rapidapi-host": environment.X_RAPIDAPI_HOST,
            useQueryString: true,
        });

        requirement.type("json");
        requirement.send([
            {
                Text: req.query.trademark.toLowerCase(),
            },
        ]);

        await requirement.end(async function (response: any) {
            if (response.error) throw new Error(response.error);

            req.translatedObject = await response.body[0];
            req.translatedTrademark = req.translatedObject.translations[0].text
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "");
            console.log(req.translatedTrademark);
            console.log(`La marca traducida es : ${req.translatedTrademark}`);

            next();
        });
    }
};
