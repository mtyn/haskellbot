let Runner = require('./haskellRunner.js');
let spawn = require('child_process').spawn;

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

const quizQuestions = [
    {
        question: "Write some Haskell to find the maximum item in this list [1,4,9,2,3,12]",
        answer: "12"
    }
]

module.exports = {
    generateHelpText: () => {
        return "\
Hi, I'm the enlightened HaskellBot! You summoned me with no command 😢.\n\
My options are:\n\
\`\`\`\n\
!hs compile <glorious haskell code>: runs the provided haskell code and returns the result. Requires that the haskell has a function out with the result you want to get.\n\
!hs help: shows this menu\n\
\`\`\`\n\
\n\
More options coming soon! May you find peace and wisdom at the temple of Functional Programming!\n\
"
    },

    runCode: (sender, messageText, done) => {
        // Do some processing here
        let codeSplit = messageText.split("```");
        if (codeSplit.length < 2) {
            return "FAILED TO EXECUTE: You didn't format your message correctly! Put whatever you want me to run in a code block please!"
        }

        let code = codeSplit[1];

        if (code.substring(0,2) === 'hs') {
            code = code.substring(2);
        }

        let before = "\
#!/usr/local/bin/runhaskell\n\
module Main where\n\
main = putStrLn $ show out\n\
        "


        let runCode = before + code;
        // Then run the code string
        let output = Runner.run(runCode, sender, (output) => {
            done(output);
        });
    },

    doQuiz: (channel, scores) => {
        let question = getRandomInt(0, quizQuestions.length);
        let questionMessage = `**Quiz Time**: First to answer correctly wins! Use !hs answer <code> to answer.\n\
        \`\`\`
${quizQuestions[question].question}
\`\`\`
        `
        channel.send(questionMessage);
        return question;
    },

    answerQuiz: (sender, active, messageText, done) => {
        let codeSplit = messageText.split("```");
        if (codeSplit.length < 2) {
            return "FAILED TO EXECUTE: You didn't format your message correctly! Put whatever you want me to run in a code block please!"
        }

        let code = codeSplit[1];

        if (code.substring(0,2) === 'hs') {
            code = code.substring(2);
        }

        let before = "\
#!/usr/local/bin/runhaskell\n\
module Main where\n\
main = putStrLn $ show out\n\
        "

        let runCode = before + code;
        // Then run the code string
        let output = Runner.run(runCode, sender, (output) => {
            if (output.trim() === quizQuestions[active].answer) {
                done(true)
            } else {
                done(false)
            }
        });
    },

    addQuestion: (q, a) => {
        quizQuestions.push({
            question: q,
            answer: a
        })
        return q + ' ' + a;
    }

}
