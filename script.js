/* ========================================
   QUIZ SCRIPT
   ======================================== */

let allQuestions = [];
let questions = [];
let current = 0;
let correct = 0;
let wrong = 0;
let answered = false;

let selectedTheme = "candy";
let history = [];

/* ========================================
   THEME HANDLING
   ======================================== */

function previewTheme(theme) {
    selectedTheme = theme;
    document.body.className = theme;

    document.querySelectorAll(".theme-btn").forEach(btn => {
        btn.classList.toggle("active-theme", btn.dataset.theme === theme);
    });

    const preview = document.getElementById("themePreview");
    if (preview) preview.classList.add("visible");
}

/* ========================================
   PAGE NAVIGATION
   ======================================== */

function showPage(id) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

function goToStart() {
    showPage("startPage");
}

/* ========================================
   QUIZ START
   ======================================== */

function startQuiz() {
    document.body.className = selectedTheme;

    current = 0;
    correct = 0;
    wrong = 0;
    answered = false;
    history = [];

    showPage("quizPage");
    loadQuestion();
}

/* ========================================
   LOAD QUESTION
   ======================================== */

function loadQuestion() {

    if (current >= questions.length) {
        showResult();
        return;
    }

    let q = questions[current];

    answered = false;

    document.getElementById("question").innerText = q.question;
    document.getElementById("answers").innerHTML = "";
    document.getElementById("feedback").innerHTML = "";
    document.getElementById("feedback").style.display = "none";

    let input = document.getElementById("textAnswer");
    input.value = "";
    input.style.display = "none";

    renderAnswers(q);

    updateProgress();
    updateNavButtons();
}

/* ========================================
   RENDER ANSWERS
   ======================================== */

function renderAnswers(q) {

    const container = document.getElementById("answers");

    if (!q.options) return;

    if (!Array.isArray(q.options)) {

        Object.keys(q.options).forEach(key => {
            let btn = document.createElement("button");
            btn.className = "answer-btn";
            btn.innerText = `${key}: ${q.options[key]}`;
            btn.onclick = () => checkAnswer(key);
            container.appendChild(btn);
        });

        return;
    }

    q.options.forEach(opt => {
        let btn = document.createElement("button");
        btn.className = "answer-btn";
        btn.innerText = opt;
        btn.onclick = () => checkAnswer(opt.charAt(0));
        container.appendChild(btn);
    });
}

/* ========================================
   CHECK ANSWER
   ======================================== */

function checkAnswer(value) {

    if (answered) return;
    answered = true;

    let q = questions[current];

    let correctAnswer = (q.correct || "").trim().toUpperCase();
    let userAnswer = (value || "").trim().toUpperCase();

    let isCorrect = userAnswer === correctAnswer;

    document.querySelectorAll(".answer-btn").forEach(btn => {
        btn.disabled = true;

        let text = btn.innerText.trim().toUpperCase();
        let first = text.charAt(0);

        if (first === correctAnswer) btn.classList.add("btn-correct");
        if (first === userAnswer && !isCorrect) btn.classList.add("btn-wrong");
    });

    let feedback = document.getElementById("feedback");

    if (isCorrect) {
        correct++;
        feedback.className = "correct";
        feedback.innerHTML = "✔ Richtig!";
    } else {
        wrong++;
        feedback.className = "wrong";
        feedback.innerHTML = `✖ Falsch! Richtige Antwort: ${q.correct}`;
    }

    feedback.style.display = "block";

    history[current] = {
        answer: value,
        correct: isCorrect
    };

    updateProgress();
    updateNavButtons();
}

/* ========================================
   NAVIGATION
   ======================================== */

function nextQuestion() {

    if (!answered) {
        let fb = document.getElementById("feedback");
        fb.style.display = "block";
        fb.className = "wrong";
        fb.innerHTML = "Bitte erst beantworten.";
        return;
    }

    current++;

    if (current < questions.length) {
        loadQuestion();
    } else {
        showResult();
    }
}

function prevQuestion() {
    if (current > 0) {
        current--;
        loadQuestion();
    }
}

function updateNavButtons() {
    document.getElementById("prevBtn").style.display =
        current > 0 ? "block" : "none";
}

/* ========================================
   PROGRESS
   ======================================== */

function updateProgress() {

    let total = questions.length;
    let percent = total ? Math.round((correct / total) * 100) : 0;

    document.getElementById("progressText").innerText =
        `Frage ${current + 1} / ${total}`;

    document.getElementById("scoreText").innerText =
        `✔ ${correct} | ✖ ${wrong}`;

    document.getElementById("percentText").innerText =
        `(${percent}%)`;
}

/* ========================================
   RESULT
   ======================================== */

function showResult() {

    let total = questions.length;
    let percent = total ? (correct / total) * 100 : 0;

    let grade =
        percent >= 92 ? 1 :
        percent >= 81 ? 2 :
        percent >= 67 ? 3 :
        percent >= 50 ? 4 :
        percent >= 30 ? 5 : 6;

    document.getElementById("resultContent").innerHTML = `
        <div class="grade-badge">${grade}</div>
        <p>${percent.toFixed(1)}%</p>
        <p>✔ ${correct} | ✖ ${wrong}</p>
    `;

    showPage("resultPage");
}

/* ========================================
   SHUFFLE + RESTART
   ======================================== */

function shuffleArray(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

function shuffleAndRestart() {
    questions = shuffleArray([...allQuestions]);
    startQuiz();
}

/* ========================================
   LOAD QUESTIONS
   ======================================== */

fetch("questions.json")
    .then(res => res.json())
    .then(data => {
        allQuestions = data;
        questions = [...data];
        showPage("startPage");
    })
    .catch(err => {
        console.error(err);
        document.body.innerHTML = "Fehler beim Laden der Fragen.";
    });

/* ========================================
   💀 TOTENKOPF (VOLLSTÄNDIG INTEGRIERT)
   ======================================== */

const skull = document.getElementById("skull");
const toggleBtn = document.getElementById("skullToggleBtn");

const humanEyes = document.querySelectorAll(".human-eye");
const irises = document.querySelectorAll(".iris");

let skullActive = true;
let isLaunching = false;

let sPosX = window.innerWidth / 2;
let sPosY = window.innerHeight / 2;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let sAngle = 0;
let orbitAngle = 0;
let eyeTimer = 0;
let eyesVisible = false;

window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

/* TOGGLE */
if (toggleBtn) {
    toggleBtn.addEventListener("click", (e) => {
        e.stopPropagation();

        skullActive = !skullActive;

        if (!skullActive) {
            toggleBtn.innerText = "💀 Ein";
            skull.classList.add("skull-hidden");
        } else {
            toggleBtn.innerText = "💀 Aus";
            skull.classList.remove("skull-hidden");

            sPosX = mouseX;
            sPosY = mouseY;
        }
    });
}

/* CLICK LAUNCH */
if (skull) {
    skull.addEventListener("click", () => {

        if (isLaunching || !skullActive) return;

        isLaunching = true;

        skull.style.setProperty('--startX', `${sPosX}px`);
        skull.style.setProperty('--startY', `${sPosY}px`);
        skull.style.setProperty('--startAngle', `${sAngle}rad`);

        skull.classList.add("skull-launching");

        setTimeout(() => {
            skull.classList.remove("skull-launching");
            isLaunching = false;
        }, 1500);
    });
}

/* ANIMATION LOOP */
function updateSkull() {

    if (!skullActive || isLaunching || !skull) {
        requestAnimationFrame(updateSkull);
        return;
    }

    orbitAngle += 0.02;

    const radius = 40;

    const targetX = mouseX + Math.cos(orbitAngle) * radius - 30;
    const targetY = mouseY + Math.sin(orbitAngle) * radius - 35;

    sPosX += (targetX - sPosX) / 20;
    sPosY += (targetY - sPosY) / 20;

    skull.style.transform =
        `translate(${sPosX}px, ${sPosY}px) rotate(${sAngle}rad)`;

    eyeTimer++;

    if (eyeTimer > 120) {
        eyeTimer = 0;
        eyesVisible = !eyesVisible;

        humanEyes.forEach(e => e.classList.toggle("visible", eyesVisible));
    }

    if (eyesVisible) {
        const ix = Math.cos(orbitAngle * 2) * 3;
        const iy = Math.sin(orbitAngle * 2) * 3;

        irises.forEach(i => {
            i.style.transform = `translate(${ix}px, ${iy}px)`;
        });
    }

    requestAnimationFrame(updateSkull);
}

requestAnimationFrame(updateSkull);
