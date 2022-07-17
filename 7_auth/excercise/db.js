/** Database for auth-api demo. */

// const { Client } = require('pg')
// const pw = require('../../../pg-pw-secret')

// let db = new Client({
// 	database:
// 		process.env.NODE_ENV === 'test' ? 'express_pg_oo_test' : 'express_pg_oo',
// 	password: pw,
// })

// db.connect()

// module.exports = db

const { Client } = require('pg')
const {DB_CONFIG} = require('./config')


const client = new Client(DB_CONFIG)

client.connect()

module.exports = client
