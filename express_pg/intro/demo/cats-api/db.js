/** Database setup for cats. */
const { Client } = require('pg')
const pw = require('../../../../pg-pw-secret')

let db = new Client({
	database: process.env.NODE_ENV === 'test' ? 'cats_test' : 'cats',
	password: pw,
})

db.connect()

module.exports = db
