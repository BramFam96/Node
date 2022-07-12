/** Database client for pg-relationships-demo. */

const { Client } = require('pg')
const pw = require('../../../../pg-pw-secret')

let db = new Client({
	database: 'pg_relationships_demo',
	password: pw,
})

db.connect()

module.exports = db
