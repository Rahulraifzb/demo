const option_list = document.querySelector(".option_list");
const next_btn = document.querySelector(".next_btn");
const prev_btn = document.querySelector(".prev_btn");
const quiz_box = document.querySelector(".quiz-box");
const result_box = document.querySelector(".quiz-result");

const timeCount = quiz_box.querySelector(".timer .timer_sec");
const timeOff = quiz_box.querySelector(".timer .time_text");

const applicationQuiz = document.querySelector(".application-quiz");

var questions = [];
let que_count = 0;
let que_num = 1;
let userScore = 0;
let widthValue = 1;

if (quizId) {
  fetch(`/quiz-questions/${quizId}`)
    .then((res) => res.json())
    .then((data) => {
      window.scrollTo(0, 600);
      questions = [...data.questions];
      showQuestions(que_count);
      queCounter(que_num);
      startTimer();
    })
    .catch((error) => console.log(error));
}

let tickIcon = `<div class="icon tick"><i class="fas fa-check"></i></div>`;
let crossIcon = `<div class="icon cross"><i class="fas fa-times"></i></div>`;


function showQuestions(index) {
  const que_text = document.querySelector(".que_text");

  let que_tag =
    "<h4>" +
    questions[index].number +
    "." +
    questions[index].question +
    "</h4>";
  let option_tag = "";
  for (var i = 0; i < questions[index].options.length; i++) {
    option_tag += `<div class="option d-flex justify-content-between px-2 py-2 mb-2 border rounded border-info" onclick="optionSelected(this)" data-value="${index}" data-option="${i}"><span>` + 
        questions[index].options[i].option   + `</span></div>`;
  }

  que_text.innerHTML = que_tag;
  option_list.innerHTML = option_tag;

  if (que_count > 0) {
    prev_btn.classList.remove("d-none");
  } else {
    prev_btn.classList.add("d-none");
  }
}


next_btn.onclick = () => {
  console.log(que_count);
  if (que_count < questions.length - 1) {
    que_count++;
    que_num++;
    showQuestions(que_count);
    handlePagination(que_count);
    queCounter(que_count + 1);
  } else {
    showResult();
  }
  const optionSelected = questions[que_count].options.find(
    (option) => option.is_checked
  );
  console.log(optionSelected);
  if (optionSelected) {
    next_btn.classList.remove("d-none");
  } else {
    next_btn.classList.add("d-none");
  }
};

prev_btn.onclick = () => {
  if (que_count > 0) {
    que_count--;
    que_num--;
    showQuestions(que_count);
    handlePagination(que_count);
    queCounter(que_num);
  } else {
    console.log("no prevoius quiz");
  }
};

function showResult() {
  quiz_box.classList.add("d-none");
  result_box.classList.remove("d-none");

  const scoreText = result_box.querySelector(".score_text");
  if (userScore > 3) {
    let scoreTag = `<p>and congrates😎,You got <span>${userScore}</span> out of <span>${questions.length}</span></p>`;
    scoreText.innerHTML = scoreTag;
  } else if (userScore > 1) {
    let scoreTag = `<p>and nice😟,You got <span>${userScore}</span> out of <span>${questions.length}</span></p>`;
    scoreText.innerHTML = scoreTag;
  } else {
    let scoreTag = `<p>and sorry🥴,You got only <span>${userScore}</span> out of <span>${questions.length}</span></p>`;
    scoreText.innerHTML = scoreTag;
  }
}

function optionSelected(answer) {
  const user_answer = questions[que_count].options[answer.dataset.option].option
  const selected_answer = questions[que_count].options[answer.dataset.option].id;
  const correct_answer = questions[que_count].answer;

  console.log(" hello: ", selected_answer,correct_answer)

  if (user_answer == correct_answer) {
    userScore += 1;
    answer.classList.add("correct");
    console.log("Answer is correct");
    answer.insertAdjacentHTML("beforeend", tickIcon);
  } else {
    answer.classList.add("incorrect");
    console.error("Answer is wrong");
    answer.insertAdjacentHTML("beforeend", crossIcon);
  }

  questions[que_count].options[answer.dataset.option]["is_checked"] = true;

  // once user selcted disabled all options
  for (let i = 0; i < questions[que_count].options.length; i++) {
    option_list.children[i].classList.add("disabled");
  }

  next_btn.classList.remove("d-none");
  saveAnswer(selected_answer, quizEnrolled);
}

function handlePagination(que_count) {
  questions[que_count].options.map((option, index) => {
    if (option.is_checked === true) {
      const selectedOption = option_list.children[index];
      if (option.option === questions[que_count].answer) {
        selectedOption.classList.add("correct");
        selectedOption.insertAdjacentHTML("beforeend", tickIcon);
      } else {
        selectedOption.classList.add("incorrect");
        console.error("Answer is wrong");
        selectedOption.insertAdjacentHTML("beforeend", crossIcon);
      }
      next_btn.classList.remove("d-none");
      for (var i = 0; i < option_list.children.length; i++) {
        option_list.children[i].classList.add("disabled");
      }
    } else {
      console.log("no option selcted");
      // option_list.children[index].classList.add("disabled")
    }
  });
}

function queCounter(index) {
  const button_ques_counter = document.querySelector(".total_que");
  let totalQuesCountTag = `<p><span>${index} </span>of <span>${questions.length} </span>Questions</p>`;
  button_ques_counter.innerHTML = totalQuesCountTag;
}

function saveAnswer(answer, quizEnrolled) {
  fetch("/save-answer/", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      answer: answer,
      quizEnrolled: quizEnrolled,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      next_btn.classList.remove("d-none");
    })
    .catch((error) => console.log(error));
}

function startTimer() {
  var c = 180;

  x = setInterval(function () {
    var minutes = parseInt(c / 60) % 60;
    var seconds = c % 60;

    timeCount.textContent = `${minutes}m:${seconds}s`;
    c -= 1;

    if (minutes < 9 && seconds < 9) {
      timeCount.textContent = `0${minutes}m:0${seconds}s`;
    } else if (minutes < 9) {
      timeCount.textContent = `0${minutes}m:${seconds}s`;
    } else if (seconds < 9) {
      timeCount.textContent = `${minutes}m:0${seconds}s`;
    }

    if (c < 0) {
      clearInterval(x);
      timeCount.textContent = "00";
      timeOff.textContent = "Time off";
      showResult();
    }
  }, 1000);
}
