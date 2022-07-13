let url = 'https://swapi.dev/api/planets/1/'
// Make promise that resolves to planet data:
axios
	.get(url)
	// Return new promise that resolves to first resident's data"
	.then((planet) => {
		console.log('First promise resolved!')
		return axios.get(planet.data.residents[0])
	})
	// No more nesting!
	// BONUS We can cleanly add unlimited dependent calls given that they return:
	// Return new promise that resolves to resident's first film:
	.then((resident) => {
		console.log('Second promise resolved!')
		return axios.get(resident.data.films[0])
	})

	.then((film) => {
		console.log('Third promise resolved!')
		document.querySelector('ul').innerHTML = `<li>${JSON.stringify(
			film.data
		)}</li>`
		console.log(film.data)
	})
	// BONUS a single .catch!
	.catch((err) => console.log('Promise Rejected!:', err))
