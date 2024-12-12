const knex = require("../db/knex");

const handleDepositWebhook = async (req, res) => {
  try {
    const { merchant_ref, meta, trx_ref, status, type, response } = req.body;

    if (type !== "transfer") {
      return res.status(400).json({ message: "Unsupported webhook type." });
    }

    // Handle successful transactions
    if (status === "successful") {
      const { account_name, account_number, narration, currency, amount } =
        meta;

      await knex("transactions").where("trx_ref", trx_ref).update({
        trx_ref,
        merchant_ref,
        account_name,
        account_number,
        narration,
        currency,
        amount,
        status,
        bank,
        type,
      });

      return res
        .status(200)
        .json({ message: "Transaction processed successfully." });
    }

    // Handle failed transactions
    if (status === "failed") {
      const { account_name, account_number, narration, currency, amount } =
        meta;

      const resp = await knex("transactions")
        .where("trx_ref", trx_ref)
        .update({
          trx_ref,
          merchant_ref,
          account_name,
          account_number: account_number || null,
          narration,
          currency,
          amount,
          status,
          bank,
          type,
        });

      const account = await db("accounts").where({ user_id: resp[0] }).first();
      const newBalance = parseFloat(account.balance) + parseFloat(amount);
      await db("accounts")
        .where({ id: account.id })
        .update({ balance: newBalance });
      return res.status(200).json({ message: "Failed transaction recorded." });
    }

    return res
      .status(400)
      .json({ message: "Unrecognized transaction status." });
  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

module.exports = {
  handleDepositWebhook,
};
