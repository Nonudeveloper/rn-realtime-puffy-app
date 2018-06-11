# PROJECT PUFFY

## Requirements

For development, you will need Node.js installed on your environment.

### Node

[Node](http://nodejs.org/) is really easy to install & now include [NPM](https://npmjs.org/).
You should be able to run the following command after the installation procedure
below.

    $ node --version
    v10.4.0

    $ npm --version
    6.1.0

#### Node installation on OS X

You will need to use a Terminal. On OS X, you can find the default terminal in
`/Applications/Utilities/Terminal.app`.

Please install [Homebrew](http://brew.sh/) if it's not already done with the following command.

    $ ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"

If everything when fine, you should run

    brew install node

#### Node installation on Linux

    sudo apt-get install python-software-properties
    sudo add-apt-repository ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install nodejs

#### Node installation on Windows

Just go on [official Node.js website](http://nodejs.org/) & grab the installer.
Also, be sure to have `git` available in your PATH, `npm` might need it.

---

## The React Native CLI

Node comes with npm, which lets you install the React Native command line interface.
Run the following command in a Command Prompt or shell:

    npm install -g react-native-cli

## Install

    $ git clone https://github.com/ORG/PROJECT.git
    $ cd PROJECT
    $ npm install

### Configure app

Edit src/config/config.js file to add the url where you have setup:

- backend api
- oauth like endpoint for auth
- development

## Start & watch (optional)

    $ npm start

## Running your React Native application in Android

    $ cd mobile-react
    $ react-native run-android

## Running your React Native application in IOS

    $ cd mobile-react
    $ react-native run-ios

## Simple build for production

    $ npm run build

## Update sources

Some packages usages might change so you should run `npm prune` & `npm install` often.
A common way to update is by doing

    $ git pull
    $ npm prune
    $ npm install

To run those 3 commands you can just do

    $ npm run pull

**Note:** Unix user can just link the `git-hooks/post-merge`:

## Enable git hooks (unix only :/)

    $ npm run create-hook-symlinks

### `post-merge` (≃ `npm install`)

This hook will `npm prune && npm install` each time you `git pull` something if the `package.json` has been modified.

### `pre-commit` (≃ `npm test`)

This hook will just ensure you will commit something not broken bye pruning npm packages not in the `package.json` & eventually reinstall missings/not correctly removed packages.
Then it will try a production build.

---

## Languages & tools

### HTML

- [Jade](http://jade-lang.com/) for some templating.

### JavaScript

- [React Native](https://facebook.github.io/react-native/) is used for UI
- [React](http://facebook.github.io/react) is used for Development.


Whenever react native is upgraded please run this command.

rm -rf node_modules/ && npm cache clean && npm install

NOTE: when debug on device; if you get red missing script errors, run:
$ANDROID_HOME/platform-tools/adb reverse tcp:8081 tcp:8081
