Let's create a mock Ajax Request to see both sides of the promise structure:

```js
let mockAjaxRequest = new Promise(function (resolve, reject) {
	let probSuccess = 0.5
	let reqTime = 1000

	setTimeout(function () {
		if (Math.random() < probSuccess) {
			let data = 'the data'
			resolve(data)
		} else {
			reject('Sorry, your req failed')
		}
	}, reqTime)
})

mockAjaxRequest
	.then((data) => console.log(data))
	.catch((err) => console.log(err))
```

Despite working like funcs, our promises are not called with ()  
Quick exception:

```js
mockAjaxRequest
	.then((data) => {
		console.log(data)
		return mockAjaxRequest
	})
	.then((data) => console.log(data))
	.catch((err) => console.log(err))
// mockAjaxRequest will print twice, at the same time, because they are a single request
// If we return mockAjaxRequest() then it will work as intended;
```

## Promise.all() && Promise.race()

### Promise.all()

Takes an array of pending promises, and returns a single new promise.  
We use it to batch/queue numerous promises for efficiencies sake. Example:

```js
let fourPokemonPromises = []
for (let i = 1; i < 5; i++) {
	fourPokemonPromises.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`))
}
Promise.all(fourPokemonPromises)
	.then((pokemonArr) => pokemonArr.forEach((p) => console.log(p.name)))
	.catch((err) => console.log(err))
```

Promise.all only resolves if **all** of its containing promises resolve.

### Promise.race()

Also accepts an array of promises and return a new promise  
Race will resolve or reject as soon as the first of its promises reolves or rejects.  
In the example above we would get 1 pokemon. The first one that resolved.
