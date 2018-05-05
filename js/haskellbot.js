import { Runner } from 'haskellRunner.js';

const HaskellBot = {
    generateHelpText: () => {
        return ```
            Hi, I'm the enlightened HaskellBot! You summoned me with no command 😢.
            My options are:
            !hs compile \`glorious haskell code\`: runs the provided haskell code and returns the result
            !hs help: shows this menu

            More options coming soon! May you find peace and wisdom at the temple of Functional Programming!
        ```
    }
}
