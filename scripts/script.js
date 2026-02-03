const log = (msg) => console.log(msg);

// I denna fil skriver ni all er kod
log(new Date());

// On load sidan
window.addEventListener('load', () => {
    oGameData.init();
    prepGame();
});

// GlobalRef
const globalRef = {
    trainerName: document.querySelector('#nick'),
    trainerAge: document.querySelector('#age'),
    trainerBoy: document.querySelector('#boy'),
    trainerGirl: document.querySelector('#girl'),
    // trainerGender : document.querySelector('radio'),

    errorDisplay: document.querySelector('#errorMsg'),

    inputMenu: document.querySelector('#formWrapper'),

    gameField: document.querySelector('#gameField'),

    highScore: document.querySelector('.high-score'),
    highScoreText: document.querySelector('#winMsg'),
};

// Knapp listener
function prepGame() {
    document.querySelector('#submitBtn').addEventListener('click', (event) => {
        event.preventDefault();
        if (validateForm()) {
            initiateGame();
        }
    });
}

// InitiateGame
function initiateGame() {
    log('initiateGame()');
    log(oGameData.pokemonNumbers);
    document.querySelector('audio').play();
    oGameData.trainerName = globalRef.trainerName.value;
    oGameData.trainerAge = globalRef.trainerAge.value;
    if (globalRef.trainerBoy.checked) {
        oGameData.trainerGender = 'boy';
    } else if (globalRef.trainerGirl.checked) {
        oGameData.trainerGender = 'girl';
    }

    globalRef.inputMenu.classList.add('d-none');
    globalRef.gameField.classList.remove('d-none');
    //generatePokemon();
    generatePokemon();
    movePokemon();
    document.querySelector('#musicBtn').addEventListener('click', music);

    const pokemonList = document.querySelectorAll('img');

    oGameData.startTimeInMilliseconds();

    pokemonList.forEach((pokemon) => {
        pokemon.addEventListener('mouseenter', (pokemon) => {
            if (pokemon.target.dataset.caught) {
                releasePokemon(pokemon.target);
            } else if (!pokemon.target.dataset.caught) {
                catchPokemon(pokemon.target);
            }

            if (oGameData.nmbrOfCaughtPokemons === 10) {
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
            throw {
                msg: 'Namnet måste vara mellan 5-10 tecken',
                nodeRef: globalRef.trainerName,
            };
        } else if (age < 10 || age > 15 || isNaN(age)) {
            throw {
                msg: 'Du måste vara 10 till 15 år gammal',
                nodeRef: globalRef.trainerAge,
            };
        } else if (!boy.checked && !girl.checked) {
            throw {
                msg: 'Are you a boy or girl?',
                nodeRef: globalRef.trainerBoy,
            };
        }
        return true;
    } catch (error) {
        errorText.textContent = error.msg;
        error.nodeRef.focus();
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
function generatePokemon() {
    const pokemon = oGameData.pokemonNumbers;
    const field = globalRef.gameField;
    // log('in generatePokemon');
    // log(pokemon);
    // log(globalRef.pokemons);
    // log(oGameData.pokemonNumbers);
    while (pokemon.length < 10) {
        let chosenPokemonID = pokeIndexFix(Math.round(Math.random() * 151 + 1));
        if (!pokemon.some((p) => p.value === chosenPokemonID)) {
            pokemon.push({
                value: chosenPokemonID,
            });

            const imgRef = document.createElement('img');
            imgRef.id = chosenPokemonID;
            // imgRef.classList.remove('d-none')
            imgRef.src = `./assets/pokemons/${chosenPokemonID}.png`;
            field.appendChild(imgRef);
        }

        //Set Pokemons starting position
        const imgRefs = document.querySelectorAll('img');
        imgRefs.forEach((img) => {
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
    const imgRefs = document.querySelectorAll('img');
    log('In movePokemon' + imgRefs);
    setInterval(function () {
        imgRefs.forEach((img) => {
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
    pokemon.dataset.caught = '';
    log(oGameData.nmbrOfCaughtPokemons);
    log(pokemon.src);
}

// Game Over
function gameOver() {
    const pokemonsField = document.querySelectorAll('img');
    const highScore = globalRef.highScore;
    const highText = globalRef.highScoreText;
    pokemonsField.forEach((pokemon) => {
        pokemon.classList.add('d-none');
    });

    oGameData.endTimeInMilliseconds();
    log(oGameData.nmbrOfMilliseconds() + ' Time');

    highScore.classList.remove('d-none');
    highText.textContent = `${oGameData.trainerName}, ${oGameData.trainerAge} år, ${oGameData.trainerGender}, ${oGameData.nmbrOfMilliseconds()} ms`;

    storeHighScore();
    log(getSortedScore());
    displayHighScores(getSortedScore());

    document.querySelector('#playAgainBtn').addEventListener('click', restart);
}

// Highscore
function storeHighScore() {
    const trainer = {
        name: oGameData.trainerName,
        age: oGameData.trainerAge,
        gender: oGameData.trainerGender,
        time: oGameData.nmbrOfMilliseconds(),
    };
    const highscores = JSON.parse(localStorage.getItem('highscores')) || [];
    highscores.push(trainer);
    localStorage.setItem('highscores', JSON.stringify(highscores));
}

// Sort Highscore
function getSortedScore() {
    log('In getSortedScor');
    const highscores = JSON.parse(localStorage.getItem('highscores')) || [];
    highscores.sort((a, b) => a.time - b.time);
    if (highscores.length > 10) {
        return highscores.slice(0, 10);
    } else {
        return highscores;
    }
}

// Display/Create Highscore List
function displayHighScores(sortedScore) {
    const listRef = document.querySelector('#highscoreList');
    const list = sortedScore;
    log('In displayHighscore' + list);

    for (let i = 0; i < list.length; i++) {
        const itemRef = document.createElement('li');
        itemRef.classList.add('highScore-list__item');
        listRef.appendChild(itemRef);

        const textRef = document.createElement('p');
        textRef.classList.add('highscore-list__text');
        textRef.textContent = `${i + 1}. ${list[i].name}, ${list[i].age}, ${list[i].gender}, ${list[i].time} ms`;
        itemRef.append(textRef);
    }
}

//Restart game logic
function restart() {
    log('in restart');
    // const pokemonsField = document.querySelectorAll('img');

    // Display player input menu
    globalRef.inputMenu.classList.remove('d-none');

    // Hide gamefield and reset pokemons display
    globalRef.gameField.classList.add('d-none');

    const listRef = document.querySelector('#highscoreList');
    listRef.innerHTML = '';

    // Hide highscore
    globalRef.highScore.classList.add('d-none');

    oGameData.init();
}

function music() {
    if (document.querySelector('#musicBtn').dataset.mute) {
        document.querySelector('audio').play();
        document.querySelector('#musicBtn').innerHTML =
            '<i class="fa-solid fa-volume-high"></i>';
        document.querySelector('#musicBtn').dataset.mute = '';
    } else if (!document.querySelector('#musicBtn').dataset.mute) {
        document.querySelector('audio').pause();
        document.querySelector('#musicBtn').innerHTML =
            '<i class="fa-solid fa-volume-xmark"></i>';
        document.querySelector('#musicBtn').dataset.mute = true;
    }
}

// Jesper, 15 år, boy, 4590 ms

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
