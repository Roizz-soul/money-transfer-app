const db = require("../db/knex");

const handleWebhook = async (req, res) => {
  try {
    const { type } = req.body;
    // Check wether type is transfer or collection
    if (type === "transfer") {
      const { merchant_ref, meta, trx_ref, status, type } = req.body;

      // Handle successful transactions
      if (status === "successful") {
        const { account_name, account_number, narration, currency, amount } =
          meta;

        // Update database
        await db("transactions").where("trx_ref", trx_ref).update({
          trx_ref,
          merchant_ref,
          account_name,
          account_number,
          narration,
          currency,
          amount,
          status,
          type,
          session_id: req.body.session_id,
        });

        return res
          .status(200)
          .json({ message: "Transaction processed successfully." });
      }

      // Handle failed transactions
      if (status === "failed") {
        const { account_name, account_number, narration, currency, amount } =
          meta;

        // Update database
        const resp = await db("transactions").where("trx_ref", trx_ref).update({
          trx_ref,
          merchant_ref,
          account_name,
          account_number: account_number,
          narration,
          currency,
          amount,
          status,
          type,
        });

        // get account details and adds money back
        const user_transaction = await db("transactions")
          .where({ id: resp })
          .first();

        const account = await db("accounts")
          .where({ user_id: user_transaction.user_id })
          .first();

        const newBalance =
          parseFloat(user_transaction.fee) +
          parseFloat(account.balance) +
          parseFloat(amount);

        await db("accounts")
          .where({ id: account.id })
          .update({ balance: newBalance });

        return res
          .status(200)
          .json({ message: "Failed transaction recorded." });
      }

      return res
        .status(400)
        .json({ message: "Unrecognized transaction status." });
    } else if (type === "collection") {
      const user_account_number = req.body.account_number;
      const { amount, session_id, source } = req.body;
      const {
        account_number,
        first_name,
        last_name,
        narration,
        bank,
        bank_code,
      } = source;

      // Gets account details
      const account = await db("accounts")
        .where({ account_number: user_account_number })
        .first();

      // log transaction

      await db("transactions").insert({
        user_id: account.user_id,
        trx_ref: null,
        merchant_ref: null,
        account_name: first_name + " " + last_name,
        account_number,
        narration,
        amount,
        status: "received",
        bank,
        type: "deposit",
        fee: null,
        bank_code,
        currency: "NGN",
        atlas_id: null,
        session_id: null,
      });

      // Add to account balance
      const newBalance = parseFloat(account.balance) + parseFloat(amount);

      // update account balance
      await db("accounts")
        .where({ id: account.id })
        .update({ balance: newBalance });

      return res
        .status(200)
        .json({ message: "Transaction processed successfully." });
    } else {
      return res.status(400).json({ message: "Unsupported webhook type." });
    }
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  handleWebhook,
};
