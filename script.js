// Function to initialize the game when the DOM content is loaded
document.addEventListener("DOMContentLoaded", function() {
    const startScreen = document.getElementById("start-screen");
    const gameScreen = document.getElementById("game-screen");
    const startButton = document.getElementById("start-button");
    const restartButton = document.getElementById("restart-button");
    const submitButton = document.getElementById("submit-guess");
    const feedbackDiv = document.getElementById("feedback");
    const codeLengthSelect = document.getElementById("code-length");
    const allowDuplicatesSelect = document.getElementById("allow-duplicates");
    const digitsContainer = document.getElementById("digits-container");
    const backspaceButton = document.getElementById("backspace");
    const previousTriesDiv = document.getElementById("previous-tries");
    const triesRemainingDiv = document.getElementById("tries-remaining");

    // Declare variables to store initial game state
    let codeLength;
    let allowDuplicates;
    let secretCode;
    let tries = 0;
    let maxTries = 10;
    let triesFeedback = [];
    let guessBoxes = [];

    // Declare variables to store game state
    startButton.addEventListener("click", function() {
        codeLength = parseInt(codeLengthSelect.value);
        allowDuplicates = allowDuplicatesSelect.value;
        startScreen.style.display = "none";
        gameScreen.style.display = "block";
        initializeGame();
    });

    // Event listener for the restart button click
    restartButton.addEventListener("click", function() {
        startScreen.style.display = "block";
        gameScreen.style.display = "none";
    });

    // Function to initialize the guess boxes for entering digits
    function initializeGuessBoxes() {
        const guessContainer = document.getElementById("guess-container");
        guessContainer.innerHTML = '';
        guessBoxes = [];
        for (let i = 0; i < codeLength; i++) {
            const guessBox = document.createElement('div');
            guessBox.classList.add('guess-box');
            guessBoxes.push(guessBox);
            guessContainer.appendChild(guessBox);
        }
    }

    // Event listener for clicking on digits or backspace button
    digitsContainer.addEventListener("click", function(event) {
        const target = event.target;
        if (target.classList.contains("digit")) {
            const nextEmptyBoxIndex = getEmptyBoxIndex();
            if (nextEmptyBoxIndex !== -1) {
                guessBoxes[nextEmptyBoxIndex].textContent = target.textContent;
            }
        } else if (target.id === "backspace") {
            const lastFilledBoxIndex = getLastFilledBoxIndex();
            if (lastFilledBoxIndex !== -1) {
                guessBoxes[lastFilledBoxIndex].textContent = '';
            }
        }
    });

    // Function to get index of the next empty guess box
    function getEmptyBoxIndex() {
        for (let i = 0; i < guessBoxes.length; i++) {
            if (guessBoxes[i].textContent === '') {
                return i;
            }
        }
        return -1;
    }

    // Function to get index of the last filled guess box
    function getLastFilledBoxIndex() {
        for (let i = guessBoxes.length - 1; i >= 0; i--) {
            if (guessBoxes[i].textContent !== '') {
                return i;
            }
        }
        return -1;
    }

    // Function to get the current guess from the guess boxes
    function getGuess() {
        const guess = [];
        guessBoxes.forEach(box => {
            const digit = box.textContent.trim();
            if (digit !== '') {
                guess.push(parseInt(digit));
            }
        });
        return guess;
    }

    // Event listener for submitting the guess
    submitButton.addEventListener("click", function() {
        const guess = getGuess();
        if (guess.length !== codeLength) {
            alert("Please enter " + codeLength + " digits.");
            return;
        }
        tries++;
        const feedback = checkGuess(guess);
        triesFeedback.push({ guess, feedback });
        updateFeedback(feedback);
        updatePreviousTries();
        updateTriesRemaining();
        if (feedback.exactMatches === codeLength) {
            endGame(true);
        } else if (tries === maxTries) {
            endGame(false);
        } else {
            clearGuess();
            initializeGuessBoxes();
        }
    });

    // Function to clear the current guess
    function clearGuess() {
        guessBoxes.forEach(box => box.textContent = '');
    }

    // Function to initialize the game state
     function initializeGame() {
        tries = 0;
        triesFeedback = [];
        clearGuess();
        updateFeedback(); // Reset feedback display
        updatePreviousTries(); // Reset previous tries display
        updateTriesRemaining(); // Reset tries remaining display
        digitsContainer.style.display = "flex"; // Show digits container
        submitButton.disabled = false; // Enable submit button
        secretCode = generateRandomCode(); // Generate new secret code
        initializeGuessBoxes(); // Reset guess boxes
    }
  
    // Function to generate a random secret code
    function generateRandomCode() {
        let numbers = [];
        for (let i = 0; i < 10; i++) {
            numbers.push(i);
        }
        let code = [];
        if (allowDuplicates === "YES") {
            for (let i = 0; i < codeLength; i++) {
                code.push(numbers[Math.floor(Math.random() * numbers.length)]);
            }
        } else {
            for (let i = 0; i < codeLength; i++) {
                const index = Math.floor(Math.random() * numbers.length);
                code.push(numbers[index]);
                numbers.splice(index, 1);
            }
        }
        return code;
    }

    // Function to check the guess against the secret code
    function checkGuess(guess) {
        let exactMatches = 0;
        let digitMatches = 0;
        const secretCodeCopy = [...secretCode];
        const guessCopy = [...guess];

        for (let i = 0; i < codeLength; i++) {
            if (guess[i] === secretCode[i]) {
                exactMatches++;
                secretCodeCopy[i] = null;
                guessCopy[i] = null;
            }
        }

        for (let i = 0; i < codeLength; i++) {
            if (guessCopy[i] !== null && secretCodeCopy.includes(guessCopy[i])) {
                digitMatches++;
                const index = secretCodeCopy.indexOf(guessCopy[i]);
                secretCodeCopy[index] = null;
                guessCopy[i] = null;
            }
        }

        return { exactMatches, digitMatches };
    }

    // Function to update the feedback display
    function updateFeedback(feedback) {
        feedbackDiv.innerHTML = ''; // Clear any existing content
    }
        
    // Function to update the previous tries display
    function updatePreviousTries() {
        previousTriesDiv.innerHTML = ''; // Clear previous tries
    
        triesFeedback.slice().reverse().forEach((tryFeedback, index) => {
            const tryDiv = document.createElement('div');
            tryDiv.classList.add('try-container');
            
            const tryText = document.createElement('div');
            tryText.textContent = `Try ${triesFeedback.length - index}: ${tryFeedback.guess.join('')}`;
            tryText.classList.add('try-text');
            tryDiv.appendChild(tryText);
    
            const feedbackDiv = document.createElement('div');
            feedbackDiv.classList.add('feedback');
    
            // Create circles for exact matches
            for (let i = 0; i < tryFeedback.feedback.exactMatches; i++) {
                const circle = document.createElement('div');
                circle.classList.add('circle');
                circle.classList.add('green-circle');
                feedbackDiv.appendChild(circle);
            }
    
            // Create circles for matches in wrong position
            for (let i = 0; i < tryFeedback.feedback.digitMatches; i++) {
                const circle = document.createElement('div');
                circle.classList.add('circle');
                circle.classList.add('yellow-circle');
                feedbackDiv.appendChild(circle);
            }
    
            // Create circles for no matches
            const noMatches = codeLength - tryFeedback.feedback.exactMatches - tryFeedback.feedback.digitMatches;
            for (let i = 0; i < noMatches; i++) {
                const circle = document.createElement('div');
                circle.classList.add('circle');
                circle.classList.add('black-circle');
                feedbackDiv.appendChild(circle);
            }
    
            tryDiv.appendChild(feedbackDiv);
            previousTriesDiv.appendChild(tryDiv);
        });
    }

    // Function to update the remaining tries display
    function updateTriesRemaining() {
        const remaining = maxTries - tries;
        triesRemainingDiv.textContent = `Tries remaining: ${remaining}`;
    }

    // Function to handle the end of the game
    function endGame(won) {
        if (won) {
            feedbackDiv.textContent = "Congratulations! You guessed it right, the pattern was " + secretCode.join("");
        } else {
            feedbackDiv.textContent = "Sorry, you didn't get it. The pattern was " + secretCode.join("");
        }
        restartButton.style.display = "block";
        digitsContainer.style.display = "none";
        submitButton.disabled = true;
    }
});