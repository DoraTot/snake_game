const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const maxScoreDisplay = document.getElementById('maxScore');
const gameOverPanel = document.getElementById('gameOver');


const gridSize = 30;
const canvasSize = 600;
let snake = [{ x: gridSize * 5, y: gridSize * 5 }];
let direction = 'RIGHT';
let food = { x: gridSize * 10, y: gridSize * 10 };
let gameInterval;
let score = 0;
let speed = 80;
let maxScore = 0;


// function drawRect(x, y, color) {
//     ctx.fillStyle = color;
//     ctx.fillRect(x, y, gridSize, gridSize);
// }

function drawCircle(x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x + gridSize / 2, y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
    ctx.fill();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function placeFood() {
    food.x = Math.floor(Math.random() * canvasSize / gridSize) * gridSize;
    food.y = Math.floor(Math.random() * canvasSize / gridSize) * gridSize;
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
    

}

function draw() {
    clearCanvas();

    // Draw snake
    snake.forEach(segment => drawCircle(segment.x, segment.y, '#FFBE0B'));

    // Draw food
    drawCircle(food.x, food.y, '#F26419');
}

function moveSnake() {
    let head = { ...snake[0] };

    switch (direction) {
        case 'UP':
            head.y -= gridSize;
            break;
        case 'DOWN':
            head.y += gridSize;
            break;
        case 'LEFT':
            head.x -= gridSize;
            break;
        case 'RIGHT':
            head.x += gridSize;
            break;
    }

    snake.unshift(head);

    // Check for food collision
    if (head.x === food.x && head.y === food.y) {
        placeFood();
        score++;
        updateScore();
        setMaxScore(score);
        clearInterval(gameInterval);
        speed *= 0.95; // Increase speed
        gameInterval = setInterval(gameLoop, speed);
    } else {
        snake.pop();
    }

    // Check for wall collision
    if (head.x < 0 || head.x >= canvasSize || head.y < 0 || head.y >= canvasSize) {
        clearInterval(gameInterval);
        stopGame();
    }

    // Check for self collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            clearInterval(gameInterval);
            stopGame();
        }
    }
}

function changeDirection(event) {
    const key = event.keyCode;

    if ((key === 37 || key === 65) && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if ((key === 38 || key === 87) && direction !== 'DOWN') {
        direction = 'UP';
    } else if ((key === 39 || key === 68) && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if ((key === 40 || key === 83) && direction !== 'UP') {
        direction = 'DOWN';
    }
}

function setMaxScore(newMax){
    if(maxScore < newMax){
        maxScore = newMax;

    }
    maxScoreDisplay.textContent = `Max Score: ${maxScore}`;
}

document.addEventListener('keydown', changeDirection);

function gameLoop() {
    moveSnake();
    draw();
}

function stopGame(){
    gameOverPanel.classList.remove('hidden');
    gameOverPanel.classList.add('block');

}

function startGame() {
    score = 0;
    speed = 100;
    updateScore();
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    direction = 'RIGHT';
    placeFood();
    gameOverPanel.classList.add('hidden');
    gameOverPanel.classList.remove('block');
    gameInterval = setInterval(gameLoop, speed);
}

function resetGame() {
    score = 0;
    speed = 100;
    updateScore();
    snake = [{ x: gridSize * 5, y: gridSize * 5 }];
    direction = 'RIGHT';
    placeFood();
    gameOverPanel.classList.add('hidden');
    gameOverPanel.classList.remove('block');
    gameInterval = setInterval(gameLoop, speed);
}

startGame();


// To make it responsive
window.addEventListener('resize', () => {
    canvasSize = Math.min(window.innerWidth * 0.9, 600);
    canvas.width = canvasSize;
    canvas.height = canvasSize;
});