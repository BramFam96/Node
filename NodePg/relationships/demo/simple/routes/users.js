/** Routes for users of pg-relationships-demo. */

const db = require('../db')
const express = require('express')
const ExpressError = require('../expressError')
const router = express.Router()

const resourceExists = (responseData) => {
	let basicValidation = responseData.length === 0 ? false : true
	return basicValidation
}

/** Get users: [user, user, user] */

router.get('/', async function (req, res, next) {
	try {
		const results = await db.query(`SELECT id, name, type FROM users`)

		return res.json(results.rows)
	} catch (err) {
		return next(err)
	}
})

/** Get user: {name, type, messages: [{msg, msg}]} */

// router.get('/:id', async function (req, res, next) {
// 	try {
// 		const userRes = await db.query(`SELECT name, type FROM users WHERE id=$1`, [
// 			req.params.id,
// 		])

// 		const messagesRes = await db.query(
// 			`SELECT id, msg FROM messages
//              WHERE user_id = $1`,
// 			[req.params.id]
// 		)

// 		const user = userRes.rows[0]
// 		user.messages = messagesRes.rows
// 		return res.json(user)
// 	} catch (err) {
// 		return next(err)
// 	}
// })
router.get('/:id', async function (req, res, next) {
	try {
		const { id } = req.params

		const result = await db.query(
			`SELECT u.id AS user_id, u.name, u.type, m.id AS msg_id, m.msg 
			 FROM users as u 
			 LEFT JOIN messages As m
			 ON u.id = m.user_id
			 WHERE u.id=$1`,
			[id]
		)

		if (resourceExists(result.rows)) {
			const { id, name, type } = result.rows[0]
			const msgs = result.rows.map((row) => ({id: row.msg_id, msg: row.msg}))
			
			let u = { id, name, type, messages: msgs }
			return res.json(u)
		} else {
			throw new ExpressError('No such user', 404)
		}
	} catch (e) {
		next(e)
	}
})
module.exports = router
