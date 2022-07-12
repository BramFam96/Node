# Using Node and Pg driver to model more complex relationships!
- 1:M
- M:M
- Handling 404s
## 1:M Relationship
We are given a [data.sql file](../demo/simple/data.sql)
It contains logic for making two dbs: Messages and Users.  
Users have many msgs, msgs have a single author;  
We have express and pg preinstalled  
[userRoutes](../demo/simple/routes/users.js) has a basic get like:
```js
router.get("/", async function (req, res, next) {
  try {
    const results = await db.query(
          `SELECT id, name, type FROM users`);

    return res.json(results.rows);
  }

  catch (err) {
    return next(err);
  }
});
```
What if we wanted to also return related messages? We could query both dbs
```js
router.get("/:id", async function (req, res, next) {
  try {
    // Instead of a single 'Result' we make two
    const uResults = await db.query(
          `SELECT name, type FROM users WHERE id=$1`,
        [req.params.id]);

    const msgResults = await db.query(
          `SELECT id, msg FROM messages 
             WHERE user_id = $1`,
        [req.params.id]);
  // The magic! We add this data to user.messages!
    const user = uResults.rows[0];
    user.messages = msgResults.rows;
    return res.json(user);
  }

  catch (err) {
    return next(err);
  }
});
```
We could also use a join:
```js
router.get('/:id', async function (req, res, next) {
	try {
		const { id } = req.params

		const result = await db.query(
			`SELECT u.id AS user_id, u.name, u.type, m.id AS msg_id, m.msg 
			 FROM users as u 
			 LEFT JOIN messages As m
			 ON u.id = m.user_id
			 WHERE u.id=$1`,
			[id]
		)

		if (resourceExists(result.rows)) {
			const { id, name, type } = result.rows[0]
			const msgs = result.rows.map((row) => ({id: row.msg_id, msg: row.msg}))
			
			let u = { id, name, type, messages: msgs }
			return res.json(u)
		
    } else {
			throw new ExpressError('No such user', 404)
		}
	} catch (e) {
		next(e)
	}
});
```
## M:M Relationship
Using the [same data](../demo/simple/data.sql), we have a M:M relationship between messages and tags;  
Remember M:M relationships neccessitate a third table. messages-tags in this case!  
The logic for getting messages can be copied from msgResults in the previous example. 
```js
router.get("/:id", async function (req, res, next) {
  try {
    const msgResults = await db.query(
          `SELECT id, msg FROM messages 
             WHERE user_id = $1`,
        [req.params.id]);
      ...
```
## M:M Queries
[Click here for code](../demo/simple/routes/messages.js)  

To return info on messages AND associated tags we'll need to write a **double join**. 
First **join** the *associated table* then join tags.  

Keep in mind we want to *include msgs* that **do not** have tags  

```js
router.get("/:id", async function (req, res, next) {
  try {
    const result = await db.query(
          `SELECT m.id, m.msg, t.tag
             FROM messages AS m
            //  We want left table plus matching ( we still want msgs without tags)
               LEFT JOIN messages_tags AS mt 
                 ON m.id = mt.message_id
               LEFT JOIN tags AS t ON mt.tag_code = t.code
             WHERE m.id = $1;`,
        [req.params.id]);
// result.rows contains two seperate objects 
// Instead of returning it we'll destructure it's data into a new obj;
    let { id, msg } = result.rows[0];
    let tags = result.rows.map(r => r.tag);

    return res.json({ id, msg, tags });
  }

  catch (err) {
    return next(err);
  }
});
```
## Handling missing resources
As usual we need to check results.rows exists;  
here's a function to do that:
```js
const resourceExists = (responseData) => {
  let basicValidation = responseData.length === 0 ? false : true
  return basicValidation;
}
```
## Updating Resource
To update we need check if a resource exists.  
Luckily, UPDATE SQL queries will return nothing if a resource is invalid.  
```js
router.patch("/:id", async function (req, res, next) {
  try {
    // We don't need select, updates will return nothing if resource is invalid
    const result = await db.query(
          `UPDATE messages SET msg=$1 WHERE id = $2
           RETURNING id, user_id, msg`,
        [req.body.msg, req.params.id]);

    if (result.rows.length === 0) {
      throw new ExpressError("No such message!", 404);
    }

    return res.json(result.rows[0]);
  }

  catch (err) {
    return next(err);
  }
});
```