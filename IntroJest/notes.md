# Testing

Before we starting building node apps we need to touch on testing!  
In node/react applications we'll most likely be using **Jest**  
Honestly, Jest is the goto framework for all JS applications.

## Jest

Jest os an open-source testing _framework_ written by fb.  
Easy to test in envs that aren't browser-based.
Written on top of Jasmine (thus we can also use Jasmine)

## Install

We'll install jest globally:

```js
npm i --global jest
```

Now we can run all of tests with the command: _jest_  
Like node or psql we can also call jest <file_name>;

## Writing Basic Tests

Tests should follow the naming pattern: _NAME_OF_FILE.test.js_

- Tests can be placed in the same directory if the app is small
- For larger apps we should create a **_tests_** folder.  
  Jest will look for a package.json folder. If we have one most config will be automatic.  
  Next Jest will look for a jest.config.js file. It can be empty, but must exist.
- jest.config.js is used to override standard config for greater flexibility.

## Basic syntax

We write tests inside of _test_ function callbacks  
No need to import Jest or anything like that.  
Basic code:

```js
// demo/VideoCode/square.js
function square(x) {
	return x * x
}

function cube(x) {
	return Math.pow(x, 3)
}

module.exports = { square, cube }
```

Equivalent unit test:

```js
// demo/VideoCode/square.test.js
const { square } = require('./square')

describe('square function', function () {
	test('square should square positive numbers', function () {
		const res = square(3)
		expect(res).toEqual(9)
		// Test can have multiple expectations:
		const res2 = square(2)
		expect(res2).toEqual(4)
	})

	test('square should square negative numbers', function () {
		const num = square(-9)
		expect(num).toEqual(81)
	})
})
```

We only _need_ a single test clause. But we want to be grouping them in describe clauses.

## Matchers

So far we've used the matcher: _toEqual_ we also have access to:

- .tobe(obj) -> Is the same obj?
- .toContain(sought) -> sought is in obj/arr?
- .not. -> Negates other matchers
  [and a host of others](https://jestjs.io/docs/using-matchers)  
  Check out the examples [here](demo_code/VideoCode/matchers.test.js)

## Expecting Anything

Sometimes it can be difficult to figure out exactly what to expect:

```js
// demo/any.js
const TOYS = ['doll', 'top', 'iPad']

function getRandomToy() {
	let idx = Math.floor(Math.random() * TOYS.length + 1)
	return {
		toy: {
			name: TOYS[idx],
			price: 34.99,
		},
	}
}

module.exports = { getRandomToy }
```

We can use expect.any to specify the data type we're expecting:

```js
const { getRandomToy } = require("./any");

test("random toy", function () {
  let toy = getRandomToy();
  expect(toy).toEqual({
    toy: {
      name: expect.any(String),
      price: 34.99
    }
  });
});
```
## Before / After
Testing libraries commonly have setup and teardown methods. Jest is no different  
In Jest we call these hooks! They are:
- beforeEach
- beforeAll
- afterEach
- afterAll
 Take this example of a checkout calc:
```js
function getCartTotal(cart, discountAmount = 0) {
  let totalPrice = cart.reduce(
    (price, item) => (price + item.price * item.qty), 0);
  let discountedPrice = totalPrice * (1 - discountAmount);
  // toFixed returns string; convert to a number
  return +discountedPrice.toFixed(2);
}

module.exports = { getCartTotal };
``` 
Our tests could look like:
```js
  const { getCartTotal } = require("./cart");


  describe("getCartTotal", function () {
    test("get total w/o discount", function () {
      const cart = [
        { item: "le croix", price: 4.99, 
        qty: 3 },
        
        { item: "pretzels", price: 8.99, 
        qty: 10 },
      ];

      const total = getCartTotal(cart);
      expect(total).toBe(104.87);
    });

    test("gets total w/discount", function () {
      const cart = [
        { item: "le croix", price: 4.99, 
        qty: 3 },
        { item: "pretzels", price: 8.99, 
        qty: 10 },
      ];

      const total = getCartTotal(cart, 0.5);
      expect(total).toBe(52.44);
    });
  });
  ```
  Notice the repitition! Each test creats the same cart. 
  Using beforeEach we could consolidate this into:
  ```js
describe("getCartTotal", function () {
  // will hold the cart for the tests
  let cart;
  // Must define cart outside of beforeEach block (block scoped!)

  beforeEach(function () {
    cart = [
      { item: "le croix", 
      price: 4.99, qty: 3 },
      { item: "pretzels", 
      price: 8.99, qty: 10 }
    ];
  });

  test("gets total w/o discount", function () {
    const total = getCartTotal(cart);
    expect(total).toBe(104.87);
  });

  test("gets total w/discount", function () {
    const total = getCartTotal(cart, 0.5);
    expect(total).toBe(52.44);
  });
});
```
Using beforeEach in this way lets us config a setUp and tearDown for each describe block  
**THIS IS NOT REQUIRED** we can use before/after directly in file outside of a func block;  
Doing this lets us run before/after any/all tests in the file; -> 
