# A smarter model

Our previous model class works well as light CRM.  
It lacks the ability to instantiate cat, and therefor cannot support instance methods like associations or actions.  
we can make this more functional and elegant with a smarter model.  
This model is a more traditional OO class -> instantiating new objs, calling methods on them.  
If we remember flask we'd call something like:

```py
User.query.order_by(User.username).all();
# Returns list of user objects
```

## Setup

We'll be working with [dogs](../demo/models/dog.js)

- Build a more traditional OO class
- Instantiate objects - once per dog
- Hold data specific to each dog
- Still has static methods
  - Get all, get specific, create
- Includes instace methods
  - Update, Delete

## Part 1

We'll still want an Obj.getAll() -> but we want this to return an arr of instantiated objects
### New class
```js
class Dog {
	constructor(id, name, age) {
		this.id = id
		this.name = name
		this.age = age
		this.species = dog
	}
	static async getAll() {
		const results = await db.query(`
    SELECT id, name, age FROM dogs;
    `)
		return results.rows.map((dog) => new Dog(dog.id, dog.name, dog.age))
	}
	// Now we can make instance methods!
	speak() {
		console.log(`${this.name} says WOOF!`)
	}
}
module.exports = Dog
```

```js
router.get('/', async (req, res, next) => {
	const dogs = Dog.getAll()
	res.json(dogs)
})
```

We get the same response as before, but now our object exists

```js
router.get('/', async (req, res, next) => {
	const dogs = Dog.getAll()
	dogs.forEach((d) => d.speak())
	res.json(dogs)
})
```

## Part II

### Create

```js
router.post('/', async (req, res, next) => {
	const { name, age } = req.body
	const dog = Dog.create(name, age)

	res.json(dogs)
})
```

```js
statis async create(name, age) {
  const results = await db.query(
    `
    INSERT INTO dogs (name,age)
    VALUES ($1, $2)
    RETURNING id, name, age
    `, [name,age]
  )
  const {id, name, age} = results.rows[0];
  return new Dog(id, name age)
}
```
### Delete

Delete is a instance method, it does not need to be passed id

```js

async remove () => {
const results = await db.query(`
DELETE FROM dogs
WHERE id = $1
RETURNING id`,
[this.id]
)
if (results.rows.length === 0) {
  throw new ExpressError('Dog not found', 404)
}
}
```

```js
router.delete('/:id', async (req, res, next) => {
	try {
		let dog = await Dog.getById(req.params.id)
		await dog.remove()
		return res.json({ msg: 'deleted' })
	} catch (e) {
    next(e)
  }
})
```
### Update
To update we start with an instance method that saves new changes:
```js
async save(){
  await db.query(`
  UPDATE dogs
  SET name = $1, age = $2 
  WHERE id = $3`,[this.name,this.age,this.id])
}
```
The demo has us write a route for each att we want to change.  
Instead, lets write a true patch route:
```js
router.patch('/:id', async function (req, res, next) {
	try {
		let dog = await Dog.getById(req.params.id)
		const { name, age } = req.body
    // Easy ternary logic
		dog.name = name ? name : dog.name
		dog.age = dog.age = age ? age : dog.age

		await dog.save()
		return res.json(dog)
	} catch (e) {
		next(e)
	}
})
```
