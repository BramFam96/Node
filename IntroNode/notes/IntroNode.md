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
