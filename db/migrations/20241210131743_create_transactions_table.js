/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable("transactions", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users");

    table.string("trx_ref").nullable().defaultTo(null); // trx_ref
    table.string("merchant_ref").nullable().defaultTo(null);
    table.string("account_name").notNullable();
    table.string("account_number").nullable(); // Nullable for failed transactions
    table.text("narration").nullable();
    table.string("currency").notNullable().defaultTo("NGN");
    table.decimal("amount", 15, 2).notNullable();
    table.string("bank").notNullable();
    table.string("bank_code").notNullable();
    table.integer("fee").nullable().defaultTo(null);
    table.string("type").notNullable(); // 'deposit' or 'transfer'
    table.string("status").notNullable().defaultTo("pending"); // 'pending', 'success', 'failed'
    table.integer("atlas_id").nullable().defaultTo(null);
    table.string("session_id").nullable().defaultTo(null);
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTable("transactions");
};
