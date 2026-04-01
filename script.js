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

function startTimer() {
  clearInterval(timer);

  timer = setInterval(() => {
    time++;

    timeEl.textContent = time;

    if (mode === "timed" && time >= 60) {
      endTest();
    }
  }, 1000);
}

input.addEventListener("input", () => {
  if (!isRunning) startTest();

  const typed = input.value;
  const spans = passageEl.querySelectorAll("span");

  correctChars = 0;
  wrongChars = 0;

  spans.forEach((span, index) => {
    const char = typed[index];

    if (char == null) {
      span.classList.remove("correct", "wrong");
    } 
    else if (char === span.innerText) {
      span.classList.add("correct");
      span.classList.remove("wrong");
      correctChars++;
    } 
    else {
      span.classList.add("wrong");
      span.classList.remove("correct");
      wrongChars++;
    }
  });

  totalTyped = typed.length;

  updateStats();

  if (typed === currentPassage) {
    endTest();
  }
});

function updateStats() {
  const minutes = time / 60 || 1;

  const wpm = Math.round((correctChars / 5) / minutes);
  const accuracy = totalTyped === 0
    ? 0
    : Math.round((correctChars / totalTyped) * 100);

  wpmEl.textContent = wpm;
  accuracyEl.textContent = accuracy + "%";
}

function resetState() {
  time = 0;
  correctChars = 0;
  wrongChars = 0;
  totalTyped = 0;

  timeEl.textContent = 0;
  wpmEl.textContent = 0;
  accuracyEl.textContent = "0%";

  clearInterval(timer);
}

function endTest() {
  isRunning = false;
  clearInterval(timer);

  input.disabled = true;

  const finalWpmValue = parseInt(wpmEl.textContent);

  finalWpm.textContent = finalWpmValue;
  finalAccuracy.textContent = accuracyEl.textContent;
  correctCharsEl.textContent = correctChars;
  wrongCharsEl.textContent = wrongChars;

  handlePersonalBest(finalWpmValue);

  resultsEl.classList.remove("hidden");
}

function handlePersonalBest(wpm) {
  const saved = localStorage.getItem("pBest");

  if (!saved) {
    localStorage.setItem("pBest", wpm);
    pbEl.textContent = wpm;
    alert("Baseline Established!");
    return;
  }

  if (wpm > saved) {
    localStorage.setItem("pBest", wpm);
    pbEl.textContent = wpm;

    alert("High Score Smashed!");
    triggerConfetti();
  } else {
    pbEl.textContent = saved;
  }
}