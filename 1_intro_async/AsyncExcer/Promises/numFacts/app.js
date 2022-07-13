// PART 1 NUMBER FACTS
// Make a request for facts on fav number. Make sure you've set json param.
let getAFactForFive = () => {
	let url = 'http://numbersapi.com/5'
	let params = {
		params: {
			json: `json`,
		},
	}
	// Make promise that resolves to number data:
	axios
		.get(url, params)
		.then((res) => {
			console.log(`${res.data.text}`)
		})
		.catch((err) => console.log(err))
}
getAFactForFive()
// PART 2 MANY NUMS
let getMultipleNums = (min, max) => {
	let url = `http://numbersapi.com/${min}..${max}`
	let params = { params: { json: 'json' } }
	let ul = document.getElementById('manyNums')

	//Make promise to get data on range of nums:
	axios
		.get(url, params)
		.then((res) => {
			// Turn facts into arr:
			factList = Object.values(res.data)
			// Iterate over fact list:
			factList.forEach((f) => addFactToPage('manyNums', f))
		})
		.catch((err) => console.log(err))
}
getMultipleNums(1, 3)
// PART 3 MANY FACTS
let getManyFactsAboutFive = (num) => {
	let url = 'http://numbersapi.com/5'
	let listOfPromises = []
	for (let i = 0; i < num; i++) {
		listOfPromises.push(axios.get(`${url}`))
	}

	Promise.all(listOfPromises)
		.then((factArr) => {
			factArr.forEach((f) => addFactToPage('manyFacts', f.data))
		})
		.catch((err) => console.log(err))
}
getManyFactsAboutFive(4)

let addFactToPage = (parentId, text) => {
	let parent = document.getElementById(parentId)
	let newFact = document.createElement('li')
	newFact.innerHTML = `<h2>${text}</h2`
	parent.appendChild(newFact)
}
