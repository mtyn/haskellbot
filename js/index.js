let secrets = require('../secrets/secrets.js');
let HaskellBot = require('./haskellbot.js');

const Discord = require('discord.js');
const client = new Discord.Client();

var nameMappings = {
    '428927344778936330': 'nathan',
    '283348992249561090': 'kevin',
    '340212889715474454': 'tim'
}

var currentScores = {
    'nathan': 0,
    'tim': 0,
    'kevin': 0,
    'cher': 0
}

var activeQuizQuestion = -1;

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  let message = msg.content;
  let sender = msg.author.id;

  if (message.length < 3) {
      // Can't possibly have a bot tag in, so ignore for now.
      return
  }

  // Summon haskellbot with !hs compile \n```stuff```
  let bottag = message.substring(0,3);
  if (bottag === '!hs') {
      // This message is for haskellbot! Yay!
      let messageComponents = message.split(" ");
      if (messageComponents.length < 2) {
          // No command for Haskellbot
          msg.reply(HaskellBot.generateHelpText());
          return
      }
      let switchString = messageComponents[1];
      if (switchString[switchString.length-1] === '\n') {
          switchString = switchString.subString(0, switchString.length-1);
      }

      switch (switchString) {
          case 'compile':
            HaskellBot.runCode(sender, message, (output) => {
                if (output.length > 1910) {
                    let bitsOfMessage = output.match(/(.|[\r\n]){1,1750}/g);
                    msg.reply("I ran your haskell! It was too long for one message, it will now come in segments.");
                    bitsOfMessage.forEach((b)=>{
                        msg.reply("```" + b + "```");
                    })
                } else {
                    msg.reply("I ran your haskell! Output is: ```\n" + output + "\n```");
                }
            })
            break;
          case 'quiz':
            let targetChannel = msg.channel;
            if (activeQuizQuestion >= 0) {
                msg.reply("There is already an active quiz, try answering that instead")
                break;
            }
            activeQuizQuestion = HaskellBot.doQuiz(targetChannel, currentScores);
            break;
          case 'answer':
            if (activeQuizQuestion < 0) {
                msg.reply("There is no active quiz question right now. Try !hs quiz to start one.")
                break;
            }
            HaskellBot.answerQuiz(sender, activeQuizQuestion, message, (isRight) => {
                let user = nameMappings[sender];
                if (isRight) {

                    currentScores[user] = currentScores[user] + 1
                    msg.reply(`
Congrats, ${user[0].toUpperCase() + user.substring(1)}, you got a point! The current scores are:\n
\`\`\`
Kevin: ${currentScores.kevin},
Nathan: ${currentScores.nathan},
Tim: ${currentScores.tim},
Cher: ${currentScores.cher}
\`\`\`
`)
                    activeQuizQuestion = -1;
                } else {
                    msg.reply(`Bad luck, ${user[0].toUpperCase() + user.substring(1)}, that's wrong...`)
                }
            });
            break;
          case 'help':
          default:
            msg.reply(HaskellBot.generateHelpText());
      }
  }
});

client.login(secrets.botToken);
