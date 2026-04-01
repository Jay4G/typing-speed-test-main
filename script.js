let passages = [];
let currentPassage = "";

let difficulty = "easy";
let mode = "timed"; //"timed" | "passage"

let time = 0;
let timer = null; 
let isRunning = false;

let correctChars = 0;
let wrongChars = 0;
let totalTyped = 0;

const input = document.getElementById("input");
const passageEl = document.getElementById("passage");

const wpmEl = document.getElementById("wpm");
const accuracyEl = document.getElementById("accuracy");
const timeEl = document.getElementById("time");

const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");

const pbEl = document.getElementById("pBest");
const resultsEl = document.getElementById("results");

const finalWpm = document.getElementById("finalWpm");
const finalAccuracy = document.getElementById("finalAccuracy");
const correctCharsEl = document.getElementById("correctChars");
const wrongCharsEl = document.getElementById("wrongChars");

const timedModeBtn = document.getElementById("timedMode");
const passageModeBtn = document.getElementById("passageMode");

fetch("data.json")
    .then(res => res.json())
    .then(data => {
        passages = data;
    });

function getRandomPassage() {
    const list = passages[difficulty];
    const random = Math.floor(Math.random() * list.length);
    return list[random].text;
}

function renderPassage(text) {
    passageEl.innerHTML = "";

    text.split("").forEach(char => {
        const span = document.createElement("span");
        span.innerText = char;
        passageEl.appendChild(span);
    });
}

function startTest() {
  if (isRunning) return;

  currentPassage = getRandomPassage();
  renderPassage(currentPassage);

  resetState();

  input.disabled = false;
  input.value = "";
  input.focus();

  isRunning = true;

  startTimer();
}