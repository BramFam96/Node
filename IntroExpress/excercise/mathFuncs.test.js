const { calcMean, calcMedian, calcMode } = require('./mathFuncs')

describe('#calcMedian', function () {
	it('calcs the median of an even set', function () {
		expect(calcMedian([1, -1, 4, 2])).toEqual(1.5)
	})
	it('calcs the median of an odd set', function () {
		expect(calcMedian([1, -1, 4])).toEqual(1)
	})
})

describe('#calcMean', function () {
	it('calcs the mean of an empty array', function () {
		expect(calcMean([])).toEqual(0)
	})
	it('calcs the mean of an array of numbers', function () {
		expect(calcMean([1, -1, 4, 2])).toEqual(1.5)
	})
})

describe('#calcMode', function () {
	it('calcs the mode', function () {
		expect(calcMode([1, 1, 1, 2, 2, 3])).toEqual(1)
	})
})
