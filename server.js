const express = require("express");
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoutes");
const transferRoutes = require("./routes/transferRoutes");
const webhookRoutes = require("./routes/webhookRoutes");
const transactionRoutes = require("./routes/transactionRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/transfers", transferRoutes);
app.use("/webhook", webhookRoutes);
app.use("/transactions", transactionRoutes);

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
