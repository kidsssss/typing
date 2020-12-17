const textDisplay = document.getElementById("text-display");
const textInput = document.getElementById("text-input");
const rightSide = document.getElementById("right-side");
const redoBtn = document.getElementById("redo-btn");
const wordCount = document.getElementById("word-count");

let currentWord = 0;
let correctChars = 0;
let start = 0;
let wordsToDisplay = [];
let mode = "words";
let numOfWords = 25;

// Get Words
function getWords(amount) {
  clearAll();
  for (let i = 0; i < amount; i++) {
    let randomWord = words[Math.floor(Math.random() * words.length)];
    if (i > 0) {
      while (randomWord === wordsToDisplay[i - 1]) {
        randomWord = words[Math.floor(Math.random() * words.length)];
      }
    }
    wordsToDisplay.push(randomWord);
  }
  console.log(wordsToDisplay);
  displayWords();
}

// Display Words
function displayWords() {
  wordsToDisplay.forEach((word, index) => {
    if (index === 0) {
      textDisplay.innerHTML += `<span class='highlight'>${word} </span>`;
    } else {
      textDisplay.innerHTML += `<span>${word} </span>`;
    }
  });
}

function clearAll() {
  textDisplay.innerText = "";
  textInput.value = "";
  currentWord = 0;
  correctChars = 0;
  start = 0;
  wordsToDisplay = [];
  textInput.focus();
  textInput.className = "";
}

//  Show Result function
function showResult() {
  let totalTime = (Date.now() - start) / 1000 / 60;
  let totalChars = 0;
  wordsToDisplay.forEach((word) => {
    totalChars += word.length + 1;
  });
  console.log(totalTime);
  let acc = Math.floor((correctChars / totalChars) * 100);
  let wpm = Math.floor(correctChars / 5 / totalTime);

  rightSide.innerHTML = `wpm: <span class="chosen">${wpm}</span> / acc: <span class="chosen">${acc}</span> / time: <span class="chosen">${Math.floor(
    totalTime * 60
  )}</span>`;
  textInput.value = "Press Tab + Enter to redo...";
}

//Event Listeners
//Key pressed on input
textInput.addEventListener("keydown", (e) => {
  //Add wrong-input class to textInput when pressed the wrong key
  if ((e.key >= "a" && e.key <= "z") || e.key === "'") {
    let inputWordSlice = textInput.value + e.key;
    let currentWordSlice = wordsToDisplay[currentWord].slice(
      0,
      inputWordSlice.length
    );
    if (inputWordSlice !== currentWordSlice) {
      textInput.className = "wrong-input";
    }
  } else if (e.key === "Backspace") {
    let inputWordSlice = textInput.value.slice(0, textInput.value.length - 1);
    if (textInput.value.length === 1) {
      textInput.value = "";
    }
    let currentWordSlice = wordsToDisplay[currentWord].slice(
      0,
      inputWordSlice.length
    );
    if (inputWordSlice !== currentWordSlice) {
      textInput.className = "wrong-input";
    } else {
      textInput.className = "";
    }
  } else if (e.key === " ") {
    textInput.className = "";
  }

  //First Character Press
  if (currentWord === 0 && textInput.value === "") {
    start = Date.now();
  }

  //Space pressed then check if correct or not
  //If not the last word
  if (e.key === " ") {
    e.preventDefault();
    if (textInput.value !== "") {
      //if not last word
      if (currentWord < wordsToDisplay.length - 1) {
        if (textInput.value === wordsToDisplay[currentWord]) {
          textDisplay.childNodes[currentWord].className = "correct";
          correctChars += wordsToDisplay[currentWord].length + 1;
        } else {
          textDisplay.childNodes[currentWord].className = "wrong";
        }
        textDisplay.childNodes[currentWord + 1].className = "highlight";
      }
      //if is last word but incorrect
      else if (currentWord === wordsToDisplay.length - 1) {
        textDisplay.childNodes[currentWord].className = "wrong";
        showResult();
      }
      textInput.value = "";
      currentWord++;
    }
  }
  // if is last word and it is correct
  else if (currentWord === wordsToDisplay.length - 1) {
    if (textInput.value + e.key === wordsToDisplay[currentWord]) {
      textDisplay.childNodes[currentWord].className = "correct";
      correctChars += wordsToDisplay[currentWord].length + 1;
      currentWord++;
      setTimeout(() => {
        showResult();
      }, 50);
    }
  }
});

//redo btn event listener
redoBtn.addEventListener("click", () => {
  getWords(numOfWords);
});

// Choose number of words to display
wordCount.addEventListener("click", (e) => {
  if (e.target.tagName === "SPAN") {
    numOfWords = parseInt(e.target.innerText);
    e.target.parentNode.childNodes.forEach((child) => {
      child.className = "";
    });
    e.target.className = "chosen";
    getWords(numOfWords);
  }
});
getWords(numOfWords);
