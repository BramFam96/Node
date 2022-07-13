const { calcMean, calcMedian, calcMode } = require('./mathFuncs')

describe('#calcMedian', function () {
	test('calcs the median of an even set', () => {
		expect(calcMedian([1, -1, 4, 2])).toEqual(1.5)
	})
	test('calcs the median of an odd set', () => {
		expect(calcMedian([1, -1, 4])).toEqual(1)
	})
})

describe('#calcMean', () => {
	test('calcs the mean of an empty array', () => {
		expect(calcMean([])).toEqual(0)
	})
	test('calcs the mean of an array of numbers', () => {
		expect(calcMean([1, -1, 4, 2])).toEqual(1.5)
	})
})

describe('#calcMode', () => {
	test('calcs the mode', () => {
		expect(calcMode([1, 1, 1, 2, 2, 3])).toEqual(1)
	})
})
