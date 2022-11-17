const bcrypt = require("bcrypt");
const knex = require("../db/knex");
const logger = require("../utils/logger");

class Account {
  static async create(userDetails) {
    try {
      userDetails.password = await Account.hashPassword(userDetails.password);
      const data = await knex("accounts").insert(userDetails).returning("id");
      const id = data["0"]["id"];

      const result = await knex
        .select(
          "id",
          "first_name",
          "last_name",
          "username",
          "phone",
          "account_created",
          "account_updated"
        )
        .from("accounts")
        .where({ id })
        .first();
      return { response: result };
    } catch (error) {
      return { error: error.toString() };
    }
  }

  static async isValidPassword(username, password) {
    let res;
    try {
      res = await knex
        .select("password", "is_verified")
        .from("accounts")
        .where("username", username)
        .first();

      const result =
        (await bcrypt.compare(password, res.password)) && res.is_verified;

      return { response: result, is_verified: res.is_verified };
    } catch (error) {
      return { error: error.toString(), is_verified: res.is_verified };
    }
  }
  static async get(id, username) {
    try {
      const user = await knex
        .select(
          "id",
          "first_name",
          "last_name",
          "username",
          "phone",
          "account_created",
          "account_updated"
        )
        .from("accounts")
        .where({ id, username })
        .first();
      return { response: user };
    } catch (error) {
      return { error: error.toString() };
    }
  }

  static async getByUserName(username) {
    try {
      const user = await knex
        .select("id", "username")
        .from("accounts")
        .where({ username })
        .first();
      return { response: user };
    } catch (error) {
      return { error: error.toString() };
    }
  }

  static async update(id, username, userDetails) {
    try {
      if (userDetails.password) {
        userDetails.password = await Account.hashPassword(userDetails.password);
      }
      const result = await knex("accounts")
        .update(userDetails)
        .where({ id, username });
      return { response: result };
    } catch (error) {
      return { error: error.toString() };
    }
  }

  static async updateWithUsername(username, userDetails) {
    try {
      if (userDetails.password) {
        userDetails.password = await Account.hashPassword(userDetails.password);
      }
      const result = await knex("accounts")
        .update(userDetails)
        .where({ username });
      return { response: result };
    } catch (error) {
      return { error: error.toString() };
    }
  }

  static async hashPassword(password) {
    const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;
    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }
}

module.exports = Account;
