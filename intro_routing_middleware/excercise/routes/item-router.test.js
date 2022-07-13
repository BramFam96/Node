process.env.NODE_ENV = 'test'

const request = require('supertest')

const app = require('../app')
let items = require('../fakeDb')

let pickles = { name: 'Pickles', price: 1.99 }

beforeEach(function () {
	items.push(pickles)
})

afterEach(function () {
	// make sure this *mutates*, not redefines, `items`
	items.length = 0
})
// end afterEach

/** GET /items - returns `{items: [item, ...]}` */

describe('GET /items', function () {
	test('Gets a list of items', async function () {
		const resp = await request(app).get(`/items`)
		expect(resp.statusCode).toBe(200)

		expect(resp.body).toEqual({ items: [pickles] })
	})
})
// end

/** GET /items/[name] - return data about one item: `{item: item}` */

describe('GET /items/:name', function () {
	test('Gets a single item', async function () {
		const resp = await request(app).get(`/items/${pickles.name}`)
		expect(resp.statusCode).toBe(200)

		expect(resp.body).toEqual({ item: pickles })
	})

	test("Responds with 404 if can't find item", async function () {
		const resp = await request(app).get(`/items/0`)
		expect(resp.statusCode).toBe(404)
	})
})
// end

/** POST /items - create item from data; return `{item: item}` */

describe('POST /items', function () {
	test('Creates a new item', async function () {
		const resp = await request(app).post(`/items`).send({
			name: 'popsicle',
			price: 1.00
		})
		expect(resp.statusCode).toBe(201)
		expect(resp.body).toEqual({
			item: { name: 'popsicle', price: 1.00 },
		})
	})
	test('Respond with 500 if name is missing', async function () {
		const resp = await request(app).post(`/items`).send({})
		expect(resp.statusCode).toBe(500)
	})
})
// end

/** PATCH /items/[name] - update item; return `{item: item}` */

describe('PATCH /items/:name', function () {
	test('Updates a single item', async function () {
		const resp = await request(app).patch(`/items/${pickles.name}`).send({
			name: 'pickles', price: 1.25
		})
		expect(resp.statusCode).toBe(200)
		expect(resp.body).toEqual({
			item: { name: 'pickles', price: 1.25 },
		})
	})

	test('Responds with 404 if id invalid', async function () {
		const resp = await request(app).patch(`/items/0`)
		expect(resp.statusCode).toBe(404)
	})
})
// end

/** DELETE /items/[name] - delete item,
 *  return `{message: "item deleted"}` */

describe('DELETE /items/:name', function () {
	test('Deletes a single a item', async function () {
		const resp = await request(app).delete(`/items/${pickles.name}`)
		console.log(resp.body)
		expect(resp.statusCode).toBe(200)
		expect(resp.body).toEqual({ message: `Deleted ${pickles.name} the item` })
	})
	test('Responds with 404 if id invalid', async function () {
		const resp = await request(app).patch(`/items/baditem`)
		expect(resp.statusCode).toBe(404)
	})
})
