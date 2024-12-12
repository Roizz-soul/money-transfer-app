const express = require("express");
const TransactionController = require("../controllers/TransactionController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();
// Get deposits
router.get("/deposits", authMiddleware, TransactionController.getDeposits);
// Get transfers
router.get("/transfers", authMiddleware, TransactionController.getTransfers);
// Get all transactions
router.get("/", authMiddleware, TransactionController.getAllTransactions);

module.exports = router;
