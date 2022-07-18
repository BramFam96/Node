- [Authorization Structure](#authorization-structure)
	- [Recap of Authorization in Flask](#recap-of-authorization-in-flask)
	- [Intro to tokens](#intro-to-tokens)
- [Structure of JWT based Authenication](#structure-of-jwt-based-authenication)
- [JSON-web-tokens](#json-web-tokens)
	- [Node JWT Package](#node-jwt-package)
	- [Sign method](#sign-method)
		- [Validation](#validation)
- [Implementing JWTs](#implementing-jwts)
	- [Login](#login)
- [Protecting Routes](#protecting-routes)
	- [Verifying a token](#verifying-a-token)
	- [Authorization Middleware](#authorization-middleware)
	- [Middleware con't](#middleware-cont)

# Authorization Structure

## Recap of Authorization in Flask

- Request is made to login route
- User is authenticated on backend
- Backend returns neccessary data
- Data is added into session
  - Session data is encoded and signed with Flask-specific scheme
- Session info sent back to browser as cookie
- Session persists by being automically sent with each subsequent request

With this approach only the _specific flask-app_ that signed and encoded a cookie can use it.  
This poses problems with modern, API heavy applications.
We're going to use a more API-server friendly process.

## Intro to tokens

In Express _we want to share authentication across multiple APIs / hostnames_  
This functionality powers the modern app structure which we haven't really touched on yet.  
**Think- _'Sign in with Google'_**  
A production app, lets say a clone of Zillow for example, would have a structure like:

- A react front-end
- An express back-end
- An authentication API
- An API for browsing homes
- An API for selling homes
- An API for home owners who want info on _their_ home
  This is an entirely different strategy than what we've done so far.  
  With JWT's approach its no longer up to one server to provide _authorization_.  
  Instead a single API can **authenticate** a user, and that user's _authorization_ can persist across mulitple applications as a _key_

# Structure of JWT based Authenication

New order of operations:

- make request with u/pw
- server authenticates & returns token
  - Token is encoded & signed with open standard, "JSON Web Token"
- Front-end receives token
  - We tell client to store this token
- We include the token with every future request
  - Server validates token on each new request

The final step is not particular to one app -> any app can check for this token!

# JSON-web-tokens

[Sandbox](https://jwt.io/)  
JWT is an open-standard. It is a string comprising three parts:

- **Header** - metadata (signing algo, type of token)
- **Paload** - data to be stored in token (typically obj)
  - user_id typically
  - This is encoded, **not** _encrypted_ do not store raw, sensitive data!
    When JWT sends this data it _encodes_ these as base-64 _this is for speed_ **not** security.
- **Signature** - Calculated for security
- Takes a base-64 encoded version of header & payload + a SECRET token from server
  - Encrypts this string with algo specified in header (we'll use default "HMAC-SHA256)
    Let's look at a library to drastically simplify this process

## Node JWT Package

jwt comes with methods

- decode
- verify
- sign
- several errors

## Sign method

```js
jwt.sign(payload,secret-key,{expiresIn: 60*60})
 -> returns token
let myToken = jwt.sign({username:'Ducks',permission:'admin'}, 'a-better-secret-than-this')

```

Remember -> the payload is easily decodable!
The use of JWTS is to validate the source of information!

### Validation

When we hit a route that requires authentication we'll look in the header for our JWT.

```js
const reqToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.UJFGOSLW3ar5q9qUk8IOFrOYUsdL8pd9je3yV2Kp-9g'
jwt.verify(reqToken, 'a-better-secret-than-this') -> returns payload
jwt.verify(reqToken, 'any-other-secret') -> returns {name: JsonWebTokenError, message:'invalid signature'}
```

Again we can still decode the message without the token. JWTs are just a way to ensure origin and integrity.

# Implementing JWTs

## Login

To recap we have a login route:

```js
router.post('/login', async (req, res, next) => {
	try {
		const { username, password } = req.body
		// Handle missing user/password
		if (!username || !password) {
			throw new ExpressError('Missing username or password', 400)
		}

		const result = await db.query(
			`
    SELECT username, password FROM users WHERE username=$1`,
			[username]
		)

		const user = result.rows[0]

		if (!user) {
			throw new ExpressError('Username invalid', 401)
		}
		if (!(await bcrypt.compare(password, user.password))) {
			throw new ExpressError('Password invalid', 401)
		}
		return res.json({ message: 'Logged in' })
	} catch (e) {
		next(e)
	}
})
```

Let's implement JWTs

```js
router.post('/login', async (req, res, next) => {
	try {
		const { username, password } = req.body
		// Handle missing user/password
		if (!username || !password) {
			throw new ExpressError('Missing username or password', 400)
		}

		const result = await db.query(
			`
    SELECT username, password FROM users WHERE username=$1`,
			[username]
		)

		const user = result.rows[0]

		if (!user) {
			throw new ExpressError('Username invalid', 401)
		}
		if (!(await bcrypt.compare(password, user.password))) {
			throw new ExpressError('Password invalid', 401)
		}
		// **********************************************************
		// username makes sense here again, because we didn't make an id;
		let token = jwt.sign({ username }, SECRET_KEY)
		return res.json({ message: 'Logged in', token })
		// **********************************************************
	} catch (e) {
		next(e)
	}
})
```

# Protecting Routes

How are we going to include it with future requests?  
If our app had a front-end:

```js
//get token from login route
let resp = await axios.post('/login', { username: 'jane', password: 'secret' })
let token = response.data.token

await axios.get('/secret', { params: { token } })
await axios.post('/secret', { token })
```

## Verifying a token

Our accompanying routes:

```js
/** Secret-1 route than only users can access */

router.get('/secret-1', async function (req, res, next) {
	try {
		// try to get the token out of the body
		const tokenFromBody = req.body.token

		// verify this was a token signed with OUR secret key
		// (jwt.verify raises error if not)
		jwt.verify(tokenFromBody, SECRET_KEY)

		return res.json({ message: 'Made it!' })
	} catch (err) {
		return next(new ExpressError('Unauthorized', 401))
	}
})
```
This logic will be duplicated on every protected route  
## Authorization Middleware
[Middleware Funcs](../excercise/middleware/auth.js)
With a middleware function, we can add our token to the req body on every neccesary route  
```js
async function authenticateJWT (req,res,next) {
	try {
		const tokenFromBody = req.body.token;
		const payload = jwt.verify(tokenFromBody, SECRET_KEY)
		req.user = payload;
		// We simply add verfied payload to req and call next
		return next()
	} catch(e) {
		// error here just means no req.user;
		return next()
	}
}
```
We import authenticate in app.js and call it before our routes:
```js
app.use(express.json())
app.use(authenticateJWT)
app.use('/', routes)
```
## Middleware con't
In addition to this, we're going to have repititive logic for
- ensuring a user is logged in
- ensuring a user has privledges
Still in [middleware](../excercise/middleware/auth.js)  
```js
function ensureLoggedIn(req, res, next) {
  if (!req.user) {
    const err = new ExpressError("Please log in", 401);
    return next(err);
  } else {
    return next();
  }
}
// end

/** Require admin user or raise 401 */

function ensureAdmin(req, res, next) {
  if (!req.user || req.user.username != "admin") {
    const err = new ExpressError("Unauthorized", 401);
    return next(err);
  } else {
    return next();
  }
}
```
We'll import these into [specific routes](../excercise/routes/auth.js)  
```js
router.get("/secret",
  ensureLoggedIn,
  async function (req, res, next) {
    try {
      return res.json({ message: "Made it!" });
    } catch (err) {
      return next(err);
    }
  });
// end

/** Secret-admin route: only admins can access */

router.get("/secret-admin",
  ensureAdmin,
  async function (req, res, next) {
    try {
      return res.json({ message: "Made it!" });
    } catch (err) {
      return next(err);
    }
  });
```