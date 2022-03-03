import * as express from "express";
import { router as wordTrademarkRoutes } from "./wordTrademarks/wordTrademarks.routes";
import { router as niceClassRoutes } from "./niceClass/niceClass.routes";

export const router = express.Router();

// MIDDLEWARES
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// ROUTES
router.use("/wordTrademark", wordTrademarkRoutes);
router.use("/niceClass", niceClassRoutes);
