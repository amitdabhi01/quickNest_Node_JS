import express from "express";

import auth from "../middleware/auth.js";

import providerController from "../controller/providerController.js";

const router = express.Router();

router.post("/register", auth, providerController.registerAsProvider);

export default router;
