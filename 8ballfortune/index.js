const API_URL =
	"https://opentdb.com/api.php?amount=1&category=18&difficulty=easy&type=multiple";

const gameContent = document.querySelector(".game-content");
const qr = document.querySelector('.qr')
const question = document.querySelector(".question");
let ball = document.querySelector(".ball");
const hole1 = document.querySelector(".hole-1");
const answer1 = document.querySelector(".answer1");
const hole2 = document.querySelector(".hole-2");
const answer2 = document.querySelector(".answer2");
const hole3 = document.querySelector(".hole-3");
const answer3 = document.querySelector(".answer3");
const hole4 = document.querySelector(".hole-4");
const answer4 = document.querySelector(".answer4");

let windowWidth = window.innerWidth;
let windowHeight = window.innerHeight;

const holesArr = [hole1, hole2, hole3, hole4];
let answerChoices = [];
let correctAnswer = "";

const detectDeviceType = () =>{
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    ? 'Mobile'
    : 'Desktop';
}
if(detectDeviceType != 'Desktop'){
	qr.style.display = 'flex'
}

ball.style.top = "0px";
ball.style.left = "450px";

async function generateAPI() {
	try {
		const response = await axios.get(API_URL);
		return response.data.results[0];
	} catch (error) {
		console.error("Error fetching API:", error);
		throw error;
	}
}

function displayResult(isCorrect) {
	const resultText = isCorrect ? "CORRECT!" : "INCORRECT!";
	question.textContent = resultText;
	setTimeout(() => {
		window.location.reload();
	}, 1000);
}

function checkChoice() {
	const chosenAnswerIndex = holesArr.findIndex((hole) => {
		const ballLeft = parseInt(ball.style.left);
		const ballTop = parseInt(ball.style.top);
		const holeRect = hole.getBoundingClientRect();

		return (
			ballLeft > holeRect.left &&
			ballLeft < holeRect.right &&
			ballTop > holeRect.top &&
			ballTop < holeRect.bottom
		);
	});

	if (chosenAnswerIndex != -1) {
		const correctAnswerIndex = answerChoices.indexOf(correctAnswer) + 1;
		const isCorrect = chosenAnswerIndex + 1 === correctAnswerIndex;

		displayResult(isCorrect);
	}
}

async function showQuestion() {
	try {
		const data = await generateAPI();
		const decodedQuestion = decodeHtmlEntities(data.question);

		question.textContent = decodedQuestion;

		correctAnswer = decodeHtmlEntities(data.correct_answer);
		const incorrectAnswer1 = decodeHtmlEntities(data.incorrect_answers[0]);
		const incorrectAnswer2 = decodeHtmlEntities(data.incorrect_answers[1]);
		const incorrectAnswer3 = decodeHtmlEntities(data.incorrect_answers[2]);

		answerChoices = [
			correctAnswer,
			incorrectAnswer1,
			incorrectAnswer2,
			incorrectAnswer3,
		];

		for (let i = answerChoices.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[answerChoices[i], answerChoices[j]] = [
				answerChoices[j],
				answerChoices[i],
			];
		}

		[
			answer1.textContent,
			answer2.textContent,
			answer3.textContent,
			answer4.textContent,
		] = answerChoices;
	} catch (error) {
		console.error("Error showing question:", error);
	}
}

// Function to decode HTML entities
function decodeHtmlEntities(text) {
	const textArea = document.createElement("textarea");
	textArea.innerHTML = text;
	return textArea.value;
}

function handleOrientation(e) {
	let alpha = e.alpha;
	let beta = e.beta;
	let gamma = e.gamma;

	let ballLeft = parseInt(ball.style.left);
	let ballTop = parseInt(ball.style.top);

	if (beta < 0 && ballLeft > 0) {
		moveBallLeft();
	}

	if (beta > 0 && ballLeft < 815) {
		moveBallRight();
	}

	if (gamma < 0 && ballTop < window.innerHeight - 80) {
		moveBallBottom();
	}

	if (gamma > 0 && ballTop > 0) {
		moveBallTop();
	}

	checkChoice();
}

function moveBallRight() {
	let x = parseInt(ball.style.left);
	ball.style.left = `${x + 10}px`;
}

function moveBallLeft() {
	let x = parseInt(ball.style.left);
	ball.style.left = `${x - 10}px`;
}

function moveBallTop() {
	let y = parseInt(ball.style.top);
	ball.style.top = `${y - 10}px`;
}

function moveBallBottom() {
	let y = parseInt(ball.style.top);
	ball.style.top = `${y + 10}px`;
}

window.addEventListener("deviceorientation", handleOrientation);
showQuestion();
