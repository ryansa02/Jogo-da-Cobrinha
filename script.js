const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const box = 20
const canvasSize = 20

const menu = document.getElementById('menu')
const gameArea = document.getElementById('gameArea')
const gameOverScreen = document.getElementById('gameOver')
const finalScore = document.getElementById('finalScore')

const eatSound = document.getElementById('eatSound')
const gameOverSound = document.getElementById('gameOverSound')
const bgMusic = document.getElementById('bgMusic')

let snake
let food
let direction
let score
let highScore = localStorage.getItem('highScore') || 0
let gameLoop

document.getElementById('highscore').textContent = `Recorde: ${highScore}`

function toggleTheme() {
  document.body.classList.toggle('light')
}

function showMenu() {
  gameArea.classList.add('hidden')
  gameOverScreen.classList.add('hidden')
  menu.classList.remove('hidden')
  bgMusic.pause()
}

function setDirection(dir) {
  if (dir === 'UP' && direction !== 'DOWN') direction = 'UP'
  if (dir === 'DOWN' && direction !== 'UP') direction = 'DOWN'
  if (dir === 'LEFT' && direction !== 'RIGHT') direction = 'LEFT'
  if (dir === 'RIGHT' && direction !== 'LEFT') direction = 'RIGHT'
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP'
  if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN'
  if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT'
  if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT'
})

function startGame() {
  menu.classList.add('hidden')
  gameOverScreen.classList.add('hidden')
  gameArea.classList.remove('hidden')

  snake = [{ x: 10, y: 10 }]
  direction = 'RIGHT'
  food = spawnFood()
  score = 0
  updateScore()

  clearInterval(gameLoop)
  gameLoop = setInterval(draw, 150)

  bgMusic.currentTime = 0
  bgMusic.play()
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * canvasSize),
    y: Math.floor(Math.random() * canvasSize),
  }
}

function updateScore() {
  document.getElementById('score').textContent = `Pontuação: ${score}`
  document.getElementById('highscore').textContent = `Recorde: ${highScore}`
}

function draw() {
  ctx.fillStyle = '#222'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  snake.forEach((part) => {
    ctx.fillStyle = getComputedStyle(document.body).getPropertyValue(
      '--snake-color'
    )
    ctx.fillRect(part.x * box, part.y * box, box - 1, box - 1)
  })

  ctx.fillStyle = getComputedStyle(document.body).getPropertyValue(
    '--food-color'
  )
  ctx.fillRect(food.x * box, food.y * box, box - 1, box - 1)

  const head = { ...snake[0] }
  if (direction === 'UP') head.y -= 1
  if (direction === 'DOWN') head.y += 1
  if (direction === 'LEFT') head.x -= 1
  if (direction === 'RIGHT') head.x += 1

  if (
    head.x < 0 ||
    head.x >= canvasSize ||
    head.y < 0 ||
    head.y >= canvasSize ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver()
    return
  }

  snake.unshift(head)

  if (head.x === food.x && head.y === food.y) {
    eatSound.play()
    score += 1
    updateScore()
    food = spawnFood()
  } else {
    snake.pop()
  }
}

function gameOver() {
  clearInterval(gameLoop)
  gameOverSound.play()
  bgMusic.pause()

  if (score > highScore) {
    highScore = score
    localStorage.setItem('highScore', highScore)
  }

  finalScore.textContent = `Sua pontuação: ${score}`
  gameArea.classList.add('hidden')
  gameOverScreen.classList.remove('hidden')
  updateScore()
}
