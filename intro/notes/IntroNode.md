# Node.js

Node is **server-side** JS _environment_.  
It uses the Chrome v8 engine, but doesn't require/use Chrome itself.  
Can be used to build any kind of server-side js  
We've primarily focused on DBs, and APIs, but server-side apps include:  
Shell-scripts, web apps, hardware.

## Why use Node?

A single language to rule them all! No context switching.  
Extensive set of add-ons available through **NPM**! That's right _NPM_ is **BACK!**  
Many of the NPM libraries are also available on the client-side. (Axios for example)  
Very good at handling simultaneous events, real-time information, and data streams.  
Not the best at long-processes (there's a reason data scientists use Python)

### Electron

Electron is a library that lets us write a single code base, and makes this app available  
as windows, mac, or linux native application. _Very popular_

## Using Node

Remember with python we had a couple choices.  
python3 -> would open an interactive terminal, or REPL  
python3 filename -> runs a specific file  
Node is the same;

```js
node
```

Simply using node in the command line will open Node's REPL;  
Mostly useful for debugging and checking things out.

```js
echo console.log('Hello!') > test.js
node test.js
```

## NPM

[Notes on NPM](IntroNPM.md)

# Node _process_ Module

Node has a built in library called process. We don't need to install or require it.  
**process** is a global object we can use to:

- Access environment vars
- See command-line arguments
- Kill the script currently running

### process.env

This is where we store secret keys!
this is an object!  
process.env.SECRET_KEY is similar to heroku's secret manager

```js
export secret = 'nevertell!'
node
process.env
// contains secret
```

### process.argv[index]

process.argv is an array of command-line args given to start this program  
In a new file:

```js
for (arg of process.argv) console.log(arg)
```

running this in the command line gives us:

```sh
node ->
#
/home/ducks/.nvm/versions/node/v16.15.0/bin/node -> path to node
/home/ducks/springboard/Node/IntroNodeNPM/printArgs.js -> path to file!
# Whatever args we add when we run the script will also be added to argv:
node test ->
/home/ducks/.nvm/versions/node/v16.15.0/bin/node -> path to node
/home/ducks/springboard/Node/IntroNodeNPM/printArgs.js -> path to file!
test
```

### process.exit(exit_code)

Exits script immediately and returns exit code to shell;

# The Module System

In python we use import statements to split and share code across our files  
Node is similar, we manually import code into new files.

```js
// helper/add.js:
function add(x,y) {
  return x+y
}
// In app.js
const add = require('./helper/add')
// In console
node app.js
add -> {}
```

Our new add variable is an empty obj?  
We didn't specify what to export!

```js
// new helper/maths.js
function add(x, y) {
	return x + y
}
function sub(x, y) {
	return x - y
}
modules.exports = {
	add: add,
}
// app.js
const maths = require('./helper/maths')
maths.add(2, 2)
```

Boom, for simplicities sake we'll always try to make modules.exports and object!  
It's also very common to destructure our import:

```js
const { add, sub } = require('./helper/maths')
// Remember if we forget ./ node will look in node_modules
```

## Node File System Module

Node's fs module is a light, built-in interface for our local file system.

```js
node
const fs = require('fs')
fs
// shows all of the available vars and methods
```

It's commonly used to read/write files. Let's look at reading, writing, and appending;

### Node Callbacks

Many Node modules utilize async callbacks by default- read and write are no exception!

```js
fs.readFile('<path to file>', '<encoding type>', function (err, data) {
	if (err) {
		//display the err
	}
	//do stuff
})
// Error first in the callback?
```

### Error-first pattern

Node callbacks commonly use an 'error-first' pattern as we saw.  
Node will either supply an **error obj** or pass null.

### Handling Errors

In the browser we can do different things with the error

- populate the dom with an error message
- log err to console
- pop up alert

In node, we really do one of these:

- log err in console
- exit program with _process.exit(1)_

## FS.readFile con't

```js
fs.readFile('assets.txt', 'utf8', (err, data) => {
  if err {
    console.log('ERROR:',err)
    process.exit(1)
  }
  console.log(data)
})
// 'utf8' is the encoding type for txt. Binary is common for music/images
```

## FS.writeFile

The basic syntax for writing to a file is: _fs.writeFile('file-path',data[,options], callback)_  
_options_ include:

- encoding
- mode
- flag

```js
const fs = require('fs')
const content = 'I wonder as I wander- will I ever see the sea?'

fs.writeFile('poem.txt', content, 'utf8', (err) => {
	if (err) {
		console.log('ERROR:', err)
		process.exit(1)
	}
	console.log('Successfully wrote to file!')
})
console.log('File being written to..')
```

This will create poem.txt and populate it. Anything in poem prior will be overwritten (classic)

## fs.writeFile flags!

Flags are used to modify writeFile's behavior.  
With them we do things like append new data, rather than override everything in a file.  
[Full List of Flags](https://nodejs.org/api/fs.html#file-system-flags)  
| Flag | Function |
| :--|:--|
|a |Open file for appending. The file is created if it does not exist.|
|ax |Like 'a' but fails if the path exists.|
|a+ |Open file for reading and appending. The file is created if it does not exist.|
|ax+|Like 'a+' but fails if the path exists.|
| as |Open file for appending in synchronous mode. The file is created if it does not exist.|
| as+ |Open file for reading and appending in synchronous mode. The file is created if it does not exist.|
| r |Open file for reading. An exception occurs if the file does not exist.|
| r+ |Open file for reading and writing. An exception occurs if the file does not exist.|
| rs+ |Open file for reading and writing in synchronous mode. Instructs the operating system to bypass the local file system cache. (I/O performance hit)|
| w |Open file for writing. The file is created (if it does not exist) or truncated (if it exists).|
| wx |Like 'w' but fails if the path exists.|
| w+ |Open file for reading and writing. The file is created (if it does not exist) or truncated (if it exists).|
| wx+ |Like 'w+' but fails if the path exists.|
| x |Causes the operation to return an error if the path already exists. On POSIX, if the path is a symbolic link, using O_EXCL returns an error even if the link is to a path that does not exist.|  
To use these flags we need to pass an object as our write options:

```js
const line2 = '\nOnce I stand above the sand, will I still be- me?'

fs.writeFile('poem.txt', line2, { encoding: 'utf8', flag: 'a' }, (err) => {
	if (err) {
		console.log('ERROR:', err)
		process.exit(1)
	}
	console.log('File has been updated!')
})
```

If we're simply trying to append theres a simpler way

### Easier way to append - appendFile()

```js
const line2 = '\nOnce I stand above the sand, will I still be- me?'

fs.appendFile('poem.txt', line2, 'utf8', (err) => {
	if (err) {
		console.log('ERROR:', err)
		process.exit(1)
	}
	console.log('File has been updated!')
})
```
## Node vs Browser JS
Most behavior and syntax is exactly the same b/w Node and Browser JS  
The global object isn't **window**, its **global**
- this is where interval/timeout funcs are as well as any global vars we create (vars defined with var)  
- let/const do not add data to global obj  
Node does **NOT** have *document* or *DOM methods*  -> no jQuery
Node provides access to FS & can start server processes
Many NPM libraries are cross-compatible (isomorphic is the buzz-word)

