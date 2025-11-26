// const { createElement } = require("react");

const submitbtn = document.getElementById("submitbtn")
const dobForm = document.getElementById("dobForm")
const birthdateInput = document.getElementById("birthdate");
const result = document.getElementById("result")
const countdownBtn = document.getElementById("countdownBtn")
const countdownResultInMonths = document.getElementById("countdownResultInMonths");
const countdownResultInDays = document.getElementById("countdownResultInDays")
const Age = document.getElementById("Age")

const savDOB = (date) => {
    return new Promise((resolve, reject) => {
        if (!date) {
            reject("Date of Birth is Required");
        } else {
            resolve("Date of Birth has been saved successfully: <b>" + date + "</b>");
        }
    });
};

const displayRemainingTime = (date) => {
    const [birthYear, birthMonth, birthDay] = date.split("-").map(Number);

    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1; // 1-12
    const currentDay = today.getDate();

    // Determine next birthday
    let nextBirthdayYear = (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay <= birthDay)) 
        ? currentYear
        : currentYear + 1;
    let age = nextBirthdayYear - birthYear
    const nextBirthday = new Date(nextBirthdayYear, birthMonth - 1, birthDay);

    // Total difference in milliseconds
    let diffMs = nextBirthday - today;

    // Calculate total days
    let totalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    // Approximate months and remaining days
    let monthsLeft = birthMonth - currentMonth;
    if (monthsLeft < 0) monthsLeft += 12;

    let daysLeft = birthDay - currentDay;
    if (daysLeft < 0) {
        monthsLeft -= 1;
        // Get days in previous month
        const prevMonth = new Date(nextBirthdayYear, birthMonth - 1, 0); // last day of previous month
        daysLeft += prevMonth.getDate();
    }

    countdownResultInMonths.innerHTML = `Next birthday is in <b>${monthsLeft}</b> months and <b>${daysLeft}</b> days! 🎉`;
    countdownResultInDays.innerHTML = `Or in total <b>${totalDays}</b> days`;
    alert(`You will be ${age} years old!`)
};


submitbtn.addEventListener('click', (event) => {
      event.preventDefault(); // prevent page refresh
      
      const selectedDate = birthdateInput.value;
      
      savDOB(selectedDate)
      .then((message) => {
        result.innerHTML = message;
        submitbtn.classList.remove("btn-secondary");
        submitbtn.classList.add("btn-success");
        submitbtn.disabled = true;
        countdownBtn.disabled = false;

        // Add listener for countdown button only once
        countdownBtn.addEventListener('click', () => {
            displayRemainingTime(selectedDate);
        }, { once: true }); // ensures listener is added only once

      })
      .catch((error) => {
        result.innerText = error;
        submitbtn.classList.remove("btn-success");
        submitbtn.classList.add("btn-secondary");
      })
})

// Weather Forecast Form Handler
document.addEventListener('DOMContentLoaded', () => {
    const weatherForm = document.getElementById('weatherForm');
    const weatherResult = document.getElementById('weatherResult');
    const weatherForecast = document.getElementById('weatherForecast');
    const apiKey = '281d14c40c2c4e7bb9250926251811';

    if (!weatherForm) return;

    weatherForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const city = document.getElementById('weatherCityInput').value.trim();
        const days = parseInt(document.getElementById('weatherDaysSelect').value);

        // Clear previous results
        weatherResult.style.display = 'none';
        weatherForecast.style.display = 'none';

        // Validate inputs
        if (!city) {
            weatherResult.className = 'alert alert-warning';
            weatherResult.innerHTML = 'Please enter a city name.';
            weatherResult.style.display = 'block';
            return;
        }

        // Fetch forecast
        try {
            const url = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${city}&days=${days}&aqi=no`;
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error('City not found. Please check the city name.');
            }

            const data = await response.json();
            displayWeatherForecast(data, days);
        } catch (error) {
            weatherResult.className = 'alert alert-danger';
            weatherResult.innerHTML = `❌ ${error.message}`;
            weatherResult.style.display = 'block';
        }
    });

    function displayWeatherForecast(data, days) {
        const location = data.location;
        const forecast = data.forecast.forecastday;
        const current = data.current;

        // Location header
        weatherResult.className = 'alert alert-info';
        weatherResult.innerHTML = `<strong>${location.name}, ${location.region}, ${location.country}</strong>`;
        weatherResult.style.display = 'block';

        // Build forecast cards
        let forecastHTML = '<div class="weather-cards">';
        
        // Add today's weather at the top
        forecastHTML += `
            <div class="weather-card-item weather-card-today">
                <h5>Today</h5>
                <img src="https:${current.condition.icon}" alt="${current.condition.text}" class="weather-icon">
                <p class="weather-condition">${current.condition.text}</p>
                <div class="weather-temps">
                    <span class="temp-high">🌡️ Current: ${current.temp_c}°C / ${current.temp_f}°F</span>
                </div>
                <p class="weather-details">💨 ${current.vis_km}km visibility | 💧 ${current.humidity}% humidity | 💨 ${current.wind_kph}km/h wind</p>
            </div>
        `;
        
        // Add forecast days
        forecast.slice(0, days).forEach((day, idx) => {
            const date = new Date(day.date);
            const dayName = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
            const dayData = day.day;

            forecastHTML += `
                <div class="weather-card-item">
                    <h5>${dayName}</h5>
                    <img src="https:${dayData.condition.icon}" alt="${dayData.condition.text}" class="weather-icon">
                    <p class="weather-condition">${dayData.condition.text}</p>
                    <div class="weather-temps">
                        <span class="temp-high">🔴 High: ${dayData.maxtemp_c}°C / ${dayData.maxtemp_f}°F</span>
                        <span class="temp-low">🔵 Low: ${dayData.mintemp_c}°C / ${dayData.mintemp_f}°F</span>
                    </div>
                    <p class="weather-details">💨 ${dayData.avgvis_km}km visibility | 💧 ${dayData.avghumidity}% humidity</p>
                </div>
            `;
        });
        forecastHTML += '</div>';

        weatherForecast.innerHTML = forecastHTML;
        weatherForecast.style.display = 'block';
    }
});

// Number Guessing Game Logic
// Smooth scroll and vertical centering for Fun Stuff navigation links
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = [
        { selector: 'a[href="#dobForm"]', target: '#dobForm' },
        { selector: 'a[href="#weather-section"]', target: '#weather-section' },
        { selector: 'a[href="#number-guessing-game"]', target: '#number-guessing-game' }
    ];
    navLinks.forEach(linkInfo => {
        document.querySelectorAll(linkInfo.selector).forEach(link => {
            link.addEventListener('click', function(e) {
                const section = document.querySelector(linkInfo.target);
                if (section) {
                    e.preventDefault();
                    const rect = section.getBoundingClientRect();
                    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                    // Center the section in the viewport
                    const offset = rect.top + scrollTop - (window.innerHeight/2) + (rect.height/2);
                    window.scrollTo({ top: offset, behavior: 'smooth' });
                }
            });
        });
    });
});

const intervalSelect = document.getElementById("intervalSelect");
const difficultySelect = document.getElementById("difficultySelect");
const guessInput = document.getElementById("guessInput");
const startGameBtn = document.getElementById("startGameBtn");
const guessBtn = document.getElementById("guessBtn");
const restartBtn = document.getElementById("restartBtn");
const gameMessage = document.getElementById("gameMessage");
const guessHistorySection = document.getElementById("guessHistorySection");
const guessHistory = document.getElementById("guessHistory");
const triesLeft = document.getElementById("triesLeft");
const guessingGameCard = document.querySelector('.guessing-game-card');

let randomNumber = null;
let maxTries = 0;
let tries = 0;
let guesses = [];
let minValue = 1;
let maxValue = 50;
let gameActive = false;

const difficultyMap = {
    easy: 20,
    medium: 10,
    hard: 5
};

function resetGameUI() {
    guessInput.value = "";
    guessInput.disabled = true;
    guessBtn.disabled = true;
    restartBtn.style.display = "none";
    gameMessage.style.display = "none";
    guessHistorySection.style.display = "none";
    guessHistory.innerHTML = "";
    triesLeft.innerHTML = "";
}

function startGame() {
    maxValue = parseInt(intervalSelect.value);
    minValue = 1;
    maxTries = difficultyMap[difficultySelect.value];
    tries = 0;
    guesses = [];
    randomNumber = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
    gameActive = true;
    guessInput.disabled = false;
    guessInput.min = minValue;
    guessInput.max = maxValue;
    guessBtn.disabled = false;
    restartBtn.style.display = "none";
    gameMessage.style.display = "none";
    guessHistorySection.style.display = "none";
    guessHistory.innerHTML = "";
    triesLeft.innerHTML = `Tries left: <span style='color:#007bff'>${maxTries}</span>`;
    guessInput.focus();
    guessingGameCard.classList.remove('active-card');
}

function endGame(win) {
    gameActive = false;
    guessInput.disabled = true;
    guessBtn.disabled = true;
    restartBtn.style.display = "inline-block";
    gameMessage.style.display = "block";
    guessHistorySection.style.display = "block";
    if (win) {
        gameMessage.className = "alert text-center";
        gameMessage.style.background = "linear-gradient(90deg,#43e97b 0%,#38f9d7 100%)";
        gameMessage.style.color = "#fff";
        gameMessage.innerHTML = `<span style='font-size:1.3rem;'>🎉 Congratulations!</span><br>You guessed the number <b>${randomNumber}</b> in <b>${tries}</b> tries!`;
    } else {
        gameMessage.className = "alert text-center";
        gameMessage.style.background = "linear-gradient(90deg,#ff5858 0%,#f09819 100%)";
        gameMessage.style.color = "#fff";
        gameMessage.innerHTML = `<span style='font-size:1.2rem;'>😢 Game Over!</span><br>The number was <b>${randomNumber}</b>. Try again!`;
    }
}

function getHint(guess) {
    const diff = Math.abs(guess - randomNumber);
    if (guess > randomNumber) {
        if (diff > maxValue * 0.4) return "<span style='color:#e74c3c;font-weight:600;'>You are way too high.</span>";
        if (diff <= 2) return "<span style='color:#27ae60;font-weight:600;'>You are very close, just pick a number a bit lower.</span>";
        if (diff <= maxValue * 0.1) return "<span style='color:#f39c12;font-weight:600;'>Not too far, but the number is still lower.</span>";
        return "<span style='color:#2980b9;font-weight:600;'>The number is lower.</span>";
    } else {
        if (diff > maxValue * 0.4) return "<span style='color:#e74c3c;font-weight:600;'>You are way too low.</span>";
        if (diff <= 2) return "<span style='color:#27ae60;font-weight:600;'>You are very close, just pick a number a bit higher.</span>";
        if (diff <= maxValue * 0.1) return "<span style='color:#f39c12;font-weight:600;'>Not too far, but the number is still higher.</span>";
        return "<span style='color:#2980b9;font-weight:600;'>The number is higher.</span>";
    }
}

function updateGuessHistory() {
    guessHistory.innerHTML = "";
    guesses.forEach((g, idx) => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.style.background = idx === guesses.length-1 ? "#e3eafc" : "#f8fafc";
        li.style.fontWeight = idx === guesses.length-1 ? "600" : "400";
        li.style.borderRadius = "6px";
        li.innerHTML = `<span>Guess ${idx + 1}: <b>${g}</b></span>`;
        guessHistory.appendChild(li);
    });
    guessHistorySection.style.display = "block";
}

startGameBtn.addEventListener("click", () => {
    startGame();
});

guessBtn.addEventListener("click", () => {
    if (!gameActive) return;
    let guess = guessInput.value.trim();
    if (!guess) {
        gameMessage.className = "alert text-center";
        gameMessage.style.background = "#fff3cd";
        gameMessage.style.color = "#856404";
        gameMessage.innerHTML = "Please enter a number.";
        gameMessage.style.display = "block";
        return;
    }
    guess = Number(guess);
    if (!Number.isInteger(guess)) {
        gameMessage.className = "alert text-center";
        gameMessage.style.background = "#fff3cd";
        gameMessage.style.color = "#856404";
        gameMessage.innerHTML = "No decimals allowed!";
        gameMessage.style.display = "block";
        return;
    }
    if (guess < minValue || guess > maxValue) {
        gameMessage.className = "alert text-center";
        gameMessage.style.background = "#fff3cd";
        gameMessage.style.color = "#856404";
        gameMessage.innerHTML = `Please enter a number between <b>${minValue}</b> and <b>${maxValue}</b>.`;
        gameMessage.style.display = "block";
        return;
    }
    tries++;
    guesses.push(guess);
    updateGuessHistory();
    if (guess === randomNumber) {
        endGame(true);
        triesLeft.innerHTML = "";
        return;
    }
    if (tries >= maxTries) {
        endGame(false);
        triesLeft.innerHTML = "";
        return;
    }
    // Give hint
    gameMessage.className = "alert text-center";
    gameMessage.style.background = "#e3eafc";
    gameMessage.style.color = "#1a2537";
    gameMessage.innerHTML = getHint(guess);
    gameMessage.style.display = "block";
    triesLeft.innerHTML = `Tries left: <span style='color:#396afc;font-weight:600;'>${maxTries - tries}</span>`;
    guessInput.value = "";
    guessInput.focus();
});

restartBtn.addEventListener("click", () => {
    resetGameUI();
    startGame();
});

intervalSelect.addEventListener("change", () => {
    guessInput.max = intervalSelect.value;
    guessInput.value = "";
});

// On page load, reset game UI
resetGameUI();

// Add focus/blur effect for card interactivity
if (guessingGameCard) {
    guessingGameCard.addEventListener('mouseenter', () => {
        guessingGameCard.classList.add('active-card');
    });
    guessingGameCard.addEventListener('mouseleave', () => {
        guessingGameCard.classList.remove('active-card');
    });
}

// Add pointer cursor for all interactive elements
[startGameBtn, guessBtn, restartBtn, intervalSelect, difficultySelect, guessInput].forEach(el => {
    if (el) el.style.cursor = 'pointer';
});

/* ===== Memory Matching Game Logic ===== */
document.addEventListener('DOMContentLoaded', () => {
    const memoryStartBtn = document.getElementById('memoryStartBtn');
    const memoryRestartBtn = document.getElementById('memoryRestartBtn');
    const memoryGrid = document.getElementById('memoryGrid');
    const memoryMovesEl = document.getElementById('memoryMoves');
    const memoryTimerEl = document.getElementById('memoryTimer');
    const memoryMessage = document.getElementById('memoryMessage');
    const memoryBestEl = document.getElementById('memoryBest');

    if (!memoryGrid) return; // page may not have the section

    const symbols = ['🐶','🐱','🦊','🐻','🦁','🐼','🐵','🐸']; // 8 pairs => 16 cards
    let cards = [];
    let firstCard = null;
    let secondCard = null;
    let lockBoard = false;
    let moves = 0;
    let matches = 0;
    let timer = null;
    let seconds = 0;
    const bestKey = 'memoryBestScore';

    function formatTime(sec){
        const m = Math.floor(sec/60).toString().padStart(2,'0');
        const s = (sec%60).toString().padStart(2,'0');
        return `${m}:${s}`;
    }

    function updateTimer(){
        seconds++;
        memoryTimerEl.textContent = formatTime(seconds);
    }

    function startTimer(){
        if (timer) return;
        seconds = 0;
        memoryTimerEl.textContent = formatTime(seconds);
        timer = setInterval(updateTimer, 1000);
    }

    function stopTimer(){
        if (timer) { clearInterval(timer); timer = null; }
    }

    function shuffle(array){
        for (let i = array.length -1; i>0; i--){
            const j = Math.floor(Math.random()*(i+1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function buildGrid(){
        // prepare pairs
        cards = shuffle([...symbols, ...symbols]);
        memoryGrid.innerHTML = '';
        cards.forEach((sym, idx) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.symbol = sym;
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">?</div>
                    <div class="card-back">${sym}</div>
                </div>`;
            card.addEventListener('click', onCardClick);
            memoryGrid.appendChild(card);
        });
    }

    function onCardClick(e){
        const card = e.currentTarget;
        if (lockBoard) return;
        if (card === firstCard) return;
        if (card.classList.contains('matched')) return;

        card.classList.add('flipped');
        if (!firstCard){
            firstCard = card;
            if (moves === 0 && !timer) startTimer();
            return;
        }
        secondCard = card;
        lockBoard = true;
        moves++;
        memoryMovesEl.textContent = moves;

        // check match
        if (firstCard.dataset.symbol === secondCard.dataset.symbol){
            // match
            firstCard.classList.add('matched');
            secondCard.classList.add('matched');
            matches++;
            resetTurn();
            if (matches === symbols.length){
                // game complete
                stopTimer();
                showCompletion();
            }
        } else {
            // not match -> flip back
            setTimeout(() => {
                firstCard.classList.remove('flipped');
                secondCard.classList.remove('flipped');
                resetTurn();
            }, 800);
        }
    }

    function resetTurn(){
        [firstCard, secondCard] = [null, null];
        lockBoard = false;
    }

    function showCompletion(){
        memoryMessage.style.display = 'block';
        memoryMessage.className = 'alert alert-success';
        memoryMessage.innerHTML = `🎉 You completed the game in <strong>${moves}</strong> moves and <strong>${formatTime(seconds)}</strong>!`;
        // update best
        const bestRaw = localStorage.getItem(bestKey);
        const best = bestRaw ? JSON.parse(bestRaw) : null;
        const currentScore = { moves, time: seconds };
        let newBest = best;
        if (!best || moves < best.moves || (moves === best.moves && seconds < best.time)){
            newBest = currentScore;
            localStorage.setItem(bestKey, JSON.stringify(newBest));
        }
        memoryBestEl.textContent = newBest ? `${newBest.moves} / ${formatTime(newBest.time)}` : '--';
        // show small confetti? skip
    }

    function startGame(){
        // reset states
        stopTimer();
        seconds = 0;
        memoryTimerEl.textContent = formatTime(seconds);
        moves = 0;
        matches = 0;
        memoryMovesEl.textContent = moves;
        memoryMessage.style.display = 'none';
        // build grid
        buildGrid();
        // ensure all cards unflipped
        document.querySelectorAll('.memory-card').forEach(c => c.classList.remove('flipped','matched'));
        // read best
        const bestRaw = localStorage.getItem(bestKey);
        if (bestRaw) {
            const b = JSON.parse(bestRaw);
            memoryBestEl.textContent = `${b.moves} / ${formatTime(b.time)}`;
        } else {
            memoryBestEl.textContent = '--';
        }
    }

    memoryStartBtn.addEventListener('click', () => { startGame(); startTimer(); });
    memoryRestartBtn.addEventListener('click', () => { startGame(); });

    // initialize
    startGame();
});