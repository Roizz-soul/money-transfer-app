const express = require("express");
const WebhookController = require("../controllers/WebhookController");
const verifyWebhook = require("../middleware/verifyWebhook");

const router = express.Router();

// Webhook
router.post("/", verifyWebhook, WebhookController.handleWebhook);

module.exports = router;
