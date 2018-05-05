let Runner = require('./haskellRunner.js');
let spawn = require('child_process').spawn;

module.exports = {
    generateHelpText: () => {
        return "\
Hi, I'm the enlightened HaskellBot! You summoned me with no command 😢.\n\
My options are:\n\
\`\`\`\n\
!hs compile <glorious haskell code>: runs the provided haskell code and returns the result\n\
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
    }

}
