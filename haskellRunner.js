const exec = require('child_process').exec;
const execfile = require('child_process').execFile;
const fs = require('fs');

module.exports = {
    run: (codeString, user, done) => {
        // WARNING: This code is very bad. Don't do this. This accepts arbritary haskell code from
        // a discord server, and runs it. This is only OK because the discord server this is being
        // used on only has a few trusted users. In general, running arbritary code supplied by random
        // users is **NOT** recommended, for obvious reasons. I may fix this in the future? Although
        // it would limit what the bot does, so I'm not sure if I will

        let filepath = './hs/tmp'

        // First, we output the code to a file
        fs.writeFile(`${filepath}/${user}.hs`, codeString, (err) => {
            if (err) {
                console.error('Error saving haskell file :(', err);
            } else {
                let base = 'base';
                exec(`echo ${base}`, (err, stdout, b) => {
                    console.log(err, stdout, b);
                });
                // Then, we run that file through GHC
                exec(`chmod +x ${filepath}/${user}.hs`, (err, a, b) => {
                    if (err) {
                        console.error("EXEC ERROR:", err);
                        done("FAIL: Error in executor for permission change")
                    } else {
                        exec(`runhaskell ${filepath}/${user}.hs`, (err, stdout, stderr) => {
                            if (err) {
                                console.log("ERROR:", err)
                                done("FAIL: Haskell failed to run: \n" + stderr);
                            } else {
                                done(stdout);
                            }
                        })
                    }
                })
            }
        })
    }
}
