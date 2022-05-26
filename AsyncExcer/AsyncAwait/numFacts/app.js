let num = 5
let url = `http://numbersapi.com`
let params = {
	params: {
		json: `json`,
	},
}
// 1)
async function getFact() {
	try {
		let { data: numFact } = await axios.get(`${url}/${num}`, params)
		console.log(numFact.text)
	} catch (e) {
		console.log('Error', e)
	}
}
getFact()
// 2)
async function multiNumFact(min, max) {
	let res = await axios.get(`${url}/${min}..${max}`)
	console.log(res)
}
multiNumFact(3, 7)
// 3)
async function manyFacts(n) {
	let promiseArr = []
	for (let i = 0; i < n; i++) {
		let p = axios.get(`${url}/${num}`)
		promiseArr.push(p)
	}
	let facts = await Promise.all(promiseArr)
	console.log(facts)
	facts.forEach((f) => {
		$('body').append(`<p>${f.data}</p>`)
	})
}
manyFacts(3)
