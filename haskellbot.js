const Runner = require('./haskellRunner.js');
const spawn = require('child_process').spawn;
const fs = require('fs');

const questionFilepath = "./questions.json";

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

var quizQuestions = [
    {
        question: "Write some Haskell to find the maximum item in this list [1,4,9,2,3,12]",
        answer: "12"
    }
]

var currentQuestion = 0

module.exports = {
    generateHelpText: () => {
        return "\
Hi, I'm the enlightened HaskellBot! You needed help... 😢.\n\
My options are:\n\
\`\`\`\n\
!run <glorious haskell code>: runs the provided haskell code and returns the result. Requires that the haskell has a function out with the result you want to get.\n\
!help: shows this menu\n\
!q <opt: q number>: starts a quiz! (optionally with a specific question)\n\
!getQs: gets the question numbers\n\
!a <code to answer question>: answer a quiz question\n\
!newQ `question` `answer`: add a question to the quiz\n\
!skip: ends the current question without a score\n\
!getQs: gets the question numbers\n\
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

    doQuiz: (channel, scores, questionNumber) => {
        console.trace("something")
        console.log(questionNumber)
        if (questionNumber < 0) {
            questionNumber = currentQuestion;
        }
        if (questionNumber > (quizQuestions.length - 1)) {
            questionNumber = currentQuestion;
        }
        let questionMessage = `**Quiz Time**: First to answer correctly wins! Use !hs answer <code> to answer.\n\
        \`\`\`
${quizQuestions[questionNumber].question}
\`\`\`
        `
        currentQuestion = questionNumber
        channel.send(questionMessage);
        return currentQuestion;
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
                currentQuestion = currentQuestion + 1;
                if (currentQuestion >= quizQuestions.length) {
                    currentQuestion = 0
                }
                done(true, output)
            } else {
                done(false, output)
            }
        });
    },

    addQuestion: (q, a) => {
        quizQuestions.push({
            question: q,
            answer: a
        })
        fs.writeFile(questionFilepath, JSON.stringify(quizQuestions), 'utf8', (err) => {
            if (err) {
                console.error("Failed to write questions to file", err);
            }
        })
        return 'Q' + (quizQuestions.length - 1) + ': ' + q + ' ' + a;
    },

    loadQuizQuestions: () => {
        fs.readFile(questionFilepath, 'utf8', (err, data) => {
            if (err) {
                console.error("Failed to read questions from file", err);
            }
            if (data) {
                quizQuestions = JSON.parse(data);
            }
        })
    },

    getQuestions: () => {
        let outputString = ""
        var count = 0
        quizQuestions.forEach((a)=>{
            outputString = outputString + count + " "
            count = count + 1
        })
        return outputString;
    }

}
