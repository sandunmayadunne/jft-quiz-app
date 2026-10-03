let currentQuestionIndex = 0;
let score = 0;
let quizQuestions = [];
let currentQuizType = "";

const homeScreen = document.getElementById("home-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

const quizTitle = document.getElementById("quiz-title");
const quizInstruction = document.getElementById("quiz-instruction");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
// අලුත් current question display එක
const currentQDisplay = document.getElementById("current-q");
const totalDisplay = document.getElementById("total");
const finalScoreText = document.getElementById("final-score-text");

document.getElementById("btn-aisatsu").addEventListener("click", () => startQuiz("aisatsu"));
document.getElementById("btn-hiragana").addEventListener("click", () => startQuiz("hiragana"));

document.getElementById("restart-btn").addEventListener("click", () => {
    resultScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
});

function startQuiz(type) {
    score = 0;
    currentQuestionIndex = 0;
    currentQuizType = type;
    
    let dataSource = type === "aisatsu" ? aisatsuData : hiraganaData;
    
    quizQuestions = [...dataSource].sort(() => Math.random() - 0.5);
    
    totalDisplay.innerText = quizQuestions.length;

    if (type === "aisatsu") {
        quizTitle.innerText = "Aisatsu (ආචාර සමාචාර)";
        quizInstruction.innerText = "සිංහල තේරුමට ගැලපෙන ජපන් වචනය තෝරන්න:";
    } else {
        quizTitle.innerText = "Hiragana (හිරගනා)";
        quizInstruction.innerText = "ඉංග්‍රීසි අකුරට ගැලපෙන හිරගනා අකුර තෝරන්න:";
    }

    homeScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    loadQuestion();
}

function getOptions(correctAnswer, dataSource, answerKey) {
    let options = [correctAnswer];
    while (options.length < 4) {
        let randomItem = dataSource[Math.floor(Math.random() * dataSource.length)];
        let randomOption = randomItem[answerKey];
        
        if (!options.includes(randomOption)) {
            options.push(randomOption);
        }
    }
    return options.sort(() => Math.random() - 0.5); 
}

function loadQuestion() {
    optionsContainer.innerHTML = "";
    nextBtn.classList.add("hidden");

    // මෙතනින් තමයි දැන් ඉන්න ප්‍රශ්න අංකය update වෙන්නේ
    currentQDisplay.innerText = currentQuestionIndex + 1;

    const currentQ = quizQuestions[currentQuestionIndex];
    let questionString = "";
    let correctAnswer = "";
    let answerKey = "";
    let dataSource = currentQuizType === "aisatsu" ? aisatsuData : hiraganaData;

    if (currentQuizType === "aisatsu") {
        questionString = currentQ.sinhala;
        correctAnswer = currentQ.romaji;
        answerKey = "romaji";
    } else {
        questionString = `"${currentQ.romaji.toUpperCase()}" අකුර කුමක්ද?`;
        correctAnswer = currentQ.kana;
        answerKey = "kana";
    }

    questionText.innerText = questionString;

    const options = getOptions(correctAnswer, dataSource, answerKey);

    options.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option;
        button.classList.add("option-btn");
        
        if (currentQuizType === "hiragana") {
            button.style.fontSize = "2rem";
            button.style.fontWeight = "bold";
        }

        button.addEventListener("click", () => checkAnswer(button, option, correctAnswer));
        optionsContainer.appendChild(button);
    });
}

function checkAnswer(selectedButton, selectedAnswer, correctAnswer) {
    const buttons = document.querySelectorAll(".option-btn");
    
    buttons.forEach(btn => btn.style.pointerEvents = "none");

    // Score එක හැංගිලා හැදෙනවා, ඒත් screen එකේ පෙන්නන්නේ නෑ
    if (selectedAnswer === correctAnswer) {
        selectedButton.classList.add("correct");
        score++;
    } else {
        selectedButton.classList.add("wrong");
        buttons.forEach(btn => {
            if (btn.innerText === correctAnswer) {
                btn.classList.add("correct");
            }
        });
    }

    nextBtn.classList.remove("hidden");
}

const goHomeBtn = document.getElementById("go-home-btn");
const customModal = document.getElementById("custom-modal");
const modalMessage = document.getElementById("modal-message");
const modalCancelBtn = document.getElementById("modal-cancel-btn");
const modalOkBtn = document.getElementById("modal-ok-btn");

goHomeBtn.addEventListener("click", () => {
    const answered = currentQuestionIndex; 
    const remaining = quizQuestions.length - answered;
    
    modalMessage.innerHTML = `ඔබ මෙතෙක් ප්‍රශ්න <b>${answered}</b> කට පිළිතුරු දී ඇත.<br>ඒවායින් <b>${score}</b> ක් නිවැරදියි.<br>මෙම කොටස අවසන් කිරීමට තව ප්‍රශ්න <b>${remaining}</b> ක් ඉතිරිව ඇත.<br><br>ඔබට නිසැකවම Home එකට යාමට අවශ්‍යද?`;
    
    customModal.classList.remove("hidden");
});

modalCancelBtn.addEventListener("click", () => {
    customModal.classList.add("hidden");
});

modalOkBtn.addEventListener("click", () => {
    customModal.classList.add("hidden");
    quizScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
});

nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizQuestions.length) {
        loadQuestion();
    } else {
        quizScreen.classList.add("hidden");
        resultScreen.classList.remove("hidden");
        finalScoreText.innerHTML = `ඔබ ප්‍රශ්න <b>${quizQuestions.length}</b> න් <b>${score}</b> කට නිවැරදිව පිළිතුරු ලබා දුන්නා! <br><br> නියමයි! 👏`;
    }
});