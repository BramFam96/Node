let URL = 'https://deckofcardsapi.com/api/deck'
// Part 1 draw a card
async function getACard() {
	let res = await axios.get(`${URL}/new/draw/`)
	let { suit, value } = res.data.cards[0]
	console.log(`${value} of ${suit}`)
}
// Part 2
async function createAndDraw() {
	let card1 = await axios.get(`${URL}/new/draw/`)
	let deckId = card1.data.deck_id
	let card2 = await axios(`${URL}/${deckId}/draw/`)
	let cards = [card1, card2]
	cards.forEach(({ data }) => {
		let { suit, value } = data.cards[0]
		console.log(value, 'of', suit)
	})
}
// Part 3.
async function startGame() {
	let $btn = $('button')
	let $cardArea = $('#card-area')

	let deckData = await axios.get(`${baseURL}/new/shuffle/`)
	$btn.show().on('click', async function () {
		let cardData = await axios.get(`${baseURL}/${deckData.data.deck_id}/draw/`)
		let cardSrc = cardData.data.cards[0].image
		$cardArea.append(
			$('<img>', {
				src: cardSrc,
			})
		)
		if (cardData.remaining === 0) $btn.remove()
	})
}
setup()
