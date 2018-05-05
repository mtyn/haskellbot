import { secrets } from '../secrets/secrets.js';
import { HaskellBot } from 'haskellbot.js';

const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  // if (msg.content === 'ping') {
  //   msg.reply('pong');
  // }
  let message = msg.content;

  if (message.length < 4) {
      // Can't possibly have a bot tag in, so ignore for now.
      return
  }

  // Summon haskellbot with !hs compile `stuff`
  let bottag = message.substring(0,3);
  if (bottag === '!hs') {
      // This message is for haskellbot! Yay!
      let messageComponents = message.split(" ")
      if (messageComponents.length < 2) {
          // No command for Haskellbot
          msg.reply(HaskellBot.generateHelpText());
          return
      }
      switch (message.split(" ")[1])
  }
});

client.login(secrets.botToken);
