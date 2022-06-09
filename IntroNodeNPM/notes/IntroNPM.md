# NPM

Node packages manager is the JS equivalent to pip  
However, npm does not require manual creation of reqs or venvs.  
Instead, dep management is handled automatically.

## Starting a Project with Npm

```sh
cd project-dir
npm init


# Guides us through a set-up
# Generates a package-json file;
```

## Installing deps

Once we've initialized a new package.json, we can start installing deps;

```sh
npm install axios
# installs latest stable version
npm i packageName@1.2.3
# Also creates a node-modules folder
```

## Node Modules

Contains all of the code necessary for our deps;
This folder will function like venv!
_git ignore node modules!_  
_**Do NOT** ignore package.json!_

## Skipping walkthrough

```js
npm init --yes
// defaults through node walk-through
```

## Install all packages

If we already have a package.json (like a cloned repo) we can install all deps recursively:

```js
npm install
```

**npm install** works like _pip install -r requirements.txt_  
npm install automatically looks to package-lock.json then package.json  
**package-lock.json** contains our specific version nums

## Referencing dependencies

We've npm installed an external library:

```js
npm install faker
```

How do we use it?

```js
// require('faker')
const faker = require('faker')
const axios = require('axios')

console.log(faker.name.findName())
```

