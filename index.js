const secrets = require('./secrets/secrets.js');
const HaskellBot = require('./haskellbot.js');
const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();

const scoresFilepath = "./scores.json";

var nameMappings = {
    '428927344778936330': 'nathan',
    '283348992249561090': 'kevin',
    '340212889715474454': 'tim',
    '193110693376032769': 'cher'
}

var currentScores = {
    'nathan': 0,
    'tim': 0,
    'kevin': 0,
    'cher': 0
}

var activeQuizQuestion = -1;

function loadScores() {
    fs.readFile(scoresFilepath, 'utf8', (err, data) => {
        if (err) {
            console.error("Failed to read questions from file", err);
        }
        if (data) {
            currentScores = JSON.parse(data);
        }
    })
}

function saveScores() {
    fs.writeFile(scoresFilepath, JSON.stringify(currentScores), 'utf8', (err) => {
        if (err) {
            console.error("Failed to write questions to file", err);
        }
    })
}

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  HaskellBot.loadQuizQuestions();
  loadScores()
  client.user.setGame("in the temple of Functional Programming, listening to guru Jeremy");
});

client.on('message', msg => {
  let message = msg.content;
  let sender = msg.author.id;

  if (message.length < 2) {
      // Can't possibly have a bot tag in, so ignore for now.
      return
  }

  // Summon haskellbot with !hs compile \n```stuff```
  let bottag = message.substring(0,1);
  if (bottag === '!') {
      // This message is for haskellbot! Yay!
      let messageComponents = message.split(" ");
      let switchString = messageComponents[0];
      if (switchString[switchString.length-1] === '\n') {
          switchString = switchString.subString(0, switchString.length-1);
      }

      switch (switchString) {
          case '!run':
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
          case '!newQ':
            // Message should be !hs addQuestion `question` `answer`. This means splitting on ` will
            // give [stuff, question, '', answer]
            let messageBits = message.split('`');
            let question = messageBits[1];
            let answer = messageBits[3];
            let string = HaskellBot.addQuestion(question, answer);
            msg.reply("Added a question, " + string);
            break;
          case '!q':
            let targetChannel = msg.channel;
            if (activeQuizQuestion >= 0) {
                msg.reply("There is already an active quiz, try answering that instead")
                break;
            }
            let messageParts = message.split(" ");
            var doQuestion = activeQuizQuestion;
            if (messageParts.length > 1) {
                doQuestion = messageParts[1]
            }
            activeQuizQuestion = HaskellBot.doQuiz(targetChannel, currentScores, doQuestion);
            break;
          case '!getQs':
            let questions = HaskellBot.getQuestions()
            msg.reply("The current questions are: \n " + questions);
            break;
          case '!a':
            if (activeQuizQuestion < 0) {
                msg.reply("There is no active quiz question right now. Try !hs quiz to start one.")
                break;
            }
            HaskellBot.answerQuiz(sender, activeQuizQuestion, message, (isRight, output) => {
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
                    saveScores()
                } else {
                    msg.reply(`Bad luck, ${user[0].toUpperCase() + user.substring(1)}, that's wrong...\n\`\`\`` + output + '```')
                }
            });
            break;
          case '!help':
            msg.reply(HaskellBot.generateHelpText());
            break
          case '!skip':
            activeQuizQuestion = -1;
            msg.reply("Question skipped! No points this time.")
            break;
          default:
            break
      }
  }
});

client.login(secrets.botToken);
