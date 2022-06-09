const express = require('express')
const ExpressError = require('./expressError')

const app = express()
const { calcMean, calcMedian, calcMode } = require('./mathFuncs')
const {
	convertAndValidateNumsArray,
	checkForValidQuery,
	checkForValidNums,
} = require('./validators')

//Routes

app.get('/mean', function (req, res, next) {
	try {
		// Check that query exists and is of proper type;
		checkForValidQuery(req.query.nums)
		let numsAsStrings = req.query.nums.split(',')
		// check that numsAsStrings can be converted back to num
		let nums = convertAndValidateNumsArray(numsAsStrings)
		// Check that nums is not type Error;
		checkForValidNums(nums)

		let result = {
			operation: 'mean',
			result: calcMean(nums),
		}

		return res.send(result)
	} catch (err) {
		next(err)
	}
})
app.get('/median', function (req, res, next) {
	try {
		// Check that query exists and is of proper type;
		checkForValidQuery(req.query.nums)
		let numsAsStrings = req.query.nums.split(',')
		// check that numsAsStrings can be converted back to num
		let nums = convertAndValidateNumsArray(numsAsStrings)
		// Check that nums is not type Error;
		checkForValidNums(nums)

		let result = {
			operation: 'median',
			result: calcMedian(nums),
		}

		return res.send(result)
	} catch (err) {
		next(err)
	}
})
app.get('/mode', function (req, res, next) {
	try {
		// Check that query exists and is of proper type;
		checkForValidQuery(req.query.nums)
		let numsAsStrings = req.query.nums.split(',')
		// check that numsAsStrings can be converted back to num
		let nums = convertAndValidateNumsArray(numsAsStrings)
		// Check that nums is not type Error;
		checkForValidNums(nums)

		let result = {
			operation: 'mode',
			result: calcMode(nums),
		}

		return res.send(result)
	} catch (err) {
		next(err)
	}
})

// If no other route matches, respond with a 404
app.use((req, res, next) => {
	let e = new ExpressError('Page Not Found', 404)
	next(e)
})
// Error handler
app.use(function (err, req, res, next) {
	//Note the 4 parameters!
	// the default status is 500 Internal Server Error
	let status = err.status || 500
	let message = err.msg

	// set the status and alert the user
	return res.status(status).json({
		error: { message, status },
	})
})

app.listen(3000, () => {
	console.log('Server running on port 3000')
})
