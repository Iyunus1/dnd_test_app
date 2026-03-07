
// d4, d6, d8, d10, d12, d20, d100

    const ROLL_STATES = {
        NORMAL: 'normal',
        ADVANTAGE: 'advantage',
        DISADVANTAGE: 'disadvantage'
    }


// Rolls multiple dices as a base dice
function rollDice(numOfDice, diceType){
    
    const VALID_DICE = [4, 6, 8, 10, 12, 20, 100]

    if(!VALID_DICE.includes(diceType)){
        throw new console.error(`Invalud dice type: d${diceType}`);
    }

    let randomRolls = [];
    if(VALID_DICE.includes(diceType)){
        for(let i = 0; i < numOfDice; i++){
            randomRolls.push(Math.floor(Math.random() * diceType) + 1)
        }
    }
    
    
    return {
        rolls: randomRolls,
        total: randomRolls.reduce((accum, currentVal) => accum + currentVal, 0),
        diceType: `d${diceType}`,
        numOfDice: randomRolls.length,
    }
    // Need to return an object with the rolls number, the total of the rolls, dice type used, number of dice used
}

function rollD20(rollState = ROLL_STATES.NORMAL){

    const numDice = rollState === ROLL_STATES.NORMAL ? 1 : 2;
    const diceRoll = rollDice(numDice, 20)

    let keptRoll = 0;
    let discardedRoll = null;

    if (rollState === ROLL_STATES.ADVANTAGE){
        keptRoll = Math.max(...diceRoll.rolls)
        discardedRoll = Math.min(...diceRoll.rolls)
    } else if(rollState === ROLL_STATES.DISADVANTAGE){
        keptRoll =  Math.min(...diceRoll.rolls)
        discardedRoll = Math.max(...diceRoll.rolls)
    } else if(rollState === ROLL_STATES.NORMAL){
        keptRoll = diceRoll.rolls[0]
    }
    
    return{
        kept: keptRoll,
        discarded: discardedRoll
    }
}

// Static modifier only adds numbers to the total
const calculateDiceSum = (d20Result, staticModifier, rollModifier) => {


    console.log(d20Result, staticModifier, rollModifier)
    return d20Result + staticModifier + rollModifier
}

const result = rollDice(5, 8, 0);
const testAdvantage = rollD20(ROLL_STATES.ADVANTAGE);
const total = calculateDiceSum(rollD20(ROLL_STATES.NORMAL).kept, 5, rollDice(1, 4).total) // No Advantage, strength +3, 1d4 bless dice

console.log(total)
console.log(result)

// Output
// Player rolled 2d6
// Roll 1: X
// Roll 2: Y
// Total: Z