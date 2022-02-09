import * as express from "express";
import { router as wordTrademarkRoutes } from "./wordTrademarks/wordTrademarks.routes";

export const router = express.Router();

// MIDDLEWARES
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// ROUTES
router.use("/wordTrademark", wordTrademarkRoutes);
