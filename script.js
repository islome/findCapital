let allCountries = [];
let currentQuestion = 0;
let score = 0;
let bestScores = {};
let playerName = '';
let timer;

// Barcha mamlakatlarni yuklash
async function loadCountries() {
    try {
        const response = await fetch("https://restcountries.com/v3.1/all");
        const data = await response.json();
        allCountries = data.map(country => ({
            name: country.name.common,
            capital: country.capital ? country.capital[0] : "No Capital",
            flag: country.flags.png
        }));
        askPlayerName();
    } catch (error) {
        console.error("Error loading countries:", error);
    }
}

// Foydalanuvchining ismini so'rash
function askPlayerName() {
    playerName = prompt("Enter your name, please:");
    localStorage.setItem("playerName", playerName);
    localStorage.setItem("bestScores", JSON.stringify(bestScores));
    if (!playerName) {
        alert("You should enter your name!");
        askPlayerName();
    } else {
        if (!bestScores[playerName]) bestScores[playerName] = 0; // Yangi foydalanuvchi uchun natijani nollashtirish
        startGame();
    }
}

// O'yinni boshlash
function startGame() {
    clearInterval(timer);
    currentQuestion = 0;
    score = 0;
    console.log('Game started');
    nextQuestion();
}

// Savolni ko'rsatish
function nextQuestion() {
    if (currentQuestion === 10) {
        showResult();
        return;
    }

    const randomCountry = allCountries[Math.floor(Math.random() * allCountries.length)];
    const correctAnswer = randomCountry.capital;

    const options = [correctAnswer];
    while (options.length < 4) {
        const randomOption = allCountries[Math.floor(Math.random() * allCountries.length)].capital;
        if (!options.includes(randomOption) && randomOption !== "No Capital") {
            options.push(randomOption);
        }
    }

    shuffleArray(options);

    // HTML interfeysni yangilash
    document.querySelector(".question").innerHTML = `
        <p> </p>
        <h2>${randomCountry.name}</h2>
        <img class="img" src="${randomCountry.flag}" alt="${randomCountry.name}" width="100"><br>
    `;

    const optionsDiv = document.querySelector("#options");
    optionsDiv.innerHTML = ""; // Variantlarni tozalash
    options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.onclick = () => checkAnswer(option, correctAnswer);
        optionsDiv.appendChild(button);
    });

    startTimer();
    currentQuestion++;
}

// Javobni tekshirish
function checkAnswer(selected, correct) {
    clearInterval(timer); // Timerni to'xtatish

    const options = document.querySelectorAll("#options button");
    options.forEach(button => {
        if (button.textContent === correct) {
            button.style.backgroundColor = "green";
        } else if (button.textContent === selected) {
            button.style.backgroundColor = "red";
        }
        button.disabled = true;
    });


    if (selected === correct) {
        score++;
    }
    setTimeout(nextQuestion, 2000); // Keyingi savolga o'tish
}

// Timer funksiyasi
function startTimer() {
    let timeLeft = 15;
    const timerDiv = document.querySelector(".timer");
    timerDiv.textContent = `Your time: ${timeLeft}s`;

    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerDiv.textContent = `Your time: ${timeLeft}s`;
        if (timeLeft === 0) {
            clearInterval(timer);
            nextQuestion();
        }
    }, 1000);
}

// Natijalarni ko'rsatish
function showResult() {
    if (score > bestScores[playerName]) {
        bestScores[playerName] = score;
    }
    localStorage.setItem("bestScores", JSON.stringify(bestScores));
    document.querySelector(".container").innerHTML = `
        <div class="result">
        <h2>Game Over!</h2>
        <p>Your Score: ${score} / 10</p>
        <p>${score < 5 ? 'Don`t be panic, Try harder next time!' : 'You are a genius!'}</p>
        <button class="button" onclick="startGame()">Play Again</button>
        <button class="button" onclick="showBestScores()">Results</button>
        </div>
    `;
    document.querySelector(".container").style.width = "300px";
    document.querySelector(".container").style.height = "250px";
    document.querySelector(".container").style.transition = "all .5s";
    document.querySelector("h1").style.display = "none";
    document.querySelector(".ball").style.display = "none";
    document.querySelector(".hold").style.display = "none";
    document.querySelector(".stage").style.display = "none";
    console.log('Game over');
}

// Eng yaxshi natijalarni ko'rsatish
function showBestScores() {
    const results = Object.entries(bestScores)
        .map(([name, score]) => `<p>${name}: ${score} ball</p>`)
        .join("");
    document.querySelector(".container").innerHTML = `
        <div class="results">
        <h2>The best results</h2>
        ${results}<br>
        <button class="button" onclick="startGame()">Play Again</button>
        </div>
    `;
    document.querySelector(".container").style.width = "260px";
    document.querySelector(".container").style.height = "200px";
    document.querySelector(".container").style.transition = "all .5s";
}

// Variantlarni tasodifiylashtirish     
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// API-dan yuklashni boshlash
loadCountries();
