

// script.js
document.addEventListener('DOMContentLoaded', function() {

  const selectionArea = document.getElementById('selection-area');
  const numberSelectionArea = document.getElementById('number-checkboxes');
  const startButton = document.getElementById('start');
  const exerciseArea = document.getElementById('exercise-area');
  const exercisesForm = document.getElementById('exercises-form');
  const submitButton = document.getElementById('submit');
  const restartButton = document.getElementById('restart');
  const resultsArea = document.getElementById('results-area');
  const timerDisplay = document.getElementById('timer-value');
  let timer = null;
  let startTime;

  // Generate number selection checkboxes
  for (let i = 1; i <= 9; i++) {
    const checkboxWrapper = document.createElement('div');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'num-' + i;
    checkbox.value = i;
    const label = document.createElement('label');
    label.htmlFor = 'num-' + i;
    label.textContent = 'Table de ' + i;
    checkboxWrapper.appendChild(checkbox);
    checkboxWrapper.appendChild(label);
    numberSelectionArea.appendChild(checkboxWrapper);
  }

  // Start button click handler
  startButton.addEventListener('click', function() {
    let selectedNumbers = [];
    document.querySelectorAll('#number-checkboxes input[type="checkbox"]:checked').forEach(checkbox => {
      selectedNumbers.push(parseInt(checkbox.value, 10));
    });

    if (selectedNumbers.length < 2) {
      alert('Merci de sélectionner au moins deux tables');
      return;
    }
    selectionArea.style.display = 'none'

    numberSelectionArea.style.display = 'none'; // Hide the number selection area
    generateExercises(selectedNumbers);
    exerciseArea.style.display = 'flex';
    exerciseArea.style.flexDirection = 'column'; // Adjust for column layout
    startTimer();
    startTime = new Date(); // Record start time
  });

  // Generate exercises in a 2x10 grid
  function generateExercises(selectedNumbers) {
    exercisesForm.innerHTML = ''; // Clear previous exercises
    exercisesForm.style.display = 'grid';
    exercisesForm.style.gridTemplateColumns = 'repeat(2, 1fr)';
    exercisesForm.style.gap = '10px';
    for (let i = 0; i < 20; i++) {
      const num1 = selectedNumbers[Math.floor(Math.random() * selectedNumbers.length)];
      const num2 = Math.floor(Math.random() * 9) + 1;
      const exerciseDiv = document.createElement('div');
      exerciseDiv.innerHTML = `<label>${num1} + ${num2} = </label><input type="text" class="answer" data-correct-answer="${num1 + num2}" maxlength="3"><span></span>`;
      exercisesForm.appendChild(exerciseDiv);
    }
  }

  // Submit button click handler
  submitButton.addEventListener('click', function(event) {
    event.preventDefault();
    clearInterval(timer);
    const endTime = new Date();
    const timeSpent = Math.round((endTime - startTime) / 1000);
    checkAnswers();
    submitButton.style.display = 'none';
    restartButton.style.display = 'inline';
    displayFinalScore(timeSpent);
  });

  // Check answers and display "BRAVO" for correct ones, "???" for unanswered
  function checkAnswers() {
    let correctCount = 0;
    document.querySelectorAll('.answer').forEach(input => {
      const correctAnswer = parseInt(input.dataset.correctAnswer, 10);
      const userAnswer = input.value.trim() ? parseInt(input.value, 10) : null;
      const resultSpan = input.nextElementSibling;

      if (userAnswer === correctAnswer) {
        correctCount++;
        resultSpan.textContent = "BRAVO";
        resultSpan.classList.add('correct-answer');
      } else if (userAnswer === null) {
        input.classList.add('unanswered');
        input.value = '???';
        resultSpan.textContent = correctAnswer; // "???";
        resultSpan.classList.add('unanswered');
      } else {
        input.classList.add('incorrect-answer');
        resultSpan.textContent = correctAnswer;
        resultSpan.classList.add('incorrect-answer');
      }
    });
    return correctCount;
  }

  function mkScore(sc) {
    if (sc < 5)
      return 'insuffisant';
    else if (sc < 10)
      return 'passable';
    else if (sc < 15)
      return 'bien';
    else if (sc < 20)
      return 'très bien';
    else
      return 'excellent';
  }


  // Display final score and time spent
  function displayFinalScore(timeSpent) {
    const score = checkAnswers();
    const scoreDisplay = document.createElement('div');
    const oublis = document.getElementsByClassName('unanswered').length / 2;
    const errorMsg = ((20 - score - oublis) > 1) ? 'erreurs' : 'erreur';
    const bilan = mkScore(score);
    scoreDisplay.innerHTML = `<p>C'est ${bilan}</p><p>Ton score: ${score} sur 20, ${20 - score - oublis} ${errorMsg} et ${oublis} oublis en ${timeSpent} secondes</p>`;
    resultsArea.appendChild(scoreDisplay);
    resultsArea.style.display = 'block';
  }

  // Restart button click handler
  restartButton.addEventListener('click', function() {
    window.location.reload(); // Simplest way to restart the game
  });

  // Start timer
  function startTimer() {
    let time = 0;
    timer = setInterval(function() {
      time++;
      timerDisplay.textContent = time;
    }, 1000);
  }
});
