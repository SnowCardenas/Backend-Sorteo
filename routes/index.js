import { Router } from "express";
const router = Router();

//Modelos
import User from "./user.js";
import Ticket from "./tiket.js";

router.use("/user", User);
router.use("/ticket", Ticket);

export default router;
