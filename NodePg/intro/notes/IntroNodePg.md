# Intro Psql with Node

Just like python, we need to establish a connection to a db.  
In Py, SqlAlchemy is pretty standard, in Node, there are multiple approaches we can take.  
We will use **pg** a node package to connect to a db and execute SQL queries from an Express app.  
We will then test it!

## The Node SQL Ecosystem

We have three main approaches we can take to communicate with a db.

- ORMs - like SQLAlchemy.
  - We make models/classes, we call methods on these classes, and a tool translates these into queries.
  - Sequelize is a popular ORM
- Query builders
  - Something between a regular Sql query and an ORM
  - KnexJs is a popular tool for this.
- SQL driver
  - Barebones connection - we literally write SQL as a string.
  - We'll be using **pg** for this.
  - The first thing we'll do is write a light-weight ORM with it.

## Connecting Pg

[Basic setup](../demo/simple/app.js):

```js
// ##################################################
const express = require('express')
const app = express()
const ExpressError = require('./expressError')

// Parse request bodies for JSON
app.use(express.json())

const uRoutes = require('./routes/users')
app.use('/users', uRoutes)
// ###################################################

/** 404 handler */
//...
```

For our example we'll need a database and some routes!  
For the first part we have a [Seed File](../demo/simple/data.sql)  
Remember, to run a seed file we use

```sh
psql < [path_to_file]
```

We now have:

- usersdb
- users table
- individual users with name, and type

# Pg

Pg works like _psycopg2_ in python  
It allows us to create a connection to a db, and execute SQL

```js
npm install pg
```

It's common to abstract the code for connecting into a [seperate file](../demo/simple/db.js)

```js
//We only need client

const { Client } = require('pg')
// Define our path outside of conditional block
let DB_URI
// Create conditional block that checks for Node_Env
if (process.env.NODE_ENV === 'test') {
	DB_URI = 'postgresql:///usersdb_test'
} else {
	DB_URI = 'postgresql:///usersdb'
}
// Create a client
let db = new Client({
	connectionString: DB_URI,
})
// Connect to client
db.connect()
// Export our db connection
module.exports = db
```
## First Query
The db we exported from db.js includes a query method;  
[Simplest query](../demo/simple/routes/users.js):
```js
const express = require("express");
const db = require("../db");

const router = express.Router();


router.get("/", function (req, res, next) {
  const results = db.query(
        `SELECT * FROM users`);

  return res.json(results.rows);
});
```
This doesn't work! Queries are **asynchronous**:
```js
router.get("/", async function (req, res, next) {
  const results = await db.query(
        `SELECT * FROM users`);

  return res.json(results.rows);
});
```
Remember the routes in users will be prefixed with user/  
results.rows is an array containing our data!  
## Errors
Because our funcs are async and error will cause the request to timeout;    
We get around this with our handy try catch block;  
*NOTE* we need to import our express Error or we'll get a generic pg err;  
```js
catch {
  return next(e) OR 
}
```
## Queries con't
Let's be more specific, and get users by an attribute.  
For example, type:
```js
router.get('/search', async function (req, res, next) {
	try {
		const {type} = req.query

		const results = await db.query(
			`SELECT id, name, type
       FROM users
       WHERE type='${type}'`
		)

		return res.json(results.rows)
	} catch (err) {
		return next(err)
	}
})
```
### **THIS CODE IS VULNERABLE TO SQL INJECTION!**
We're plugging in a raw string and building our query entirely on the JS side
This is bad news bears!  
```js
// consider:
query = bwah-haha'; DELETE FROM users; --"
the '--' is a SQL quote!
```
This delete clause will run!  
To prevent this we need to *sanitize* our inputs using **parameterized queries**  
```js
		const results = await db.query(
			`SELECT id, name, type
       FROM users
      --  The magic
       WHERE type=$1`, [type]);
```
We represent values as variables like $1, $2, $3, however many we need!  
We then pass an array containing these values as the second arg to *db.query*  
Postgres will substitute corresponding values, and omit extraneous inputs
**NOTE the values are 1 indexed, instead of 0**  
Our bad request now receives an empty response!  
This is how we'll be writing all of our queries
## Inserting into database - creating new users
```js
router.post('/', async (req,res,next) => {
  try {
    const {name, type} =  req.body;
    const results = await db.query('INSERT INTO users (name,type) VALUES ($1,$2)',[name,type])
    return res.status(201).json(results.rows)
  } catch (e){
    next(e)
  }
})
```
Our route doesn't return anything..  
This makes sense! Inserting into a table doesn't return anything in vanilla psql and our setup is pretty vanilla!  
The easiest way to get this data back is with a *RETURNING* sql clause:
```js
const results = await db.query('INSERT INTO users (name,type) VALUES ($1,$2) RETURNING id, name, type', [name,type])
return res.status(201).json(results.row[0])
```
Boom! We don't need to write another query.
## Updating and Deleting
Simplest Patch route (no validation)
```js
router.patch('/:id', async (req,res,next) => {
try {
const {id} = req.params
const {name,type} = req.body;

const results = await db.query(
  'UPDATE users SET name = $1, type = $2 WHERE id = $3 RETURNING id, name, type',
  [name,type,id]
);
return res.json(result.rows[0]);
} catch(e) {
return next(e)
}
})
```
Simple Delete route
```js
router.delete('/:id', async (req, res, next) => {
  try {
    const results = db.query('DELETE FROM users WHERE id=$1', [req.params.id])
    return res.json({message: 'Deleted'})
  } catch (e) {
    return next(e)
  }
})
```
Notice we have not needed to explicitly commit changes!  
This is a benefit of using a SQL Driver and no additional layers of abstraction.  
Soon we'll learn how to add nice things to this API, like a light-weight ORM  
First, we'll cover the basics of **TESTING**