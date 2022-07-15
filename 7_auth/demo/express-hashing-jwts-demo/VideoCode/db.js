/** Database for auth-api demo. */
const { Client } = require("pg");
const { DB_URI } = require("./config");
const pw = require('../../../../pg-pw-secret')
const client = new Client({
  connectionString: DB_URI,
  password: pw
});

client.connect();


module.exports = client;
