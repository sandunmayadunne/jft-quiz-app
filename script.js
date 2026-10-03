let currentQuestionIndex = 0;
let score = 0;
let quizQuestions = [];
let currentQuizType = "";

let learnIndex = 0;
let learnData = [];

const mainBox = document.getElementById("main-box");
const homeScreen = document.getElementById("home-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");
const learnScreen = document.getElementById("learn-screen");

const quizTitle = document.getElementById("quiz-title");
const quizInstruction = document.getElementById("quiz-instruction");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const currentQDisplay = document.getElementById("current-q");
const totalDisplay = document.getElementById("total");
const finalScoreText = document.getElementById("final-score-text");

const learnTitle = document.getElementById("learn-title");
const learnJap = document.getElementById("learn-jap");
const learnRomaji = document.getElementById("learn-romaji");
const learnSin = document.getElementById("learn-sin");
const learnCurrent = document.getElementById("learn-current");
const learnTotal = document.getElementById("learn-total");
const prevWordBtn = document.getElementById("prev-word-btn");
const nextWordBtn = document.getElementById("next-word-btn");

// Voice Setup
let japVoice = null;
function loadVoices() {
    const voices = window.speechSynthesis.getVoices();
    japVoice = voices.find(v => v.name.includes("Google 日本語") || v.name.includes("Kyoko") || v.name.includes("Nanami") || v.lang === "ja-JP");
}
window.speechSynthesis.onvoiceschanged = loadVoices;
loadVoices();

// Romaji to Hiragana Converter
function convertToKana(romaji) {
    if (!romaji) return "";
    let r = romaji.toLowerCase();
    
    r = r.replace(/([kdstgpb])\1/g, 'っ$1');
    r = r.replace(/tc/g, 'っc');
    r = r.replace(/nn/g, 'ん'); 
    
    const map = {
        'kya':'きゃ','kyu':'きゅ','kyo':'きょ','sha':'しゃ','shu':'しゅ','sho':'しょ','cha':'ちゃ','chu':'ちゅ','cho':'ちょ','nya':'にゃ','nyu':'にゅ','nyo':'にょ','hya':'ひゃ','hyu':'ひゅ','hyo':'ひょ','mya':'みゃ','myu':'みゅ','myo':'みょ','rya':'りゃ','ryu':'りゅ','ryo':'りょ','gya':'ぎゃ','gyu':'ぎゅ','gyo':'ぎょ','ja':'じゃ','ju':'じゅ','jo':'じょ','bya':'びゃ','byu':'びゅ','byo':'びょ','pya':'ぴゃ','pyu':'ぴゅ','pyo':'ぴょ',
        'ka':'か','ki':'き','ku':'く','ke':'け','ko':'こ','sa':'さ','shi':'し','su':'す','se':'せ','so':'そ','ta':'た','chi':'ち','tsu':'つ','te':'て','to':'と','na':'な','ni':'に','nu':'ぬ','ne':'ね','no':'の','ha':'は','hi':'ひ','fu':'ふ','he':'へ','ho':'ほ','ma':'ま','mi':'み','mu':'む','me':'め','mo':'も','ya':'や','yu':'ゆ','yo':'よ','ra':'ら','ri':'り','ru':'る','re':'れ','ro':'ろ','wa':'わ','wo':'を',
        'ga':'が','gi':'ぎ','gu':'ぐ','ge':'げ','go':'ご','za':'ざ','ji':'じ','zu':'ず','ze':'ぜ','zo':'ぞ','da':'だ','de':'で','do':'ど','ba':'ば','bi':'び','bu':'ぶ','be':'べ','bo':'ぼ','pa':'ぱ','pi':'ぴ','pu':'ぷ','pe':'ぺ','po':'ぽ',
        'a':'あ','i':'い','u':'う','e':'え','o':'お'
    };
    
    for (let key in map) {
        r = r.split(key).join(map[key]);
    }
    r = r.replace(/n/g, 'ん');
    return r;
}

// ----------------------------------------------------
// Learn Mode setup (Aisatsu & Family)
// ----------------------------------------------------
function openLearnMode(data, title) {
    learnData = data;
    learnIndex = 0;
    learnTotal.innerText = learnData.length;
    learnTitle.innerText = title;
    
    homeScreen.classList.add("hidden");
    learnScreen.classList.remove("hidden");
    mainBox.classList.remove("glass-mode");
    
    loadLearnWord();
}

document.getElementById("btn-learn-aisatsu").addEventListener("click", () => openLearnMode(aisatsuData, "Aisatsu පුහුණුව"));
document.getElementById("btn-learn-family").addEventListener("click", () => openLearnMode(familyData, "Kazoku පුහුණුව"));

document.getElementById("learn-home-btn").addEventListener("click", () => {
    learnScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
    mainBox.classList.add("glass-mode");
});

function loadLearnWord() {
    const word = learnData[learnIndex];
    learnCurrent.innerText = learnIndex + 1;
    
    let japText = word.japanese || word.kana;
    if (!japText && word.romaji) japText = convertToKana(word.romaji);
    
    learnJap.innerText = japText || "";
    learnRomaji.innerText = word.romaji || "";
    learnSin.innerText = word.sinhala || "";

    prevWordBtn.disabled = learnIndex === 0;
    nextWordBtn.disabled = learnIndex === learnData.length - 1;
}

nextWordBtn.addEventListener("click", () => {
    if (learnIndex < learnData.length - 1) { learnIndex++; loadLearnWord(); }
});

prevWordBtn.addEventListener("click", () => {
    if (learnIndex > 0) { learnIndex--; loadLearnWord(); }
});

document.getElementById("learn-speak-btn").addEventListener("click", () => {
    const word = learnData[learnIndex];
    let textToSpeak = word.japanese || word.kana;
    if (!textToSpeak && word.romaji) textToSpeak = convertToKana(word.romaji);
    
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel(); 
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.lang = 'ja-JP';
        if (japVoice) utterance.voice = japVoice;
        utterance.rate = 0.85; 
        utterance.pitch = 1.1; 
        window.speechSynthesis.speak(utterance);
    }
});

// ----------------------------------------------------
// Quiz Mode (Aisatsu, Hiragana & Family)
// ----------------------------------------------------
document.getElementById("btn-aisatsu").addEventListener("click", () => startQuiz("aisatsu"));
document.getElementById("btn-family").addEventListener("click", () => startQuiz("family"));
document.getElementById("btn-hiragana").addEventListener("click", () => startQuiz("hiragana"));

document.getElementById("restart-btn").addEventListener("click", () => {
    resultScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
    mainBox.classList.add("glass-mode");
});

function startQuiz(type) {
    score = 0;
    currentQuestionIndex = 0;
    currentQuizType = type;
    
    let dataSource = [];
    if (type === "aisatsu") dataSource = aisatsuData;
    else if (type === "family") dataSource = familyData;
    else dataSource = hiraganaData;

    quizQuestions = [...dataSource].sort(() => Math.random() - 0.5);
    totalDisplay.innerText = quizQuestions.length;

    if (type === "aisatsu") {
        quizTitle.innerText = "Aisatsu (ආචාර සමාචාර)";
        quizInstruction.innerText = "සිංහල තේරුමට ගැලපෙන ජපන් වචනය තෝරන්න:";
    } else if (type === "family") {
        quizTitle.innerText = "Kazoku (පවුලේ අය)";
        quizInstruction.innerText = "සිංහල තේරුමට ගැලපෙන ජපන් වචනය තෝරන්න:";
    } else {
        quizTitle.innerText = "Hiragana (හිරගනා)";
        quizInstruction.innerText = "ඉංග්‍රීසි අකුරට ගැලපෙන හිරගනා අකුර තෝරන්න:";
    }

    homeScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");
    mainBox.classList.remove("glass-mode");

    loadQuestion();
}

function getOptions(correctAnswer, dataSource, answerKey) {
    let options = [correctAnswer];
    while (options.length < 4) {
        let randomItem = dataSource[Math.floor(Math.random() * dataSource.length)];
        let randomOption = randomItem[answerKey];
        if (!options.includes(randomOption)) options.push(randomOption);
    }
    return options.sort(() => Math.random() - 0.5); 
}

function loadQuestion() {
    optionsContainer.innerHTML = "";
    nextBtn.classList.add("hidden");
    currentQDisplay.innerText = currentQuestionIndex + 1;

    const currentQ = quizQuestions[currentQuestionIndex];
    let questionString = "";
    let correctAnswer = "";
    let answerKey = "";
    
    let dataSource = [];
    if (currentQuizType === "aisatsu") dataSource = aisatsuData;
    else if (currentQuizType === "family") dataSource = familyData;
    else dataSource = hiraganaData;

    if (currentQuizType === "aisatsu" || currentQuizType === "family") {
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

    if (selectedAnswer === correctAnswer) {
        selectedButton.classList.add("correct");
        score++;
    } else {
        selectedButton.classList.add("wrong");
        buttons.forEach(btn => {
            if (btn.innerText === correctAnswer) btn.classList.add("correct");
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

modalCancelBtn.addEventListener("click", () => customModal.classList.add("hidden"));

modalOkBtn.addEventListener("click", () => {
    customModal.classList.add("hidden");
    quizScreen.classList.add("hidden");
    homeScreen.classList.remove("hidden");
    mainBox.classList.add("glass-mode");
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