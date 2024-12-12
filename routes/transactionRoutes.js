const express = require('express');
const TransactionController = require('../controllers/TransactionController');
const authMiddleware = require('../middleware/authMiddleware');


const router = express.Router();

router.get('/deposits', authMiddleware, TransactionController.getDeposits);
router.get('/transfers', authMiddleware, TransactionController.getTransfers);
router.get('/', authMiddleware, TransactionController.getAllTransactions);

module.exports = router;
