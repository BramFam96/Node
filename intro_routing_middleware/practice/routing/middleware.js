const ExpressError = require('./expressError')
const logger = (req, res, next) => {
	console.log(`Received ${req.method} request to ${req.path}.`)
	return next()
}
const checkForPassword = (req, res, next) => {
	try {
		if (req.query.password !== 'password') {
			throw new ExpressError('Uh-uh buddy', 402)
		} else {
			next()
		}
	} catch (e) {
		next(e)
	}
}

module.exports = { logger, checkForPassword }
