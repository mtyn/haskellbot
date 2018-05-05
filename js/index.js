let secrets = require('../secrets/secrets.js');
let HaskellBot = require('./haskellbot.js');

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  let message = msg.content;
  let sender = msg.sender.id;

  if (message.length < 3) {
      // Can't possibly have a bot tag in, so ignore for now.
      return
  }

  // Summon haskellbot with !hs compile \n```stuff```
  let bottag = message.substring(0,3);
  console.log(bottag)
  if (bottag === '!hs') {
      // This message is for haskellbot! Yay!
      let messageComponents = message.split(" ")
      console.log(messageComponents)
      if (messageComponents.length < 2) {
          // No command for Haskellbot
          msg.reply(HaskellBot.generateHelpText());
          return
      }
      switch (messageComponents[1]) {
          case 'compile':
            HaskellBot.runCode(sender, message, (output) => {
                msg.reply("I ran your haskell! Output is: ```\n" + output + "\n```");
            })
          case 'help':
          default:
            msg.reply(HaskellBot.generateHelpText());
      }
  }
});

client.login(secrets.botToken);
