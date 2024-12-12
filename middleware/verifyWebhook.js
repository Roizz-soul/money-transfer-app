const crypto = require("crypto");

const verifyWebhook = (req, res, next) => {
  try {
    const signature = req.headers["x-raven-signature"];
    const webhookSecret = process.env.WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      return res.status(401).json({ message: "Webhook verification failed." });
    }

    // Calculate HMAC of the request body using the secret
    const hmac = crypto.createHmac("sha256", webhookSecret);
    const body = JSON.stringify(req.body);
    const digest = hmac.update(body).digest("hex");

    // Compare the calculated digest with the signature
    if (digest !== signature) {
      return res.status(403).json({ message: "Invalid webhook signature." });
    }

    next();
  } catch (error) {
    console.error("Webhook verification error:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = verifyWebhook;
