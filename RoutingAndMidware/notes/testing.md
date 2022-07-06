# Integration Tests in Express: Setup

So far we've been writing unit tests with things like jest to test individual funcs  
Express is difficult to unit test because the funcs are multistep by nature  
As a result the tests we'll write for Express will be largely integration tests  
**Integration tests** are a bit more involved than unit tests.  
We'll use _SuperTest_

## SuperTest

SuperTest is built upon SuperAgent, a node package for making HTTP requests.  
It allows us to make and test requests with any server (Not just express)  
SuperTest is **not** a _testing framework_ we use it in conjunction with _jest_  
Like Flask's test client: can make requests against app in tests  
[Docs](https://github.com/visionmedia/supertest/blob/master/README.md)

```js
npm i --save-dev supertest
// flag signifies this is a dev dependency. package.json seperates dev deps.
```

## [Demo Code](../demo/supertest-demo/routes/cats-routes.js)

## [Demo Tests](../demo/supertest-demo/routes/cats-routes.test.js)

Our Demo is a cat api with several routes:

- router.get('/')
- router.post('/')
- router.get('/:name')
- router.patch('/:name')
- router.delete('/:name')

  Also- our app file is formatted differently. It no longer calls **app.listen**  
  Instead we export the entire app:

```js
module.exports = app
```

server.js contains the following:

```js
const app = require('./app')

app.listen(3000, function () {
	console.log('Server starting on port 3000')
})
```

We do this for SuperTest.  
SuperTest requires app to create a test client.  
It will not work if our server is already started!

## Test Setup

Our test setup looks like this:

```js
// NODE_ENV can be set to prod, dev, or test
// This makes no dif now, but we could have dif dbs, credentials, etc based on env;
process.env.NODE_ENV = 'test'
// supertest will make reqs to application:
const request = require('supertest')

const app = require('../app')
let cats = require('../fakeDb')
// Create dummy data
let pTheCat = { name: 'pickles' }

beforeEach(() => cats.push(pTheCat))
afterEach(() => (cats.length = 0))
// It's important we mutate cats instead of redefining it, that's why we set its length to 0;
```

We need test:

- getting all cats
- getting one cat
  - what does success look like?
  - what does failure look like?
- Deleting a cat
  - success
  - failure
- Adding a cat
- etc;

### **request**

We might expect the tests to look like this:

```js
describe('GET /cats', () => {
	test('Get all cats', () => {
		res = app.get('/cats')
		expect(res.statusCode).toBe(200)
		expect(res.body).toEqual({ cats: [pTheCat] })
	})
})
```

We'd be close! But supertest modifies this syntax slightly:

```js
describe('GET /cats', () => {
	test('Gets all cats', async () => {
		const res = await request(app).get(`/cats`)
		expect(res.statusCode).toBe(200)
		expect(res.body).toEqual({ cats: [pTheCat] })
	})
})
```
When we want to change data- POST / PATCH we need to use .send()
```js
describe('POST /cats', function () {
	test('Creates a new cat', async function () {
		const resp = await request(app).post(`/cats`).send({
			name: 'Ezra',
		})
    // We need .send to actually commit new data!
		expect(resp.statusCode).toBe(201)
		expect(resp.body).toEqual({
			cat: { name: 'Ezra' },
		})
	})
})
```
## Debugging tests
We have several debuging methods  
Trusty console.log
Chrome dev tools can be accessed by running the following in bash:
```js
node --inspect-brk $(which jest) --runInBand NAME_OF_FILE
```
we can also use **debugger**