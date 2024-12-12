const express = require("express");
const TransferController = require("../controllers/TransferController");
const authMiddleware = require("../middleware/authMiddleware"); //auth middleware

const router = express.Router();

// Post transfer
router.post("/", authMiddleware, TransferController.initiateTransfer);

module.exports = router;
