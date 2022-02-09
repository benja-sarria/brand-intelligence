import dotenv from "dotenv";

dotenv.config();

export const environment = {
    X_RAPIDAPI_KEY: process.env.X_RAPIDAPI_KEY,
    X_RAPIDAPI_HOST: process.env.X_RAPIDAPI_HOST,
    X_RAPIDAPI_ENDPOINT: process.env.X_RAPIDAPI_ENDPOINT,
    X_RAPIDAPI_ENDPOINT_DETECT: process.env.X_RAPIDAPI_ENDPOINT_DETECT,
};
