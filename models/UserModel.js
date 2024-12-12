const db = require("../db/knex"); // Import Knex instance
const bcrypt = require("bcrypt");

class UserModel {
  static async createUser(email, password, first_name, last_name, phone) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return db("users").insert({
      email,
      password: hashedPassword,
      first_name,
      last_name,
      phone,
    });
  }

  static async findByEmail(email) {
    return db("users").where({ email }).first();
  }

  static async findById(id) {
    return db("users").where({ id }).first();
  }
}

module.exports = UserModel;
