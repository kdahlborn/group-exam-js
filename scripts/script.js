const log = (msg) => console.log(msg);

// I denna fil skriver ni all er kod
log(new Date());

// On load sidan
window.addEventListener('load', () => {
    oGameData.init;
	prepGame();
});

// GlobalRef
const globalRef = {
    trainerName : document.querySelector('#nick'),
    trainerAge : document.querySelector('#age'),
    trainerBoy : document.querySelector('#boy'),
    trainerGirl : document.querySelector('#girl'),
    // trainerGender : document.querySelector('radio'),

    errorDisplay : document.querySelector('#errorMsg'),

    inputMenu : document.querySelector('#formWrapper'),

    gameField : document.querySelector('#gameField'),

    pokemons : oGameData.pokemonNumbers,

    highScore : document.querySelector('.high-score'),
    highScoreText : document.querySelector('#winMsg')
}

// Knapp listener
function prepGame() {
    document.querySelector('#submitBtn').addEventListener('click', (event) => {
        event.preventDefault();
        if(validateForm()) {
            initiateGame();
        }
    });
}

// InitiateGame
function initiateGame() {
    log('initiateGame()');

    oGameData.trainerName = globalRef.trainerName.value;
    oGameData.trainerAge = globalRef.trainerAge.value;
    if(globalRef.trainerBoy.checked) {
        oGameData.trainerGender = 'boy';
    } else if (globalRef.trainerGirl.checked) {
        oGameData.trainerGender = 'girl';
    } 

    globalRef.inputMenu.classList.add('d-none');
    globalRef.gameField.classList.remove('d-none');
    //genereatePokemon();
    genereatePokemon();
    log(globalRef.pokemons);
    movePokemon();

    const pokemonList = document.querySelectorAll('img');

    oGameData.startTimeInMilliseconds();

    pokemonList.forEach(pokemon => { 
        pokemon.addEventListener('mouseenter', (pokemon) => {
            if(pokemon.target.dataset.caught) {
                releasePokemon(pokemon.target);
            } else if (!pokemon.target.dataset.caught) {
                catchPokemon(pokemon.target);
            }
            
            if(oGameData.nmbrOfCaughtPokemons === 1) {
                gameOver();
            }
        });
    });
}

// Validering
function validateForm() {
    const name = globalRef.trainerName.value.length;
    const age = globalRef.trainerAge.value;
    const boy = globalRef.trainerBoy;
    const girl = globalRef.trainerGirl;
    const errorText = globalRef.errorDisplay;

    try {       
        if (name < 5 || name > 10) {
            throw({ msg: 'Namnet måste vara mellan 5-10 tecken', nodeRef : globalRef.trainerName});
        } else if (age < 10 || age > 15 || isNaN(age)) {
            throw({ msg : 'Du måste vara 10 till 15 år gammal', nodeRef : globalRef.trainerAge });
        } else if (!boy.checked && !girl.checked) {
            throw({ msg: 'Are you a boy or girl?', nodeRef : globalRef.trainerBoy});
        }
        return true;
    } catch (error) {
        errorText.textContent = error.msg;
        error.nodeRef.focus()
        return false;
    }
}

// Pokemon index fix
function pokeIndexFix(id) {
    let indexString = '';

    if (id < 10) indexString = `00${id}`;
    else if (id >= 10 && id < 100) indexString = `0${id}`;
    else indexString = `${id}`;

    return indexString;
}

// Generate Pokemon
function genereatePokemon() {
    const pokemon = globalRef.pokemons;
    const field = globalRef.gameField;

    while (pokemon.length < 10) {
        let chosenPokemonID = pokeIndexFix(Math.round(Math.random() * 151 + 1));
        if(!pokemon.some(p => p.value === chosenPokemonID)) {
            pokemon.push({
            value: chosenPokemonID,
            });

            const imgRef = document.createElement('img');
            imgRef.id = chosenPokemonID;
            imgRef.src = `./assets/pokemons/${chosenPokemonID}.png`;
            field.appendChild(imgRef);
        }

        //Set Pokemons starting position
        const imgRefs = document.querySelectorAll('img');
        imgRefs.forEach(img => {
            // log('imgRef forEach');
            // log(oGameData.getLeftPosition());
            // log(oGameData.getTopPosition());
            img.style.top = `${oGameData.getTopPosition()}px`;
            img.style.left = `${oGameData.getLeftPosition()}px`;
        });
    }
}

// Move Pokemon
function movePokemon() {
    // const pokemons = globalRef.pokemons;
    const imgRefs = document.querySelectorAll('img');
    log(imgRefs);
    setInterval(function () {
        imgRefs.forEach(img => {
            // log('imgRef forEach');
            // log(oGameData.getLeftPosition());
            // log(oGameData.getTopPosition());
            img.style.top = `${oGameData.getTopPosition()}px`;
            img.style.left = `${oGameData.getLeftPosition()}px`;
        });
    }, 3000);
}

// Catch Pokemon
function catchPokemon(pokemon) {
    log('in catchPokemon');
    log(pokemon);
    pokemon.src = './assets/ball.webp';
    oGameData.nmbrOfCaughtPokemons++;
    pokemon.dataset.caught = true;
    log(oGameData.nmbrOfCaughtPokemons);
    log(pokemon);
}

// Release Pokemon
function releasePokemon(pokemon) {
    log('in releasePokemon');
    log(pokemon.src);
    pokemon.src = `./assets/pokemons/${pokemon.id}.png`;
    oGameData.nmbrOfCaughtPokemons--;
    pokemon.dataset.caught = false;
    log(oGameData.nmbrOfCaughtPokemons);
    log(pokemon.src);
}

// Game Over
function gameOver() {
    const pokemonsField = document.querySelectorAll('img');
    const highScore = globalRef.highScore;
    const highText = globalRef.highScoreText;
    pokemonsField.forEach(pokemon => {
        pokemon.classList.add('d-none');
    });

    oGameData.endTimeInMilliseconds();
    log(oGameData.nmbrOfMilliseconds() + ' Time');

    highScore.classList.remove('d-none');
    highText.textContent = `${oGameData.trainerName}, ${oGameData.trainerAge} år, ${oGameData.trainerGender}, ${oGameData.nmbrOfMilliseconds()} ms`;

    // 3. Jesper, 15 år, boy, 4590 ms
}

//function timer(seconds) {
//     console.log('In timer()');
//     clearInterval(oGameData.timerId);
//     if (oGameData.timerEnabled) {
//         oGameData.timeRef.textContent = seconds;
//         oGameData.timerId = setInterval(function () {
//             console.log(oGameData.timerId+ ' oGameData timerID');
//             console.log(seconds+' second(s)');
//             seconds--;
//             oGameData.timeRef.textContent = seconds;
//             if (seconds <= 0) {
//                 clearInterval(oGameData.timerId);
//                 changePlayer();
//             }
//         }, 1000); 
//     }
// }

// Skapar 2 lika kort
    // for (let i = 1; i <= 8; i++) {
    //     deck.push({
    //         value: i,
    //         imageURL: `./images/${i}.jpg`,
    //     });
    //     deck.push({
    //         value: i,
    //         imageURL: `./images/${i}.jpg`,
    //     });
    // }

//     function getIndexString(id) {
//     let indexString = '';

//     if (id < 10) indexString = `#00${id}`;
//     else if (id >= 10 && id < 100) indexString = `#0${id}`;
//     else indexString = `#${id}`;

//     return indexString;
// }