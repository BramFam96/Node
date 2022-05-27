# NPM

Node packages manager is the JS equivalent to pip  
However, npm does not require manual creation of reqs or venvs.  
Instead, dep management is handled automatically.

## Starting Project with Npm

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
# Also creates a node-modules folder
```

## Node Modules

Contains all of the code necessary for our deps;  
_git ignore node modules!_  
_**Do NOT** ignore package.json!_

## Skipping walkthrough

```js
npm init --yes
// defaults through node walk-through
```

## Install all deps
