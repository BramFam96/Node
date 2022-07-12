# Testing our Database

These notes correspond with [cat-api](../demo/cats-api/routes/cats.test.js) and [pg-into](../demo/pg-intro/routes/users.test.js)  
We're going to need a test database! Our db file already expects this.  
We could do this with vanilla psql in the terminal or slightly modify our [seed file](../demo/pg-intro/data.sql)  
<NOTE> We changed the seedfile back afterwards!

## Testing PreReq

We need to move our app.listen function out of [app](../demo/pg-intro/app.js):

```js
module.exports = app
```

In a [server.js file](../demo/pg-intro/server.js):

```js
// RUN THIS FILE TO START THE SERVER, NOT APP.JS!
const app = require('./app')

app.listen(3000, function () {
	console.log('Server started on 3000')
})
```

# Testing Setup and Teardown

[Config](../demo/pg-intro/routes/users.test.js)

```js
process.env.NODE_ENV = 'test'

const request = require('supertest')

const app = require('../app.js')
const db = require('../db.js')

let testUser
beforeEach(async () => {
	const result = await db.query(
		`INSERT INTO users (name,type) VALUES ('Clucky','admin') RETURNING id,name,type`
	)
	testUser = result.rows[0]
})
// Write a dummy test to see if testUser is printed;
describe('HOPE THIS WORKS', () => {
	test('BLAH', () => {
		console.log(testUser)
		expect(1).toBe(1)
	})
})
```

When we run this it passes, but the script doesn't exit! We need to explicitly end the connection!

```js
afterEach(async () => {
	await db.query(`DELETE FROM users`)
})
afterAll(async () => {
	await db.end()
})
```
We're setup to write tests!
## Testing CRUD Actions
We'll use [cats](../demo/cats-api/routes/cats.test.js)
We have two get routes, a post, a put/patch, and a delete route.  
### Testing get routes (reading)
Testing get all cats route (test db has one cat):
```js
describe("GET /cats", () => {
  test("Gets a list of 1 cat", async () => {
    const response = await request(app).get(`/cats`);
    expect(response.statusCode).toEqual(200);
    // Route output: return res.json({ cats: catsQuery.rows})
    expect(response.body).toEqual({
      // Expect a list that simply contains testCat
      cats: [testCat]
    });
  });
});
```
Get by id route:
```js
router.get("/:id", async function(req, res, next) {
  try {
    const catQuery = await db.query(
      "SELECT id, name FROM cats WHERE id = $1", [req.params.id]);
// #####################################################################
// Handles bad ids by responding with 404
    if (catQuery.rows.length === 0) {
      let notFoundError = new Error(`There is no cat with id '${req.params.id}`);
      notFoundError.status = 404;
      throw notFoundError;
    }
// #####################################################################
    return res.json({ cat: catQuery.rows[0] });
  } catch (err) {
    return next(err);
  }
});
```
Corresponding test:
```js
describe("GET /cats/:id", function() {
  test("Gets a single cat", async function() {
    const response = await request(app).get(`/cats/${testCat.id}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({cat: testCat});
  });

  test("Responds with 404 if can't find cat", async function() {
    const response = await request(app).get(`/cats/0`);
    expect(response.statusCode).toEqual(404);
  });
});
```
## POST, PATCH and DELETE tests
Post syntax
```js
describe("POST /cats", function() {
  test("Creates a new cat", async function() {
    const response = await request(app)
      .post(`/cats`)
      .send({
        name: "Ezra"
      });
    expect(response.statusCode).toEqual(201);
    expect(response.body).toEqual({
      // How to account for id?
      cat: {id: expect.any(Number), name: "Ezra"}
    });
  });
});

```
Patch is slightly more involved!
```js
describe("PATCH /cats/:id", function() {
  test("Updates a single cat", async function() {
    const response = await request(app)
    // Must use string temp lits to grab id
      .patch(`/cats/${testCat.id}`)
      .send({
        name: "Troll"
      });
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({
      cat: {id: testCat.id, name: "Troll"}
    });
  });

  test("Responds with 404 if can't find cat", async function() {
    const response = await request(app).patch(`/cats/0`);
    expect(response.statusCode).toEqual(404);
  });
});
```
Delete test
```js
describe("DELETE /cats/:id", function() {
  test("Deletes a single a cat", async function() {
    const response = await request(app)
      .delete(`/cats/${testCat.id}`);
    expect(response.statusCode).toEqual(200);
    expect(response.body).toEqual({ message: "Cat deleted" });
  });
});
```