const express = require("express");
const WebhookController = require("../controllers/WebhookController");
const verifyWebhook = require("../middleware/verifyWebhook");

const router = express.Router();

router.post("/", verifyWebhook, WebhookController.handleDepositWebhook);

module.exports = router;
