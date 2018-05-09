# HaskellBot
Runs haskell code and provides a haskell quiz in a Discord server.

## Setup

1. Create a `secrets/secrets.js` file containing the following:

```js
module.exports = {
    botToken: '<DISCORD BOT TOKEN HERE>'
}

```

2. Create a `hs/tmp` directory to hold the generated haskell files
3. Run `yarn install` to install dependencies
4. Run `npm start` to start the bot!
