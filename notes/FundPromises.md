# TOC

# JS Review - Refresher/Promise intro

- Review the callback pattern for asynch JS
- Define what a promise is.
- Use promises to manage asynchronisity
- Compare and contrast promises / callback patterns
- Explore the **Promise** function in detail

# Callbacks

Callbacks are we deal with JS's single-threaded limitations.  
As we know they allow JS to queue untimely code in the browser and continue rendering synchronously.  
For example:

```JS
console.log('this prints first')

setTimeout(function() {
  console.log('this prints third, one second later');
}, 1000);

console.log('this prints second')
```

JS passes this timed out log to the browser until it is resolved.  
We can view this process with a tool like [Loupe](http://latentflip.com/loupe/)

This loop is also very common with ajax in general.

## Callbacks with requests

Let's use jQuery as an example since axios does not support callbacks:

```JS
let planet;
$.getJSON('https://swapi.co/api/planets/1/', response => {
  planet = response;
})
console.log(planet)
```

Planets undefined! The console ran before our response returned!  
To correct this we need to log our planet **inside** the asynch call

## Takeaways

- Js is executed synchronously
- JS can use special asynch callbacks to delay code execution
- Not all callbacks are async! Only the docs can tell.

## Issue w/ Callbacks

With the addition of err handling, and dependent requests, callback structures get messy quickly.  
Promises exist to simplify these structures.

# Working with Promises

A **Promise** is a one-time guarantee of future value.  
It is not the _item, data, or result_ that we are requesting.

## Intro to Promises

We'll use Axios for Promises. It does not support callbacks for its AJAX methods.  
_Don't forget to include axios in index.html_

```HTML
<script> src = 'https://unpkg.com/axios/dist/axios.min.js'</script>
```

First example:

```JS
let url = 'https://swapi.co/api/planets/1/'
let ourFirstPromise = axios.get(url);
console.log(ourFirstPromise);
//Promise {<pending>}
```

A **Promise** is a native, stateful JS object - they can be _pending, resolved, or rejected_.  
In the example above, we can reconsole ourFirstPromise and see that has resolved/rejected.

## Accessing Promise data

We must chain a method onto a Promise to access its results  
Promises provide **.then** and **.catch** for this.  
These methods are automatically passed resolved/rejected values (not immediately of course).

```js
let url = 'https://swapi.co/api/planets/1/'
let ourSecondPromise = axios.get(url)
ourSecondPromise.then((res) => console.log(res.data))
ourSecondPromise.catch((err) => console.log('Rejected!', err))
```

Promises can stll get quite messy, but with the abiity to chain them, we can eliminate this.

## Promise Chaining

Let's make several nested calls and see how its structured

```js
let url = 'https://swapi.co/api/planets/1/';
axios.get(url);
	.then((res) => {
		axios.get(res.data.residents[0])
    .then((res) => {console.log(res.data)})
    .catch(err => {console.log(err)})
	})
	.catch((err) => console.log(err))
```

This is classic callback hell!  
Promise chaining completely flattens this structure.  
When we call **.then** on a promise, we can return a _new_ promise in the callback.
Let's refactor our nested code above:

```JS
let url = 'https://swapi.co/api/planets/1/';
// Make promise that resolves to planet data:
axios.get(url);
// Return new promise that resolves to first resident's data"
	.then(planet => { return axios.get(planet.data.residents[0])})
// No more nesting!
// BONUS We can cleanly add unlimited dependent calls given that they return:
  // Return new promise that resolves to resident's first film:
  .then(resident => {return axios.get(resident.data.films[0])})

  .then(film => {console.log(film)})
  // BONUS a single .catch!
	.catch((err) => console.log(err))
```

### Takeaways

- Promises represent a pending value - a guarentee to resolve or reject.
- Chaining promises allows us to flatten the structure of asynchronous code

## Callback hell

Let's look at an obnoxious example:

```js
let URL = 'https://pokeapi.co/api/v2/pokemon'
$.ajax(`${baseURL}/1/`, {
	success: (p1) => {
		console.log(`The first pokemon is ${p1.name}`)
		$.ajax(`${baseURL}/2/`, {
			success: (p2) => {
				console.log(`The first pokemon is ${p2.name}`)
				$.ajax(`${baseURL}/3/`, {
					success: (p3) => {
						console.log(`The first pokemon is ${p3.name}`)
					},
					error: (err) => console.log(err),
				})
			},
			error: (err) => console.log(err),
		})
	},
	error: (err) => console.log(err),
})
```

Simply requesting three items turns into a monster. With the addition of error handling its gets even worse.
Refactored:

```js
let URL = 'https://pokeapi.co/api/v2/pokemon'
axios
	.get(`${URL}/1/`)
	.then((p1) => {
		console.log(`The first pokemon is ${p1.data.name}`)
		return axios.get(`${URL}/2/`)
	})
	.then((p2) => {
		console.log(`The second pokemon is ${p2.data.name}`)
		return axios.get(`${URL}/3/`)
	})
	.then((p3) => {
		console.log(`The third pokemon is ${p3.data.name}`)
	})
	.catch((err) => `Oops, error: ${err}`)
```

This example doesn't make much sense, and we should always consider making standalone api calls.  
But when we inevitably create dependendant asyc functions, promise chaining will be very beneficial.

## Building our own Promises

This syntax will take sometime to get used to!

- Use **Promise** alongside the **new** keyword;
- Promise accepts a **single** function as an argument
- This function accepts **two** functions, _resolve_ and _reject_
- Resolve is passed the data we want to return on success
- Reject is passed a value for the promise to reject to.

### Example

```js
function wait3Seconds() {
	return new Promise((resolve, reject) => {
		// if we just pass resolve()/reject() this will return immediately.
		selfTimeout(resolve, 3000)
	})
}
wait3Seconds
	.then(() => console.log('Done'))
	.catch((err) => console.log('Error'))
```

This is useful whenever we have dependent calls, in order to avoid nesting:

```js
const h1 = document.querySelector('h1')
setTimeout(function () {
	h1.style.color = 'red'
	setTimeout(function () {
		h1.style.color = 'blue'
		setTimeout(function () {
			h1.style.color = 'green'
		}, 1000)
	}, 1000)
}, 1000)
```

```js
let changeColor = (el, color) => {
	return new Promise((res, rej) => {
		setTimeout(() => {
			el.style.color = color
			resolve()
			// Resolve works like return, passing the data and the signal to continue executing the block
		}, 1000)
	})
}
changeColor(h1, 'red')
	.then(() => changeColor(h1, 'orange'))
	.then(() => changeColor(h1, 'yellow'))
	.then(() => changeColor(h1, 'green'))
	.then(() => changeColor(h1, 'blue'))
	.then(() => changeColor(h1, 'indigo'))
	.then(() => changeColor(h1, 'violet'))
```
