let countSpan = document.querySelector(".count span"),
    bullets = document.querySelector(".bullets"),
    bulletContainer = document.querySelector(".bullets .spans"),
    quizArea = document.querySelector(".quiz-area"),
    answersArea  = document.querySelector(".answers-area"),
    submitButton = document.querySelector(".submit-button"),
    resultsContainer = document.querySelector(".results"),
    countDownElement = document.querySelector(".countdown"); 

let currentIndex = 0,
    trueCount = 0 ,
    countDownInterval ;

function getQuestions(){
    let myReq = new XMLHttpRequest();
    myReq.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            let questionObject = JSON.parse(this.responseText),
                questionCount = questionObject.length;
                createBulltes(questionCount);
                addQuestionData(questionObject[currentIndex],questionCount);
                countDown(90,questionCount);
                submitButton.onclick = () => {
                    if(currentIndex < questionCount){
                    let TheRightAnswer = questionObject[currentIndex].right_answer;
                    currentIndex++;
                    checkAnswer(TheRightAnswer,questionCount);
                    quizArea.innerHTML = '';
                    answersArea.innerHTML = '';
                    addQuestionData(questionObject[currentIndex],questionCount);
                    handleBullets();
                    clearInterval(countDownInterval);
                    countDown(90,questionCount);
                    showResults(questionCount);
                    }
                }
        }
    }
    myReq.open("GET","js/html_questions.json",true);
    myReq.send();
}
getQuestions();
function createBulltes(num){
    countSpan.innerHTML = num;
    for(let i = 0 ; i < num; i++){
        let theBullet = document.createElement("span");
        bulletContainer.appendChild(theBullet);
        if(i === 0 ){
            theBullet.className = "on";   
        }
    } 
}
function addQuestionData(obj,count){
    if(currentIndex < count){
        let qTitle = document.createElement("h2"),
        questionText = document.createTextNode(obj[`title`]);
        qTitle.appendChild(questionText);
        quizArea.appendChild(qTitle);
        for(let i = 1 ; i < 5 ; i++){
            let answerDiv = document.createElement("div"),
            answerInput = document.createElement("input"),
            inputLabel = document.createElement("label"),
            labelText  = document.createTextNode(obj[`answer_${i}`]);
            answerDiv.className = "answer";
            answerInput.type = "radio";
            answerInput.name = "questions";
            answerInput.id = `answer_${i}`;
            answerInput.dataset.answer = obj[`answer_${i}`];
            inputLabel.htmlFor = `answer_${i}`;
            inputLabel.appendChild(labelText);
            answerDiv.appendChild(answerInput);
            answerDiv.appendChild(inputLabel);
            answersArea.appendChild(answerDiv);
            if (i === 1) {
                answerInput.checked = true;
            }
        }
    }
}
function checkAnswer(rightAns,count){
    let answers = document.getElementsByName("questions");
    for(let i = 0 ; i < answers.length ; i++){
        if(answers[i].checked === true){
            if(answers[i].dataset.answer === rightAns){
                trueCount++;
            }
        }
    }
}
function handleBullets(){
    let bulletsSpans = document.querySelectorAll(".bullets .spans span"),
        arrayOfSpans = Array.from(bulletsSpans);
        arrayOfSpans.forEach((span,index) =>{
            if(currentIndex === index){
                span.className = "on";
            }
        })
}
function showResults(count){
    let theResults;
    if(currentIndex === count){
        quizArea.remove(),answersArea.remove(),submitButton.remove(),bullets.remove();
        if (trueCount > count / 2 && trueCount < count) {
            theResults = `<span class="good">Good</span>, ${trueCount} From ${count}`;
          } else if (trueCount === count) {
            theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
          } else {
            theResults = `<span class="bad">Bad</span>, ${trueCount} From ${count}`;
          }
          resultsContainer.innerHTML = theResults;
    }
}
function countDown(duration,count){
    if(currentIndex < count){
        let minutes,seconds;
        countDownInterval = setInterval(()=>{
            minutes = parseInt(duration / 60);
            seconds = parseInt(duration % 60);
            minutes = minutes < 10 ?  `0${minutes}`: `${minutes}` ;
            seconds = seconds < 10 ?  `0${seconds}`: `${seconds}` ;
            countDownElement.innerHTML = `${minutes} : ${seconds}`;
            if(--duration < 0){
                clearInterval(countDownInterval);
                submitButton.click();
            }
        },1000)
    }
}