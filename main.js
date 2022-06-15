// [Quiz App Project]

// Select Elemnts
let quesConut = document.querySelector(".quiz-info .count span");

let quizArea = document.querySelector(".quiz-area");

let ansewrsContainer = document.querySelector(".ansewrs-container");

let submitBtn = document.querySelector(".quiz-app .submit-btn");

// Set Option
let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;

let bullets = document.querySelector(".bullets");

// Access To Results Div
let quizResults = document.querySelector(".quiz-app .results");

let countDownElement = document.querySelector(".conut-down");


// [1] Create Get Questions Function
function getQuestions() {

    let myRequest = new XMLHttpRequest();

    myRequest.onload = function () {
        if (this.readyState == 4 && this.status == 200) {

            // Convert JSON Object To JS Object
            let questionsObj = JSON.parse(this.responseText);

            // Questions Count
            let questionsCount = questionsObj.length;

            // Run Create Bullets Fun + Set Questions Count
            createBullets (
                document.querySelector(".bullets .spans"),
                questionsCount // => num Pram
            );

            // Run Add Questions Data Fun
            addQuestionsData(questionsObj[currentIndex], questionsCount);

            // Run countDown Function
            countDown(90, questionsCount);

            // addEventListener(Click) To submitBtn
            submitBtn.addEventListener("click", _ => {
                // Get Right Answer
                let rightAnswer = questionsObj[currentIndex].right_answer;

                // increase currentIndex By One
                currentIndex++;

                // Run Check Answers Fun
                checkAnswers(rightAnswer, questionsCount);

                // Remove Previous Question
                quizArea.innerHTML = "";
                ansewrsContainer.innerHTML = "";

                // Run Add Questions Data Fun And Get Next Question
                addQuestionsData(questionsObj[currentIndex], questionsCount);

                // Handel Bullets Function
                handelBullets();
                
                // Run countDown Function
                clearInterval(countDownInterval);
                countDown(90, questionsCount);

                // Run showResults Function
                showResults(questionsCount);

            });
        };
    };

    myRequest.open("GET", "html_questions.json", true);

    myRequest.send();
};

getQuestions();


// [2] Create Bullets Function
function createBullets(spansContainer = "Unknown", num) {
    // quesConut = num param
    quesConut.innerText = num;

    // Looping On Count Of num(Questions Count)
    for (let i = 0; i < num; i++) {

        // Create Bullet (Span)
        let bullet = document.createElement("span");

        // Check its if First Span
        if (i === 0) {
            bullet.className = "active";
        };

        // Append Bullet To Bullet Container(spans)
        spansContainer.appendChild(bullet);
    };
};


// [3] Create Add Quistions Data Function
function addQuestionsData(questionsData, count) {

    if (currentIndex < count) {
        // Get Key Title From Question Object
        let title = questionsData.title;

        // Create h3 Question Title
        let questionTitle = document.createElement("h3");
        questionTitle.className = "question-title";

        // Create Question Title Text
        let questionText = document.createTextNode(title);

        // append questionText To questionTitle
        questionTitle.appendChild(questionText);

        // Append questionTitle To quizBody
        quizArea.appendChild(questionTitle);

        // Create The Answers Divs
        for (let i = 1; i <= 4; i++) {
            // Create Answer(main Div)
            let answer = document.createElement("div");
            answer.className = "ansewr";

            // Create Radio Input
            let radioInput = document.createElement("input");
            // Set name Attribute To Input
            radioInput.name = "question";
            // Set Type Attribute To Input
            radioInput.type = "radio";
            // Set radioInput Id
            radioInput.id = `answer_${i}`;
            // Qustom Data Att
            radioInput.dataset.answer = questionsData[`answer_${i}`];

            // Make First Option Selected
            if (i === 1) {
                radioInput.checked = true;
            }

            // Append Radio Input To Answer(Div)
            answer.appendChild(radioInput);

            // Create Label
            let label = document.createElement("label");
            // Set For Attribute To label
            label.htmlFor = `answer_${i}`;

            // Create Label Text
            let labelText = document.createTextNode(questionsData[`answer_${i}`]);

            // Append Label Text To Label
            label.appendChild(labelText);

            // Append Label To Answer Div
            answer.appendChild(label);
            
            // Append Answer Div To ansewrsContainer
            ansewrsContainer.appendChild(answer);
        };
    };
};


// [4] Create Check Answers Function
function checkAnswers(rAnswer, count) {

    // The Choosen Answer
    let theChoosenAnswer;

    // Select All Aswers
    let answers = document.getElementsByName("question");

    // Looping On All inputs
    answers.forEach(answer => {

        if (answer.checked) {
            theChoosenAnswer = answer.dataset.answer;
        };
    });
    

    if (rAnswer === theChoosenAnswer) {
        // increase rightAnswers By One
        rightAnswers++;
    };
};


// [5] Create Handel Bullets Function
function handelBullets() {

    // Access To All Billet (Span)
    let bullets = document.querySelectorAll(".spans span");

    // Looping On bullets
    bullets.forEach((bullet, index) => {

        currentIndex === index ?
        bullet.classList.add("active") :
        bullet.classList.remove("active");
    });
};


// [6] Create Show Results Function
function showResults(count) {
    let theResult;

    // if Questions is Finshed
    if (currentIndex === count) {
        // Remove Elments
        quizArea.remove();
        ansewrsContainer.remove();
        submitBtn.remove();
        bullets.remove();

        if (rightAnswers > (count / 2) && rightAnswers < count) {
            theResult = `
            <strong>good</strong>
            <span class="good">you answered ${rightAnswers} From ${count}</span>
            `;

        } else if (rightAnswers === count) {
            theResult = `
            <strong>perfect</strong>
            <span class="perfect">you answered ${rightAnswers} From ${count}</span>
            `;

        } else if (rightAnswers === (count / 2)) {
            theResult = `
            <strong>acceptable</strong>
            <span class="acceptable">you answered ${rightAnswers} From ${count}</span>
            `;

        } else {
            theResult = `
            <strong>bad</strong>
            <span class="bad">you answered ${rightAnswers} From ${count}</span>
            `;
        };

        quizResults.innerHTML = theResult;

        // Add Show Class To results Div
        quizResults.classList.add("show");

    };
};


// [7] Create countDown Function
function countDown(duration, count) {

    if (currentIndex < count) {

        let minutes, seconds;

        countDownInterval = setInterval( _ => {

            // duration = 90 Seconds

            // duration / 60 = 1.5 minute And Get 1 minute
            minutes = parseInt(duration / 60);
            // duration % 60 = 30 Second
            seconds = parseInt(duration % 60);

            minutes = minutes < 10 ? `0${minutes}` : minutes;
            seconds = seconds < 10 ? `0${seconds}` : seconds;
            
            countDownElement.innerHTML = `
                <span class="text">time left</span>
                <span class="minutes">${minutes}</span>
                <span class="seconds">${seconds}</span>
            `;

            // decrease duration By One && if duration < 0
            if (--duration < 0) {
                clearInterval(countDownInterval);

                // Automatic Click To Submit Btn
                submitBtn.click();
            };

        }, 1000);

    };
};