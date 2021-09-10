const fs = require("fs");
const { dialog } = require("@electron/remote");

const filepaths = dialog.showOpenDialogSync({
  properties: ["openFile"],
});

const answerString = fs.readFileSync(filepaths[0], {
  encoding: "utf8",
  flag: "r",
});

let answers = [...answerString].map((x) => +x);
const totalQuestionsNum = answerString.length;

const questionContainer = document.querySelector(".question-container");
const statsBtn = document.querySelector(".overlay-btn");
const statsOverlay = document.querySelector(".overall-overlay");
const overall = statsOverlay.querySelector(".overall");

statsBtn.addEventListener("click", () => {
  statsOverlay.classList.toggle("hidden");
});

const asyncWait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const renderQuestion = function (questNum) {
  questionContainer.innerHTML = `
  <div class="question--title">
    <p>Question: ${questNum}</p>
  </div>
  <div class="question--answer-btn">
    <button id="A">1</button><button id="B">2</button id="C"><button>3</button><button id="D">4</button>
  </div>`;
};

const renderStatsInit = function () {
  answers.forEach((answer, index) => {
    overall.insertAdjacentHTML(
      "beforeend",
      `
      <div class="question-stat question-stat-${index + 1}" data-question-${
        index + 1
      }>
          <p>Question ${index + 1}: </p>
          <button style="margin-right:50px;">Go to this</button>
        </div>
    `
    );
  });
};

const gameHandler = function (currentQuestion) {
  const answerBtns = document.querySelectorAll(".question--answer-btn button");
  answerBtns.forEach((btn) => {
    btn.addEventListener("click", async function (event) {
      if (Number(btn.textContent) === answers[currentQuestion - 1]) {
        // RIGHT ANSWER
        document.querySelector(
          `.question-stat-${currentQuestion} p`
        ).innerHTML = `Question ${currentQuestion}: <span class="correct">CORRECT &nbsp&nbsp&nbsp${
          answers[currentQuestion - 1]
        }</span>`;

        btn.classList.add("green");
        await asyncWait(2000);
        // WRONG ANSWER
      } else {
        document.querySelector(
          `.question-stat-${currentQuestion} p`
        ).innerHTML = `Question ${currentQuestion}: <span class="wrong">Wrong ${Number(
          btn.textContent
        )} &nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp&nbsp</span><span class="correct">${
          answers[currentQuestion - 1]
        }</span>`;

        btn.classList.add("red");
        answerBtns[answers[currentQuestion - 1] - 1].classList.add("green");
        await asyncWait(2000);
      }

      //NEXT QUESTION
      if (currentQuestion < answers.length) {
        setCurrentQuestion(currentQuestion + 1);
      }
    });
  });
};

const setCurrentQuestion = function (num) {
  currentQuestion = num;
  renderQuestion(currentQuestion);
  gameHandler(currentQuestion);
};

const init = function () {
  renderStatsInit();
  let currentQuestion = 0;
  setCurrentQuestion(1);

  const gotoBtns = document.querySelectorAll(".question-stat button");
  gotoBtns.forEach((btn, index) => {
    btn.addEventListener("click", function (event) {
      setCurrentQuestion(index + 1);
      statsOverlay.classList.toggle("hidden");
    });
  });
};

init();
