const express = require('express')
const ExpressError = require('./expressError')
const { checkForPassword } = require('./middleware')
// Logger replaced with morgan
const logger = require('morgan')

// Stuff from user routes
const userRoutes = require('./userRoutes')

const app = express()

app.use(express.json())

app.use(logger('dev'))
// Integrating user routes:
app.use('/users', userRoutes)
// Clearing console errs
app.get('/favicon.ico', (req, res) => res.sendStatus(204))
app.get('/serviceworker.js', (req, res) => res.sendStatus(204))

app.get('/secret', checkForPassword, (req, res, next) => {
	return res.send('Ayeeee')
})
app.get('/private', checkForPassword, (req, res) => {
	return res.send('Another one!')
})

// 404 Handler
app.use((req, res, next) => {
	return next(new ExpressError('Not Found', 404))
})
// Generic Err Handler
app.use((err, req, res, next) => {
	let status = err.status || 500

	return res.status(status).json({
		error: {
			message: err.message,
			status: status,
		},
	})
})

app.listen(3000, function () {
	console.log('Server is listening on port 3000')
})
