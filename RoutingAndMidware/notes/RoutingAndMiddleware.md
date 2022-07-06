# Express Router Intro

Currently, our express routes are formatted like:

```js
const app = require('express')

app.use(express.json()) -> every route includes this now
/****************

 All routes go here these could be
 get /users
 get/users/:id
 post /users
 etc;

****************/
app.use(ErrorFunc)
```

If we're building RESTFUL apis with many routes this file becomes very cluttered!  
Instead we'll use Express router to move our routes into seperate files.

```js
// demo/routing-demo2/userRoutes.js
const express = require('express')
// We only need express for this one line:
const router = express.Router()
// We will not be starting a server in this file;
// Fake db
const users = []

router.get('/', (req, res) => {
	return res.json(users)
})
router.delete('/:id', (req, res) => {
	const idx = users.findIndex((u) => u.id === +req.params.id)
	users.splice(idx, 1)
	return res.json({ message: 'Deleted' })
})
module.exports = router
```

We import router in our app.js  
Notice these are paths for /users, but our code calls '/' and '/:id'  
This is a feature of express router, we add the prefixes when we call the routes in [app.js](../practice/app.js)

## Middleware

Middleware is code the runs in the middle of the req/res cycle.  
Express gives middleware access to req and res obj. They can also call the _next_ function.  
**express.json(), our 404 handler, and global err handler** are examples of middleware.  
In our app express.json() runs every time. While our other middleware funcs run when they intercept an err.

## Uses

Middleware opens up the door for seperating logic we use for multiple routes.  
Commonly, this will be logic for authentication, authorization, logging data, or adding a current_user for every request

## Example

in middleware.js:

```js
function logger(req, res, next) {
	console.log(`Sending ${req.method} request to ${req.path}.`)
	return next()
}
```

To use, we can import or place this function in app.js:

```js
app.use(express.json())

app.use(logger)
app.use('/users', userRoutes)
```

Our logger reveals that each route looks for and fails to find favicon.io and serviceworker.js  
While not neccessary we will fix this err by simply responding with no content:

```js
app.use('/users', userRoutes)
app.get('/favicon.ico', (req, res) => res.sendStatus(204))
app.get('/serviceworker.js', (req, res) => res.sendStatus(204))
```

Order is critical. Middleware will automatically be called in an app.use() func  
However, the call stack ends when a route is matched. (This is why our err handlers work)

## Doing stuff with Middleware

Let's create a secret route that we protect with fake auth.

```js
app.get('/secret' (req,res, next) => {
  try {
    if (req.query.password !== 'password') {
      throw new ExpressError('Uh-uh buddy', 402)
    }
    return res.send('Ayeeee')
} catch(e) {

  return next(e)
}
})
```

Now let's say we have another route we want to protect with the same password

```js

app.get('/private' (req,res) => {
  try {
    if (req.query.password !== 'password') {
      throw new ExpressError('Uh-uh buddy', 402)
    }
   return res.send('Another one!')
}, catch (e) {
  next(e)
})
```

We can extract the duplicate logic, checking for a password  
But how do we format this, and what do we return?  
Calling **next()** w/o a value informs our middleware to move on to the next thing.  
Any value passed to next will be treated as an err (This is how our err handler works)

```js
const checkForPassword = (req,res,next) => {
  try {
    if (req.query.password !== 'password') {
      throw new ExpressError('Uh-uh buddy', 402)
    }
    next()
}, catch (e) {
  next(e)
}
}
```

To use a middleware func in our routes we include it as an argument to app.get/post:

```js
app.get('/secret', checkForPassword, (req, res, next) => {
	return res.send('Ayeeee')
})
app.get('/private', checkForPassword, (req, res) => {
	return res.send('Another one!')
})
```

checkForPassword will run automatically, because it's called first.  
What makes this seem complicated is the error handling.

## External middleware

Instead of writing our own logger we can use a robust external logger called **morgan**

```js
npm i morgan
const morgan = require('morgan')
app.use(morgan('dev')) -> top of page so it runs on every route
// 
GET /private?password=password 304 3.623 ms - -
// 
```
