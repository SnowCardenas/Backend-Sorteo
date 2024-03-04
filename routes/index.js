const express = require("express");
const router = express.Router();

//Modelos
const User = require("./user");
const Ticket = require("./tiket");

router.use("/user", User);
router.use("/ticket", Ticket);

module.exports = router;
