const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreDisplay = document.getElementById('score');
const maxScoreDisplay = document.getElementById('maxScore');
const gameOverPanel = document.getElementById('gameOver');
const countDown = document.getElementById('countDown');
const playAgainBtn = document.getElementById('playAgainBtn');

const gridSize = 50;
const canvasSize = 600;
let snake = [{ x: gridSize * 5, y: gridSize * 5, direction: 'RIGHT' }];
let direction = 'RIGHT';
let food = { x: gridSize * 10, y: gridSize * 10 };
let gameInterval;
let score = 0;
let speed = 80;
let maxScore = 0;
const snakeImageLeft = new Image();
snakeImageLeft.src = './images/snake-body-left.png';
const snakeImageRight = new Image();
snakeImageRight.src = './images/snake-body-right.png';
let snakeSide = false;
const snakeHeadImage = new Image();
snakeHeadImage.src = './images/snake-head.png';
let isSnakeHead = true;
const snakeTailImage = new Image();
snakeTailImage.src = './images/snake-tail.png';
let isSnakeTail = false;

const appleImg = new Image();
appleImg.src = './images/apple.png';

const snakeHeadMainImage = new Image();
snakeHeadMainImage.src = './images/snake-head-main.png';


function startCountdown() {
    countDown.style.display = 'block';
    let countdownNumbers = [3, 2, 1, 0];
    let currentIndex = 0;

    function showNextNumber() {
        if (currentIndex < countdownNumbers.length) {
            // countDown.textContent = countdownNumbers[currentIndex];
            if (countdownNumbers[currentIndex] === 0) {
                countDown.innerHTML = '';
                const img = new Image();
                img.src = snakeHeadMainImage.src;
                img.style.width = '100px'; 
                img.style.height = 'auto'; 
                img.style.display = 'block';
                countDown.appendChild(img);
                
            } else {
                countDown.textContent = countdownNumbers[currentIndex];
            }
            countDown.classList.remove('hidden');
            countDown.classList.add('show');
            setTimeout(() => {
                // countDown.classList.add('hidden');
                countDown.classList.remove('show');
                currentIndex++;
                setTimeout(showNextNumber, 100); 
            }, 1000); 
        } else {
            countDown.style.display = 'none';
            startGame(); 
        }
    }

    showNextNumber();
}




canvas.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
});

canvas.addEventListener('touchmove', function(e) {
    let endX = e.touches[0].clientX;
    let endY = e.touches[0].clientY;
    
    let dx = endX - startX;
    let dy = endY - startY;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
            direction = 'RIGHT';
        } else {
            direction = 'LEFT';
        }
    } else {
        if (dy > 0) {
            direction = 'DOWN';
        } else {
            direction = 'UP';
        }
    }

    startX = endX;
    startY = endY;
});
// function drawRect(x, y, color) {
//     ctx.fillStyle = color;
//     ctx.fillRect(x, y, gridSize, gridSize);
// }

function drawFood(x, y) {
    ctx.save();
    ctx.translate(x + gridSize / 2, y + gridSize / 2);
    ctx.drawImage(appleImg, -gridSize / 2, -gridSize / 2, gridSize, gridSize);
    ctx.restore();
    // ctx.fillStyle = color;
    // ctx.beginPath();
    // ctx.arc(x + gridSize / 2, y + gridSize / 2, gridSize / 2, 0, Math.PI * 2);
    // ctx.fill();
}
function drawImage(x, y, segmentDirection) {
    ctx.save();
    ctx.translate(x + gridSize / 2, y + gridSize / 2);
    switch (segmentDirection) {
        case 'UP':
            ctx.rotate(-Math.PI / 2);
            break;
        case 'DOWN':
            ctx.rotate(Math.PI / 2);
            break;
        case 'LEFT':
            ctx.rotate(Math.PI);
            break;
        case 'RIGHT':
            // No rotation needed for right direction
            break;
    }
    if(isSnakeHead){
        ctx.drawImage(snakeHeadImage, -gridSize / 2, -gridSize / 2, gridSize, gridSize);
    } else if (isSnakeTail) {
        ctx.drawImage(snakeTailImage, -gridSize / 2, -gridSize / 2, gridSize, gridSize);
    } else if (snakeSide) {
        ctx.drawImage(snakeImageLeft, -gridSize / 2, -gridSize / 2, gridSize, gridSize);
    } else {
        ctx.drawImage(snakeImageRight, -gridSize / 2, -gridSize / 2, gridSize, gridSize);
    }
    ctx.restore();
    snakeSide = !snakeSide;
    isSnakeHead = false;
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

    isSnakeHead = true;
    // Draw snake
    // snake.forEach(segment => drawImage(segment.x, segment.y));
    snake.forEach((segment, index) => {
        if (index === snake.length - 1) {
            isSnakeTail = true;
        } else {
            isSnakeTail = false;
        }
        drawImage(segment.x, segment.y, segment.direction);
    });

    // Draw food
    drawFood(food.x, food.y);
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

    head.direction = direction;
    snake.unshift(head);

    for (let i = 1; i < snake.length; i++) {
        snake[i].direction = snake[i - 1].direction;
    }

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
        snake.direction = direction;
    } else if ((key === 38 || key === 87) && direction !== 'DOWN') {
        direction = 'UP';
        snake.direction = direction;
    } else if ((key === 39 || key === 68) && direction !== 'LEFT') {
        direction = 'RIGHT';
        snake.direction = direction;
    } else if ((key === 40 || key === 83) && direction !== 'UP') {
        direction = 'DOWN';
        snake.direction = direction;
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
    snake = [{ x: gridSize * 5, y: gridSize * 5, direction: 'RIGHT' }];
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
    snake = [{ x: gridSize * 5, y: gridSize * 5, direction: 'RIGHT' }];
    direction = 'RIGHT';
    placeFood();
    gameOverPanel.classList.add('hidden');
    gameOverPanel.classList.remove('block');
    // gameInterval = setInterval(gameLoop, speed);
    if (gameInterval) {
        clearInterval(gameInterval);
    }
}

startGame();

playAgainBtn.addEventListener('click', function() {
    resetGame();
    startCountdown();
});

// To make it responsive
window.addEventListener('resize', () => {
    canvasSize = Math.min(window.innerWidth * 0.9, 600);
    canvas.width = canvasSize;
    canvas.height = canvasSize;
});