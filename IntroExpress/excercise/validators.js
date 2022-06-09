const ExpressError = require('./expressError')

/**
 * Attempt to convert an array of strings to an array of numbers
 * @param {Array} numsAsStrings array of strings
 * @returns {Array|Error} an array or an error object
 */
const convertAndValidateNumsArray = (numsAsStrings) => {
	let result = []

	for (let i = 0; i < numsAsStrings.length; i++) {
		let valToNumber = Number(numsAsStrings[i])

		if (Number.isNaN(valToNumber)) {
			return new Error(
				`The value '${numsAsStrings[i]}' at index ${i} is not a valid number.`
			)
		}

		result.push(valToNumber)
	}
	return result
}
const checkForValidQuery = (numList) => {
	if (!numList) {
		throw new ExpressError(
			'Query string must be comma seperated list of nums',
			400
		)
	}
}
const checkForValidNums = (validatedNums) => {
	if (validatedNums instanceof Error) {
		throw new ExpressError(nums.message)
	}
}
module.exports = {
	convertAndValidateNumsArray,
	checkForValidQuery,
	checkForValidNums,
}
