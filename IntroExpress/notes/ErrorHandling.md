# Errors in Express

## [Code](/IntroExpress/demo/VideoCode/ExpressErrors/app.js)

Basic structure:

```js
const express = require('express')
const app = express()

function attemptToSaveToDB() {
	/* The mere act of calling throw will cause express to generate 
     a 500 status code, and an error message;
  */
	throw 'Connection Error!'
}

const USERS = [
	{ username: 'StacysMom', city: 'Reno' },
	{ username: 'Rosalia', city: 'R' },
]

app.get('/users/:username', function (req, res, next) {
	const user = USERS.find((u) => u.username === req.params.username)
	if (!user) return res.status(404).send('Not found')
	return res.send({ user })
})

app.get('/secret', (req, res, next) => {
	if (req.query.password != 'popcorn') {
		return req.status(403).send('invalid password')
	}
	return res.send('CONGRATS YOU KNOW THE PASSWORD')
})

app.get('/savetodb', (req, res, next) => {
	attemptToSaveToDB()
	return res.send('SAVED TO DB!')
})

app.listen(3000, () => {
	console.log('Running and listening on port 3000')
})
```

This works, but Express's default handling is iffy;  
What we want is syntax like: _throw myError('text', status code)_  
It would also be useful to see the stack trace.  
We do this by creating a custom error class, and handler.

## Custom Error Class

_Side Note_ there are a few ways of doing this, we'll be using a class;  
We create a custom error class by extending Express's default err handling and adding our own message, status, and even stack trace!  
We'll do this in a [seperate file](../demo/VideoCode/ExpressErrors/expressError.js)

```js
class ExpressError extends Error {
	constructor(msg, status) {
		// Remember super() constructs our parent obj;
		super()
		this.msg = message
		this.status = status
		console.error(this.stack)
		// Every express error has a .stack att.
	}
}
module.exports = ExpressError
```

In app.js

```js
app.get('/users/:username', function (req, res) {
	const user = USERS.find((u) => u.username === req.params.username)
	if (!user) throw new ExpressError('invalid username', 404)
	return res.send({ user })
})
```

Our response still doesn't look great. We're throwing errors,  
but still need to tell our Express how to respond

## app.use

We've been doing things like app.use(express.json())
This a middleware function (it affects every request)
By itself:

```js
app.use(() => {
	console.log('These gears are turning!')
})
```

app.use by itself will block any other code from executing!  
We get around this with _next_

```js
app.use((req, res, next) => {
	console.log('Response received!')
	next()
})
```
## Error handler
Error handlers are special funcs. They have rules:  
- Should be at the bottom of our file, just **above** *app.listen*  
- Should match every HTTP verb and path;  
- Should have a callback with 4 params:
```js
app.use(function (err, req, res, next))
```
for our purposes:
```js
// Error handler
app.use((err, req, res, next) => { //Note the 4 parameters!
  // the default status is 500 Internal Server Error
  let status = err.status || 500;
  let message = err.msg;

  // set the status and alert the user
  return res.status(status).json({
    error: { message, status }
  });
});
```
If we put this at the top, it will run on every route;  
By placing it at the bottom we ensure that it will only run  
if our route handlers *exit* with **next**  
It sounds like a lot, but boils down to this syntax:
```js
const express = require('express');
const app = express();

const ExpressError = require('./expressError');

app.get('/users/:username', (req,res,next) => {
  try {
    const user = USERS.find(u => u.username === req.params.username);
    if (!user) throw new ExpressError('Not found!',404);
  } 
  catch (err) {
    // whatever we pass into next is passed to our err handler;
    return next(err)
  }
})
app.use((err, req, res, next) => { 
  let status = err.status || 500 //Defaults to 500;
  let message = err.msg;

  // set the status and alert the user
  return res.status(status).json({
    error: { message, status }
  });
});
})
```
## Custom 404
For our api we can just return json  
Just above our handler middleware:
```js
app.use((req,res,next) => {
	const e = new ExpressError('Page not found',404);
	next (e);
	// Previous routes will skip this because it does not have an err param;
	// If we call next() w/o and error in routes, we will move on to this use statement.
})
```
## Debugging with Express
Err handling is good and all, but we need to figure out how to debug once we're in the weeds!  
Aside from console.log - how do we debug?  
1) Chrome Dev Tools
   - Node does not run in the client. Instead we use *--inspect-brk* flag in linux;
```s 
node --inpsect-brk file.js

# Debug listening on etc;
# For help see docs:
# Launches a REPL
```
From here we return to our client. In dev-tools there will be a node logo in the top right  
Clicking this opens a new dev-tools window with our node code  
From here we can easily step-through our code