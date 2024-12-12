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
    table.string("trx_ref").notNullable(); // trx_ref
    table.string("merchant_ref").notNullable();
    table.string("account_name").notNullable();
    table.string("account_number").nullable(); // Nullable for failed transactions
    table.text("narration").nullable();
    table.string("currency").notNullable();
    table.decimal("amount", 15, 2).notNullable();
    table.string("bank").notNullable();
    table.string("type").notNullable(); // 'deposit' or 'transfer'
    table.string("status").notNullable().defaultTo("pending"); // 'pending', 'success', 'failed'
    table.string("atlas_id").notNullable();
    table.string("session_id").nullable();
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
