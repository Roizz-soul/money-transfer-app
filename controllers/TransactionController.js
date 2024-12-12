const db = require("../db/knex");

class TransactionController {
  // Get deposit history
  static async getDeposits(req, res) {
    try {
      const userId = req.user.id; // Authenticated user's ID

      const deposits = await db("transactions")
        .join("accounts", "transactions.user_id", "accounts.user_id")
        .where("accounts.user_id", userId)
        .andWhere("transactions.type", "deposit")
        .select(
          "transactions.id",
          "transactions.amount",
          "transactions.account_name",
          "transactions.account_number",
          "transactions.status",
          "transactions.created_at"
        );

      return res.status(200).json({ deposits });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error fetching deposit history." });
    }
  }

  // Get transfer history
  static async getTransfers(req, res) {
    try {
      const userId = req.user.id;

      const transfers = await db("transactions")
        .join("accounts", "transactions.user_id", "accounts.user_id")
        .where("accounts.user_id", userId)
        .andWhere("transactions.type", "transfer")
        .select(
          "transactions.id",
          "transactions.amount",
          "transactions.account_name",
          "transactions.account_number",
          "transactions.status",
          "transactions.created_at",
          "transactions.transaction_id"
        );

      return res.status(200).json({ transfers });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error fetching transfer history." });
    }
  }

  // Get all transaction history
  static async getAllTransactions(req, res) {
    try {
      const userId = req.user.id;

      const transactions = await db("transactions")
        .join("accounts", "transactions.user_id", "accounts.user_id")
        .where("accounts.user_id", userId)
        .select(
          "transactions.id",
          "transactions.type",
          "transactions.amount",
          "transactions.account_name",
          "transactions.account_number",
          "transactions.status",
          "transactions.created_at",
          "transactions.trx_ref",
          "transactions.bank"
        );

      return res.status(200).json({ transactions });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ message: "Error fetching transaction history." });
    }
  }
}

module.exports = TransactionController;
