const axios = require("axios");
const db = require("../db/knex");
const crypto = require("crypto");
require("dotenv").config();

class TransferController {
  static async initiateTransfer(req, res) {
    try {
      // Get request data
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
      const userId = req.user.id; // Authenticated user info

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
        bank_code, // Can be gotten from https://integrations.getravenbank.com/v1/banks 
        account_number,
        account_name,
        narration,
        reference: crypto.randomBytes(16).toString("hex"),
        currency,
      };

      // Make the API call
      var config = {
        method: "post",
        url: "https://integrations.getravenbank.com/v1/transfers/create",
        headers: {
          Authorization: "Bearer " + process.env.RAVEN_API_KEY,
        },
        data: transferPayload,
      };

      const response = await axios(config)
        .then(function (response) {
          //console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });


      // Deduct amount from user's account
      const newBalance = parseFloat(account.balance) - parseFloat(amount) - parseFloat(response?.data.fee);
      await db("accounts")
        .where({ id: account.id })
        .update({ balance: newBalance });

      // Log the transaction
      await db("transactions").insert({
        user_id: userId,
        trx_ref: response?.data.trx_ref,
        merchant_ref: response?.data.merchant_ref,
        account_name: response?.data.account_name,
        account_number: response?.data.account_number,
        narration: response?.data.narration,
        currency,
        amount: response?.data.amount,
        status: response?.data.status,
        bank: response?.data.bank,
        type: "transfer",
        fee: response?.data.fee,
        atlas_id: "gh" || response?.data.id,
        session_id: null,
      });

      return res.status(200).json({
        message: "Transfer sent.",
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
