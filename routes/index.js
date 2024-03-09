import { Router } from "express";
const router = Router();

//Modelos
import User from "./user";
import Ticket from "./tiket";

router.use("/user", User);
router.use("/ticket", Ticket);

export default router;
