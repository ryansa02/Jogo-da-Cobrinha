const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')

const box = 20
const canvasSize = 20
let snake = []
let direction = 'RIGHT'
let food
let score = 0
let highScore = localStorage.getItem('highScore') || 0
let game

const snakeColorPicker = document.getElementById('snakeColor')
const foodColorPicker = document.getElementById('foodColor')

const menu = document.getElementById('menu')
const gameArea = document.getElementById('gameArea')
const gameOverScreen = document.getElementById('gameOver')

document.getElementById('highscoreMenu').textContent = `Recorde: ${highScore}`
document.getElementById('highscoreGame').textContent = `Recorde: ${highScore}`

function setDirection(dir) {
  if (dir === 'UP' && direction !== 'DOWN') direction = 'UP'
  if (dir === 'DOWN' && direction !== 'UP') direction = 'DOWN'
  if (dir === 'LEFT' && direction !== 'RIGHT') direction = 'LEFT'
  if (dir === 'RIGHT' && direction !== 'LEFT') direction = 'RIGHT'
}

// Controle via teclado
document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp') setDirection('UP')
  if (e.key === 'ArrowDown') setDirection('DOWN')
  if (e.key === 'ArrowLeft') setDirection('LEFT')
  if (e.key === 'ArrowRight') setDirection('RIGHT')
})

// Controle via touch (swipe)
let touchStartX = 0
let touchStartY = 0

canvas.addEventListener('touchstart', (e) => {
  const touch = e.touches[0]
  touchStartX = touch.clientX
  touchStartY = touch.clientY
})

canvas.addEventListener('touchmove', (e) => {
  if (!touchStartX || !touchStartY) return

  const touch = e.touches[0]
  const diffX = touch.clientX - touchStartX
  const diffY = touch.clientY - touchStartY

  if (Math.abs(diffX) > Math.abs(diffY)) {
    if (diffX > 0) setDirection('RIGHT')
    else setDirection('LEFT')
  } else {
    if (diffY > 0) setDirection('DOWN')
    else setDirection('UP')
  }

  touchStartX = 0
  touchStartY = 0
})

function showMenu() {
  clearInterval(game)
  menu.classList.remove('hidden')
  gameArea.classList.add('hidden')
  gameOverScreen.classList.add('hidden')
  document.getElementById('highscoreMenu').textContent = `Recorde: ${highScore}`
}

function startGame() {
  snake = [{ x: 10, y: 10 }]
  direction = 'RIGHT'
  food = spawnFood()
  score = 0

  menu.classList.add('hidden')
  gameOverScreen.classList.add('hidden')
  gameArea.classList.remove('hidden')

  updateScore()

  clearInterval(game)
  game = setInterval(gameLoop, 150)
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * canvasSize),
    y: Math.floor(Math.random() * canvasSize),
  }
}

function updateScore() {
  document.getElementById('score').textContent = `Pontuação: ${score}`
  document.getElementById('highscoreGame').textContent = `Recorde: ${highScore}`
}

function gameLoop() {
  ctx.fillStyle = '#222'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  snake.forEach((part) => {
    ctx.fillStyle = snakeColorPicker.value
    ctx.fillRect(part.x * box, part.y * box, box - 1, box - 1)
  })

  ctx.fillStyle = foodColorPicker.value
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
    snake.some((seg) => seg.x === head.x && seg.y === head.y)
  ) {
    clearInterval(game)
    if (score > highScore) {
      highScore = score
      localStorage.setItem('highScore', highScore)
    }
    showGameOver()
    return
  }

  snake.unshift(head)

  if (head.x === food.x && head.y === food.y) {
    score++
    updateScore()
    food = spawnFood()
  } else {
    snake.pop()
  }
}

function showGameOver() {
  gameArea.classList.add('hidden')
  gameOverScreen.classList.remove('hidden')
  document.getElementById('finalScore').textContent = `Sua pontuação: ${score}`
  document.getElementById('recordScore').textContent = `Recorde: ${highScore}`
}
