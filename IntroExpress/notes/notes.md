# Intro to Express

Express is very similar to flask:

- Minimal Web Framework for node
- Most popular Node package!

## Set-up

Very simply

```js
npm init --yes
npm i express
```

If we take a look at package.json we see all the deps!

## A Server in a Few Lines

[Original File](../demo/tiny.js)

```js
const express = require('express')
const app = express()
// Routes go here!
app.listen(3000, function () {
	console.log('App on port 3000')
})
```

App doesn't do anything except respond 404, but its running!  
_Important_ app.listen should be called after registering routes!

## First Route!

In flask we'd have this basic structure

```py
from flask import Flask
app = Flask(__name__)

@app.route('/dogs')
def bark():
  return 'Dogs go brk brk'
```

In express the equivalent:

```js
const express = require('express')
const app = express()

app.get('/dogs', (req, res) => {
  // Of course we also have app.post, app.put, etc;
  return res.send('Dogs go brrrrk')
  // automatically sets header data type in res
})

app.listen(3000, () => {
	console.log('App on port 3000')
```

Every route handler will be automatically passed a request and response obj.

- Req -> enormous obj with all the info about the req sent to the server
  - Useful for doing stuff with data -> access to headers, q-string, url params, form data)
- Res -> the object our server responds with
  - Useful methods like send -> automatically sets headers!
  - Every route we define needs to accept these objects.

## The Request-Response Cycle

When we start an express server it first runs through the file and registers
**all event handlers**.  
When a user makes a request, Express invokes the **first matching route handler** it finds.  
The cb on this route runs, and a response object is issued.

## Route Methods

We'll likely use one of these methods for each HTTP verb:

- app.get()
- app.post()
- app.put()
- app.patch()
- app.delete()

## Post req example

```js
// its common to name the cb funcs
app.get('/greetings', showMessage(req,res) {
  res.send('Howdy! (Get req)')
})
app.post('/greetings', showMessage(req,res) {
  res.send('Your message! (Post req)')
})
```

# Nodemon

So far we've had to start and stop our server each time we make a change;
Nodemon is a wrapper for node that gives us real-time updates;  
Once set-up we run our apps with it instead of node itself.

## Set-up

We don't want to include nodemon as a dep for other devs so we install globally:

```js
npm i --global nodemon
```

We simply replace our node calls in the console with nodemon! (easy-peasy)

# URL Parameters

## req.params

In flask we'd use a <name> syntax to make a variable route  
Express is similar:

```js
app.get('/users/:username', (req, res) => {
	// res has send method, req.params contains route variable:
	res.send(`<h1>Hello, ${req.params.username}</h1>`)
})
```

req obj contains our route variable in req.params

```js
const greetings = {
	en: 'hello',
	fr: 'bonjour',
	ja: 'konnichiwa',
	ch: 'ni hao',
}
app.get('/greetings/:language', (req, res) => {
	const lang = req.params.language
	const greeting = greeting[lang]
	res.send(greeting)
})
```

No returns?  
We only need to explicitly return when we don't want the rest of the block to execute!

## req.query

Say we have a route like '/search'; We may have a url string like:

```js
'/search?term=puppies&sort=cute'
these populate  in req.query!
```

## req.headers

header contains things like accepted languages, request type,

```js
app.get('/showheaders', (req, res) => {
	console.log(req.headers)
	res.send(req.headers)
})
```
## req.body
req.body contains the data submitted on post requests
However, it isn't as simple as the previous methods
```js
app.post('new-data', (req,res) => {
  app.send(req.body)
})