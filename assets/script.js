//store question text, options and answers in an array
const questions = [
  {
    question: "When an operator’s value is NULL, the typeof returned by the unary operator is:",
    options: ["1. Object", "2. Booleans", "3. Undefined", "4. Integer"],
    answer: "1. Object",
  },
  {
    question: "Arrays in JavaScript can be used to store ______.",
    options: [
      "1. Numbers and Strings",
      "2. Other Arrays",
      "3. Booleans",
      "4. All of the above",
    ],
    answer: "4. All of the above",
  },
  {
    question: "Commonly used data types DO NOT include:",
    options: ["1. Strings", "2. Booleans", "3. Alerts", "4. Numbers"],
    answer: "3. Alerts",
  },
  {
    question:
      "String values must be enclosed within _____ when being assigned to variables.",
    options: ["1. Commas", "2. Curly brackets", "3. Quotes", "4. Parentheses"],
    answer: "3. Quotes",
  },
  {
    question:
      "Which of the following methods is used to access HTML elements using Javascript?",
    options: [
      "1. getElementbyId()",
      "2. getElementbyClassName",
      "3. Both A and B",
      "4. None of the above",
    ],
    answer: "3. Both A and B",
  },
  {
    question:
      "Which of the following is a statement that can be used to terminate a loop, switch or label statement?",
    options: ["1. Break", "2. Stop", "3. Halt", "4. Exit"],
    answer: "1. Break",
  },
  {
    question:
      "What will be the output of the following code snippet? print(typeof(NaN));",
    options: ["1. Object", "2. Number", "3. String", "4. None of the above"],
    answer: "2. Number",
  },
];
  
  //Selecting each card div by ID and assigning to variables
  const startCard = document.querySelector("#start-card");
  const questionCard = document.querySelector("#question-card");
  const scoreCard = document.querySelector("#score-card");
  const scoreboardCard = document.querySelector("#scoreboard-card");
  
  //Hiding all cards
  function hideCards() {
    startCard.setAttribute("hidden", true);
    questionCard.setAttribute("hidden", true);
    scoreCard.setAttribute("hidden", true);
    scoreboardCard.setAttribute("hidden", true);
  }
  
  const resultDiv = document.querySelector("#result-div");
  const resultText = document.querySelector("#result-text");
  
  //hiding result div
  function hideResultText() {
    resultDiv.style.display = "none";
  }
  
  //Variables decleration which are required globally
  var intervalID;
  var time;
  var currentQuestion;
  
  document.querySelector("#start-button").addEventListener("click", startQuiz);
  
  function startQuiz() {
    //Hide all visible cards if there is any and show the question card
    hideCards();
    questionCard.removeAttribute("hidden");
  
    //Assigning 0 to currentQuestion when start button is clicked, and then displaying the current question on the page
    currentQuestion = 0;
    displayQuestion();
  
    //Setting total time based on the number of questions
    time = questions.length * 10;
  
    //Executing function "countdown" every 1000ms for updating time and displaying on page
    intervalID = setInterval(countdown, 1000);
  
    //Invoking displayTime here to ensure time appears on the page as soon as the start button is clicked, not after 1 second
    displayTime();
  }
  
 //Decreasing time by 1 and displaying new value, if time runs out then end quiz
  function countdown() {
    time--;
    displayTime();
    if (time < 1) {
      endQuiz();
    }
  }
  
  //Displaying time on page
  const timeDisplay = document.querySelector("#time");
  function displayTime() {
    timeDisplay.textContent = time;
  }
  
  //Displaying the question and answer options for the current question
  function displayQuestion() {
    let question = questions[currentQuestion];
    let options = question.options;
  
    let h2QuestionElement = document.querySelector("#question-text");
    h2QuestionElement.textContent = question.question;
  
    for (let i = 0; i < options.length; i++) {
      let option = options[i];
      let optionButton = document.querySelector("#option" + i);
      optionButton.textContent = option;
    }
  }
  
  //When an answer button is clicked: click event bubbles up to div with id "quiz-options"
  document.querySelector("#quiz-options").addEventListener("click", checkAnswer);
  
  //Comparing the text content of the option button with the answer to the current question
  function optionIsCorrect(optionButton) {
    return optionButton.textContent === questions[currentQuestion].answer;
  }
  
  //if answer is incorrect, penalise time
  function checkAnswer(eventObject) {
    let optionButton = eventObject.target;
    resultDiv.style.display = "block";
    if (optionIsCorrect(optionButton)) {
      resultText.textContent = "Correct!";
      setTimeout(hideResultText, 1000);
    } else {
      resultText.textContent = "Incorrect!";
      setTimeout(hideResultText, 1000);
      if (time >= 10) {
        time = time - 10;
        displayTime();
      } else {
        //if time is less than 10, display time as 0 and end quiz
        //time is set to zero in this case to avoid displaying a negative number in cases where a wrong answer is submitted with < 10 seconds left on the timer
        time = 0;
        displayTime();
        endQuiz();
      }
    }

  //Increment current question by 1
    currentQuestion++;
    // Then Displaying next question if we have not run out of questions, else end quiz
    if (currentQuestion < questions.length) {
      displayQuestion();
    } else {
      endQuiz();
    }
  }
  
  //Displaying scorecard and hide other divs
  const score = document.querySelector("#score");
  
  //At end of quiz, clear the timer, hide any visible cards and display the scorecard and display the score as the remaining time
  function endQuiz() {
    clearInterval(intervalID);
    hideCards();
    scoreCard.removeAttribute("hidden");
    score.textContent = time;
  }
  
  const submitButton = document.querySelector("#submit-button");
  const inputElement = document.querySelector("#initials");
  
  //Store user initials and score when submit button is clicked
  submitButton.addEventListener("click", storeScore);
  
  function storeScore(event) {
    //Prevent default behaviour of form submission
    event.preventDefault();
  
    //Check for input
    if (!inputElement.value) {
      alert("Please enter your initials before pressing submit!");
      return;
    }
  
    //Store score and initials in an object
    let scoreboardItem = {
      initials: inputElement.value,
      score: time,
    };
  
    updateStoredscoreboard(scoreboardItem);
  
    //Hide the question card, display the scoreboardcard
    hideCards();
    scoreboardCard.removeAttribute("hidden");
  
    renderscoreboard();
  }
  
  //Updateing the scoreboard stored in local storage
  function updateStoredscoreboard(scoreboardItem) {
    let scoreboardArray = getscoreboard();

    //Appending new scoreboard item to scoreboard array
    scoreboardArray.push(scoreboardItem);
    localStorage.setItem("scoreboardArray", JSON.stringify(scoreboardArray));
  }
  
  //Getting "scoreboardArray" from local storage (if it exists) and parse it into a javascript object using JSON.parse
  function getscoreboard() {
    let storedscoreboard = localStorage.getItem("scoreboardArray");
    if (storedscoreboard !== null) {
      let scoreboardArray = JSON.parse(storedscoreboard);
      return scoreboardArray;
    } else {
      scoreboardArray = [];
    }
    return scoreboardArray;
  }
  
  //Displaying scoreboard on scoreboard card
  function renderscoreboard() {
    let sortedscoreboardArray = sortscoreboard();
    const highscoreList = document.querySelector("#highscore-list");
    highscoreList.innerHTML = "";
    for (let i = 0; i < sortedscoreboardArray.length; i++) {
      let scoreboardEntry = sortedscoreboardArray[i];
      let newListItem = document.createElement("li");
      newListItem.textContent =
        scoreboardEntry.initials + " - " + scoreboardEntry.score;
      highscoreList.append(newListItem);
    }
  }
  
  //Sort scoreboard array from highest to lowest
  function sortscoreboard() {
    let scoreboardArray = getscoreboard();
    if (!scoreboardArray) {
      return;
    }
  
    scoreboardArray.sort(function (a, b) {
      return b.score - a.score;
    });
    return scoreboardArray;
  }
  
  const clearButton = document.querySelector("#clear-button");
  clearButton.addEventListener("click", clearHighscores);
  
  //Clearing local storage and displaying empty scoreboard
  function clearHighscores() {
    localStorage.clear();
    renderscoreboard();
  }
  
  const backButton = document.querySelector("#back-button");
  backButton.addEventListener("click", returnToStart);
  
  //Hiding scoreboard card and showing start card
  function returnToStart() {
    hideCards();
    startCard.removeAttribute("hidden");
  }
  
  //using link to view highscores from any point on the page
  const scoreboardLink = document.querySelector("#scoreboard-link");
  scoreboardLink.addEventListener("click", showscoreboard);
  
  function showscoreboard() {
    hideCards();
    scoreboardCard.removeAttribute("hidden");
  
    //Stopping countdown
    clearInterval(intervalID);
  
    //Assigning undefined to time and display that, so that time does not appear on page
    time = undefined;
    displayTime();
  
    //Display scoreboard on scoreboard card
    renderscoreboard();
  }