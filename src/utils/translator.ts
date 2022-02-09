const unirest = require("unirest");
import { environment } from "../config/environment";

export const translateWords = async (trademarkName: string, callback: any) => {
    const request = unirest("POST", environment.X_RAPIDAPI_ENDPOINT_DETECT);

    request.query({
        "api-version": "3.0",
    });

    request.headers({
        "content-type": "application/json",
        "x-rapidapi-key": environment.X_RAPIDAPI_KEY,
        "x-rapidapi-host": environment.X_RAPIDAPI_HOST,
        useQueryString: true,
    });

    request.type("json");
    request.send([
        {
            Text: trademarkName,
        },
    ]);

    request.end(function (res: any) {
        if (res.error) throw new Error(res.error);

        if (res.body[0].language !== "es") {
            var req = unirest("POST", environment.X_RAPIDAPI_ENDPOINT);

            req.query({
                to: "es",
                "api-version": "3.0",
                profanityAction: "NoAction",
                textType: "plain",
            });

            req.headers({
                "content-type": "application/json",
                "x-rapidapi-key": environment.X_RAPIDAPI_KEY,
                "x-rapidapi-host": environment.X_RAPIDAPI_HOST,
                useQueryString: true,
            });

            req.type("json");
            req.send([
                {
                    Text: trademarkName,
                },
            ]);

            req.end(async function (res: any) {
                if (res.error) throw new Error(res.error);

                // return (await res.body[0].translations[0].text) as any;

                callback(
                    (await res.body[0].translations[0].text
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")) as any
                );
            });
        } else {
            callback(trademarkName);
        }
    });
};
