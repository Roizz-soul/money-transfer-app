const UserModel = require("../models/UserModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db/knex");
require("dotenv").config();

const axios = require("axios");
const qs = require("qs");

class AuthController {
  static async signup(req, res) {
    const { email, password, first_name, last_name, phone } = req.body;

    if (!email || !password || !first_name || !last_name || !phone) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "Email already in use." });
      }

      // Post data to ravenbank and get generated account number
      // const data = qs.stringify({
      //   first_name,
      //   last_name,
      //   phone,
      //   amount: 100,
      //   email,
      // });

      // const config = {
      //   method: "post",
      //   url: "https://integrations.getravenbank.com/v1/pwbt/generate_account",
      //   headers: {
      //     Authorization:
      //       process.env.RAVEN_API_TEST_KEY,
      //   },
      //   data: data,
      // };

      const arr = await UserModel.createUser(
        email,
        password,
        first_name,
        last_name,
        phone
      );

      // var details;

      // const get = await axios(config)
      //   .then(function (response) {
      //     details = JSON.stringify(response.data);
      //     console.log(details);
      //     db("accounts").insert({
      //       user_id: arr[0],
      //       account_number: response.data.data.account_number,
      //       balance: response.data.amount,
      //     });
      //   })
      //   .catch(function (error) {
      //     console.log(error);
      //   });

      // Generate a unique 10-digit account number
      let accountNumber;
      do {
        accountNumber = Math.floor(
          1000000000 + Math.random() * 9000000000
        ).toString();
      } while (
        await db("accounts").where({ account_number: accountNumber }).first()
      );

      console.log("A/N: ", accountNumber);

      await db("accounts").insert({
        user_id: arr[0],
        account_number: accountNumber /* response.data.data.account_number */,
        balance: 1000 /* response.data.amount */,
      });

      return res.status(201).json({ message: "User created successfully." });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    try {
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      console.log(token);
      return res.status(200).json({ token });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Internal server error." });
    }
  }
}

module.exports = AuthController;
