let board = document.getElementById('board')
let deckId = ''
const newDeck = () => {
	axios
		.get('http://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1')
		.then((res) => {
			console.log(res)
			deckId = res.data.deck_id
		})
}
const drawCard = (deckId) => {
	let url = `http://deckofcardsapi.com/api/deck/${deckId}/draw/`
	let params = { params: { count: 1 } }

	axios.get(url, params).then((res) => {
		cardData = res.data.cards[0]
		console.log(res)
		console.log(res.data.remaining)
		console.log(`${cardData.value} of ${cardData.suit}`)
		return cardData
	})
}

const showCard = (cardData) => {
	let card = document.createElement('img')
	card.src = `${cardData.images.png}`
	card.alt = `${cardData.value} of ${cardData.suit}`
	card.style.width = '75px'
	card.style.height = '125px'
	board.appendChild(card)
}

const drawAndShow = () => {
	let card = drawCard(deckId)
	card.then(showCard(card))
}
