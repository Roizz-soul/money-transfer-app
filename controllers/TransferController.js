const axios = require("axios");
const db = require("../db/knex");
const crypto = require("crypto");
const { use } = require("../routes/transferRoutes");
require("dotenv").config();

class TransferController {
  static async initiateTransfer(req, res) {
    try {
      const {
        amount,
        bank,
        bank_code,
        account_number,
        account_name,
        narration,
        //reference,
        currency,
      } = req.body;
      const userId = req.user.id; // Assuming authentication middleware attaches user info

      // Validate inputs
      if (
        !bank ||
        !account_number ||
        !amount ||
        !bank_code ||
        !account_name ||
        !narration ||
        !currency
      ) {
        return res.status(400).json({ message: "All fields are required." });
      }

      // Get user's account details
      const account = await db("accounts").where({ user_id: userId }).first();
      if (!account || account.balance < amount) {
        return res.status(400).json({ message: "Insufficient funds." });
      }

      // Prepare payload for Raven Atlas API
      const transferPayload = {
        amount,
        bank,
        bank_code,
        account_number,
        account_name,
        narration,
        reference: crypto.randomBytes(16).toString("hex"),
        // currency,
        // source_account: account.account_number,
        // destination_bank: recipient_bank,
        // destination_account: recipient_account,
        // amount,
        // narration: "Transfer from MyApp",
      };

      // Make the API call
      /* var config = {
        method: "post",
        url: "https://integrations.getravenbank.com/v1/transfers/create",
        headers: {
          Authorization: process.,
        },
        data: transferPayload,
      };

      const response = await axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        }); */

      //   const response = await axios.post(
      //     `https://integrations.getravenbank.com/v1/transfers/create`,
      //     transferPayload,
      //     {
      //       headers: {
      //         Authorization: process.env.RAVEN_API_TEST_KEY,
      //         "Content-Type": "application/json",
      //       },
      //     }
      //   );

      // Deduct amount from user's account
      var response;
      const newBalance = parseFloat(account.balance) - parseFloat(amount);
      await db("accounts")
        .where({ id: account.id })
        .update({ balance: newBalance });

      // Log the transaction
      await db("transactions").insert({
        user_id: userId,
        trx_ref: "tty" || response?.data.trx_ref,
        merchant_ref: "ttl" || response?.data.merchant_ref,
        account_name: account_name || response?.data.account_name,
        account_number: account_number || response?.data.account_number,
        narration: narration || response?.data.narration,
        currency,
        amount: amount || response?.data.amount,
        status: "pending" || response?.data.status,
        bank: bank || response?.data.bank,
        type: "transfer",
        //fee: "10" || response?.data.fee,
        atlas_id: "gh" || response?.data.id,
        session_id: null,
      });

      return res.status(200).json({
        message: "Transfer sent.",
        //transaction_id: response?.data.transaction_id,
      });
    } catch (error) {
      console.error(error);

      if (error.response) {
        // Handle Raven API errors
        return res.status(error.response.status).json({
          message: error.response.data.message || "Transfer failed.",
        });
      }

      return res.status(500).json({ message: "Internal server error." });
    }
  }
}

module.exports = TransferController;
