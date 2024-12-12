const axios = require("axios");

// The unique URL generated by Webhook.site
const WEBHOOK_URL = "https://webhook.site/f3f23b3e-7b78-433e-98b7-78db36ab8c51";

// Example function to trigger the webhook
async function triggerWebhook(eventType, eventData) {
  try {
    const payload = {
      event: eventType, // e.g., "deposit", "transfer"
      data: eventData, // The relevant data for the event
      timestamp: new Date().toISOString(),
    };

    // Send POST request to the webhook URL
    const response = await axios.post(WEBHOOK_URL, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log(`Webhook sent successfully: ${response.status}`);
  } catch (error) {
    console.error(`Failed to send webhook: ${error.message}`);
  }
}

// Example usage: Trigger a deposit event
triggerWebhook("deposit", {
  accountNumber: "123456789",
  amount: 5000,
  currency: "USD",
});
