# Current state of code base

Our application code currently contains a ton of SQL queries.  
In Flask, once we had defined a model, we no longer needed to write queries ourselves.  
We're going to do this with Express!

# Goals

We're going to refactor our base to seperate view (routing) and logic (data);  
We're also going to compare different OO designs for interfacing;  
Essentially, we're going to borrow ideas from ORMS to build our own model layer.

# OOP

OOP isn't crticial to functionality, but it offers several benefits:

## Abstraction

OOP allows us to **abstract** implementation details.  
This way our routes contain things like:

```js
m.getTags()
u.updateDetails()
```

This makes our code cleaner, maintainable, and sharable.

## Encapsulation

Encapsulation is the ability to group functionality intro larger, logical pieces.  
ie - everything related to _Cat data_ lives in the obj **Cat**

## Polymorphism

Things like inhereting and extending class functionality falls under the term **Polymorphism**  
Simply, it is a mechanism for absrtacting and implementing similar functionality across classes  
This drastically reduces code duplication. (Think how often we selected from a db!)

## Refactoring - Simple approach

We're going to be working with new [cat routes](../oo-demo/models/cat.js)  
Additionally, we'll be building [models](../oo-demo/models/cat.js), and [data](../oo-demo/data.sql)

```js
router.get('/', async function (req, res, next) {
	let result = await db.query('SELECT * FROM cats')
	let cats = result.rows
	return res.json(cats)
})
// We want to abstract this to something like:
function getAllCats() {}
function updateCatAge(id) {}
function deleteCat(id) {}
```

## Simple OO Model

We can make a simple class that does not hold data.  
ie - This class is never _instantiated_ into a new Cat.  
Instead, it holds all cat realted functions- class functions that we'd call on _Cat_.

```js
Cat.getAll()
Cat.find(1)
Cat.update(3, data)
```

We declare class methods in JS with _static_
In [models/cat](../oo-demo/models/cat.js);

```js
const db = require('../db')
class Cat {
	static async getAll() {
		const result = await db.query(`SELECT id, name, age FROM cats;`)
		return results.rows
	}
}
module.exports = Cat
```

Once we import it our route becomes:

```js
router.get('/', async function (req, res, next) {
	try {
		const cats = await Cat.getAll()
		return res.json(cats)
	} catch (e) {
		next(e)
	}
})
```

Let's make a getById() funciton. Let's call it find();

```js
class Cat {
	static async find(id) {
		const result = db.query(`SELECT id, name age FROM cats WHERE id =$1`, [id])
		return result.rows[0]
	}
}
```

New find route!

```js
router.get('/:id', async (req, res, next) => {
	try {
		const cat = await Cat.find(req.params.id)
		return res.json(cat)
	} catch (e) {
		next(e)
	}
})
```

We should also move our error checking logic into our class methods:

```js
const db = require('../db')
const ExpressError = require('../ExpressError')
class Cat {
	static async getAll() {
		const result = await db.query(`SELECT id, name, age FROM cats;`)
		if (result.rows.length === 0) {
			throw new ExpressError('Unable to connect to database', 404)
		}
		return results.rows
	}
	static async find(id) {
		const result = db.query(`SELECT id, name age FROM cats WHERE id =$1`, [id])
		if (result.rows.length === 0) {
			throw new ExpressError(`Unable to find cat with id ${req.params.id}`, 404)
		}
		return result.rows[0]
	}
}
module.exports = Cat
```

## Creating new cat without directly instantiating

We'll inevitably have the route:

```js
router.post('/', async (req, res, next) => {
	try {
		const { name, age } = req.body
		const cat = await Cat.create(name, age)
		return res.json(cat)
	} catch (e) {
		next(e)
	}
})
```

```js
class Cat {
	static async create(name, age) {
		if (!name || !age) {
			throw new ExpressError('missing name or age', 400)
		}
		const result = db.query(
			`INSERT INTO cats (name,age) VALUES ($1,$2) RETURING id,name,age`,
			[name, age]
		)
		return result.rows[0]
	}
}
```

And of course:

```js
router.delete('/:id', async (req, res, next) => {
	try {
		await Cat.delete(req.params.id)
		return res.json(`Deleted cat with id of ${id}`)
	} catch (e) {
		next(e)
	}
})
```

```js
static async delete(id) {
  const result = `
  DELETE FROM cats
  WHERE id=$1`,[id]
}
```

To check if something is actually deleted we'd return something. Typically just id

## Updating

We can approach updating cats several ways. Easiest:

```js
static async update(id, newName, newAge) => {
  const result = await db.query(`
  UPDATE cats SET name = $1, age = $2
  WHERE id = $3
  RETURNING id, name, age
  `,[newName, newAge, id])
  if (result.rows.length === 0) {
	  throw new ExpressError(`Unable to find cat with id ${req.params.id}`, 404)
	}
	return result.rows[0]
}
```

This does not account for blank name or age.  
For that we'd check prior to update if name or age were blank, and get oldName or oldAge from db if true.

```js
router.put('/:id', async (req, res, next) => {
try {
  const {name,age} = req.body
  const cat = await Cat.update(req.params.id, name, age)
  return res.json(cat)
} catch(e) {
  next(e)
})}
```

We'll also make a patch route that increments a cats age by 1;

```js
router.patch(':/id', async (req, res, next) => {
	try {
		const cat = await Cat.birthday(req.params.id)
		return res.json(cat)
	} catch (e) {
		next(e)
	}
})
```

```js
static async birthday(id) => {
  const result = await db.query(`
  UPDATE cats SET age = age+1
  WHERE id = $1
  RETURNING id, name, age
  `,[id])
  if (result.rows.length === 0) {
	  throw new ExpressError(`Unable to find cat with id ${req.params.id}`, 404)
	}
	return result.rows[0]
}
```

This could get obnoxious if we'd like to change other individual attributes.  
Unfortunately, this is a downside of our current approach -> moving all logic into static methods.  
To overcome this, we'll be taking a different approach, and making a model that instantiates new objs.
