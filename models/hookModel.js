const express = require("express");
const crypto = require("crypto");
const app = express();

// Secret key shared between your server and the external service
const SECRET_KEY = process.env.WEBHOOK_SECRET_KEY || "your-secret-key"; // Use environment variables for security

// Middleware to parse JSON payload
app.use(express.json());

// Webhook route to handle incoming POST requests
app.post("/webhook", (req, res) => {
  const signature = req.headers["x-signature"]; // Signature sent by the external service
  const payload = JSON.stringify(req.body); // The payload of the request (request body)

  // Calculate the expected signature using the shared secret key
  const expectedSignature = generateSignature(payload);

  // Compare the signature from the header with the calculated signature
  if (signature === expectedSignature) {
    console.log("Webhook is valid. Processing...");
    // Handle the webhook data here (e.g., process the order)
    res.status(200).send("Webhook received and verified");
  } else {
    console.log("Invalid signature. Rejecting the request.");
    res.status(400).send("Invalid signature");
  }
});

// Function to generate the HMAC SHA-256 signature
function generateSignature(payload) {
  return crypto.createHmac("sha256", SECRET_KEY).update(payload).digest("hex");
}

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Webhook server running at http://localhost:${port}`);
});
