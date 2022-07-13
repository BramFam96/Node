const { Client } = require('pg')
const pw = require('../../../../pg-pw-secret')
let db = new Client({
  database: process.env.NODE_ENV === 'test' ? 'userdb_test':'usersdb',
	password: pw
});

db.connect()

module.exports = db
