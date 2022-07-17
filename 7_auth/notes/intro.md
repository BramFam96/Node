# Auth time!
 We'll cover more complex concepts in Express specifically:
 - API validation
 - web-sockets
 - authentication
 - authorization 
 - testing
 - JSON web tokens (JWT)
## Intro Goals
- Hash some pws with bcrypt!
- Learn about and use JSON web tokens (authentication)
- Use middleware to simplify route security
## Setup
Copied, and stripped the finished demo code:  
[Basic Code](../excercise/app.js)  
Includes basic connection, and a single home route.  
Let's start by adding encryption:  
## Node Bcrypt
### Setup
```js
npm i bcrypt
```

While the underlying logic - the blow fish algorithm is the same, the method naming and implementation differ from Flask.  
To check it out, we'll launch bcrypt in node, without involving express:
```sh
node
const bcrypt = require('bcrypt')
bcrypt ->> 
{
  genSaltSync: [Function: genSaltSync],
  genSalt: [Function: genSalt],
  hashSync: [Function: hashSync],
  hash: [Function: hash],
  compareSync: [Function: compareSync],
  compare: [Function: compare],
  getRounds: [Function: getRounds]
}
```
### Methods
We'll be using *genSalt*, *hash*, and *compare*  
**bcrypt.hash(pw-to-hash, work-factor)**  
Let's try it:
```js
node
const bcrypt = require('bcrypt')
bcrypt.hash('test',12) -> Promise(<pending>)
```
That's right, promises! Unlike Py js must be told to wait for things.  
### Auth structure
```js
const bcrypt = require('bcrypt')
const pw = 'test';

const hashedPw = bcrypt.hash(pw,12).then(data => console.log(data))
const checkPw = bcrypt.hash(pw,hashedPw).then(data => console.log(data)) -> returns true/false

```
## Register Route
[route](../excercise/routes/auth.js)  
```js
router.post('/register', async (req,res,next) => {
  try {
    //We need to hash pw and save to db
    // Video approach
    /* ########################################################### */
    const {username, password} = req.body;
    if (!username || !password) {
      throw new ExpressError('Username and password requireed',400)
    }
    const hashedPw = await bcrypt.hash(password,12);
    const result = await db.query(`INSERT INTO users (username,password) VALUES ($1, $2) RETURNING username`,[username, hashedPw])
    // In our previous example, and even flask, we would return an id and store it in session.  
    return res.json(result.rows[0])
    /* ########################################################### */
    // If we had an oo approach this logic would be contained in our model. This route could simply be:
    const {username, password} = req.body;
    const user = await User.create(username,password);
  } 
  catch(e) {
    next(e)
  }
})
```