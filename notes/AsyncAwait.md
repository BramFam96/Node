# Goals

1. Learn what async/await keywords do.
2. Learn the async await pattern.
3. Refactor promise/callback structured code using async await.

# Defining Keywords

## Async

Introduced in ES2017 -> used to make **any** function async  
Async functions always return a promise.

```js
async function friendlyGreeting() {
	return 'Hello!'
}
friendlyGreeting()
//Promise { <resolved>: 'Hello!'}
friendlyGreeting().then((msg) => console.log(msg))
// Logs 'Hello!'
```

Equivalent:

```js
function friendlyGreeting() {
	return Promise.resolve('Hello!')
}
friendlyGreeting().then((msg) => console.log(msg))
```

## What if we want to Reject?

Async funcs wrap anything we return in a resolved promise.  
To reject in an async we simply throw an **error**!

```js
async function oops() {
	throw 'Bad request!'
}
oops()
	.then((msg) => console.log(msg))
	.catch((err) => console.log('Inside catch:', err))
```

Not that useful- as we can return Promise.resolve(value) ourselves.  
Value becomes more apparent when we add _await_!

## Await Keyword

Inside of an **async** function we can use the **await** keyword  
**await** pauses the execution of an **async** function-  
it waits for promise to resolve **AND** extracts its resolved value  
We can **await** any func that returns a promise (ie other async funcs!)

```js
async function getStarWarsFilms() {
	console.log('starting')
	const res = await axios.get('https:swapi.dev/api/films')
	console.log(res.data)
	console.log('ending')
	// Now our code looks synchronous!
	// We can just call this func!
	getStarWarsData()
}
```

Look at the equivalent chunk:

```js
function getStarWarsFilms() {
  console.log('starting')
  axios.get('https://swapi.dev/api/films)
  .then(res => {
    console.log(res.data)
    console.log('ending')
  })
}
```

The real utility of await is apparent when we have multiple requests.  
This structure allows us to write a single async that awaits all of our calls.  
No more chaining thens!

## Async: Obj Methods

We can use async functions inside objects.  
We simply prefix our method name with the async keyword:

```js
let starWars = {
	genre: 'sci-fi',
	async logMovieData() {
		let url = 'https//:swapi.dev/api/films/'
		let movieData = await axios.get(url)
		console.log(movieData.data.results)
	},
}
starWars.logMovieData()
```

Let's build a deck obj:

```js
const deck = {
	async init() {
		let res = await axios.get('new_deck_url')
		this.deckId = res.data.deck_id
	},
	async shuffle() {
		let res = await axios.get('shuffle_url')
		console.log(res)
	},
	async drawCard() {
		let res = await axios.get('draw_url')
		console.log(res.data)
	},
}
```

## Async: class instance methods

We can use async/await in ES2015 Class instances

```js
class Pokemon {
	constructor(id) {
		this.id = id
		this.types = []
	}
	async logInfo() {
		let url = 'url'
		let res = await axios.get(`https:pokeapi.co/api/v2/pokemon/${this.id}`)
		this.name = res.data.name
		for (let type of res.data.types) {
			this.types.push(type.type.name)
		}
	}
}
let pokemon = new Pokemon(10)
pokemon.logName()
```

## Async Error Handling

Lets use an old example:

```js
async function getStarWarsFilms() {
  console.log('starting')
  let res = await axios.get('https://swapi.dev/api/films)
  console.log(res.data)
  console.log('ending')
  }
```

This is nice while it works, but a rejection will result in a full-blown error;  
Instead, we use try/catch!

```js
async function getUser(user) {
	try {
		let url = 'example'
		let res = await axios.get(url)
		console.log(res)
	} catch (e) {
		console.log('Error:', e)
	}
}
```

## Refactoring Async Code

```js
async function getThreePokemans() {
	let baseUrl = 'example'
	try {
		let { data: p1 } = await axios.get(`${baseUrl}/1`)
		console.log(p1.name)
		let { data: p2 } = await axios.get(`${baseUrl}/2`)
		console.log(p2.name)
		let { data: p3 } = await axios.get(`${baseUrl}/3`)
		console.log(p3.name)
	} catch (e) {
		console.log('Error in getThreePokemans:', e)
	}
}
```

## Sequential vs Parallel requests

In our threePokemans example, we are making three requests sequentially.  
This is inefficient considering the reqs aren't dependent on eachother.  
The solution is to run these in parellel:

```js
async function getThreePokemans() {
	let baseUrl = 'example'
	try {
    // Do not await these calls at instantiation:
		let p1Promise = axios.get(`${baseUrl}/1`)
		let p2Promise = axios.get(`${baseUrl}/2`)
		let p3Promise = axios.get(`${baseUrl}/3`)

    let p1 =  await p1Promise;
    let p2 = await p2Promise;
    let p3 = await p3Promise;

		console.log(p1.data.name)
    console.log(p2.data.name)
    console.log(p3.data.name)
	} catch (e) {
		console.log('Error in getThreePokemans:', e)
	}
  getThreePokemans()
```

Promise.all version:

```js
async function getThreePokemans() {
	let baseUrl = 'example'
	try {
    let pokemon = await Promise.all([
		axios.get(`${baseUrl}/1`),
		axios.get(`${baseUrl}/2`),
		axios.get(`${baseUrl}/3`)
    ])

    console.log(pokemon[0].data.name)
    console.log(pokemon[1].data.name)
    console.log(pokemon[2].data.name)
	} catch (e) {
		console.log('Error in getThreePokemans:', e)
	}
  getThreePokemans()
```
