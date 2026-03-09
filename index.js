// Advantage, Disadvantage, normal d20s
const ROLL_STATES = {
        NORMAL: 'normal',
        ADVANTAGE: 'advantage',
        DISADVANTAGE: 'disadvantage'
    }

// Bless, Bane, Guidance, Bardic Inspiration
const SPELL_MODIFIERS = {
    bless: { diceCount: 1, diceType: 4, sign: 1 },     // Positive 1d4
    bane:  { diceCount: 1, diceType: 4, sign: -1 },    // Negative 1d4
    guidance: { diceCount: 1, diceType: 4, sign: 1 },  // Positive 1d4
    bardic_d6: { diceCount: 1, diceType: 6, sign: 1 }  // Positive 1d6
};

// Rolls multiple dices as a base dice
function rollDice(numOfDice, diceType){
    
    const VALID_DICE = [4, 6, 8, 10, 12, 20, 100]

    if(!VALID_DICE.includes(diceType)){
        throw new Error(`Invalud dice type: d${diceType}`);
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
    
    let isCrit = keptRoll === 20;
    let isMiss = keptRoll === 1;

    return{
        kept: keptRoll,
        discarded: discardedRoll,
        isCrit: isCrit,
        isMiss: isMiss
    }
}

// Static modifier only adds numbers to the total
const calculateDiceSum = (d20Result, staticModifier, rollModifier = null) => {
    // modSpellRoll = rollDice(1, 4) e.g bless
    let modSpellRoll = 0;

    if(rollModifier !== null && SPELL_MODIFIERS[rollModifier.toLowerCase()]){
        const spellModifyRoll = SPELL_MODIFIERS[rollModifier.toLowerCase()]
        modSpellRoll = rollDice(spellModifyRoll.diceCount, spellModifyRoll.diceType).total * spellModifyRoll.sign;
    }

    return{
        D20Roll: d20Result.kept,
        StaticMod: staticModifier,
        bonusRoll: modSpellRoll,
        isCriticalHit: d20Result.isCrit,
        isCriticalMiss: d20Result.isMiss,
        total: d20Result.kept + staticModifier + modSpellRoll
    }  
}

const result = rollDice(5, 8);
const testAdvantage = rollD20(ROLL_STATES.ADVANTAGE);
const total = calculateDiceSum(rollD20(ROLL_STATES.NORMAL), 5, "bless") // No Advantage, strength +3, 1d4 bless dice

console.log(total)
console.log(result)
console.log(testAdvantage)

// Output
// Player rolled 2d6
// Roll 1: X
// Roll 2: Y
// Total: Z