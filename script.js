const canvas = document.getElementById('game')
const ctx = canvas.getContext('2d')
const box = 20
const canvasSize = 20 // 20x20 blocos
let snake
let food
let direction
let score

function startGame() {
  snake = [{ x: 10, y: 10 }]
  direction = 'RIGHT'
  food = spawnFood()
  score = 0
  document.getElementById('score').textContent = `Pontuação: ${score}`

  if (typeof gameLoop !== 'undefined') clearInterval(gameLoop)
  gameLoop = setInterval(draw, 150)
}

function spawnFood() {
  return {
    x: Math.floor(Math.random() * canvasSize),
    y: Math.floor(Math.random() * canvasSize),
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowUp' && direction !== 'DOWN') direction = 'UP'
  if (e.key === 'ArrowDown' && direction !== 'UP') direction = 'DOWN'
  if (e.key === 'ArrowLeft' && direction !== 'RIGHT') direction = 'LEFT'
  if (e.key === 'ArrowRight' && direction !== 'LEFT') direction = 'RIGHT'
})

function draw() {
  ctx.fillStyle = '#222'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // Desenha a cobra
  for (let part of snake) {
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(part.x * box, part.y * box, box - 1, box - 1)
  }

  // Desenha a comida
  ctx.fillStyle = 'red'
  ctx.fillRect(food.x * box, food.y * box, box - 1, box - 1)

  // Move a cobra
  let head = { ...snake[0] }
  if (direction === 'UP') head.y -= 1
  if (direction === 'DOWN') head.y += 1
  if (direction === 'LEFT') head.x -= 1
  if (direction === 'RIGHT') head.x += 1

  // Verifica colisões
  if (
    head.x < 0 ||
    head.x >= canvasSize ||
    head.y < 0 ||
    head.y >= canvasSize ||
    snake.some((segment) => segment.x === head.x && segment.y === head.y)
  ) {
    clearInterval(gameLoop)
    alert('💀 Fim de jogo! Sua pontuação foi: ' + score)
    return
  }

  snake.unshift(head)

  // Verifica se comeu a comida
  if (head.x === food.x && head.y === food.y) {
    score += 1
    document.getElementById('score').textContent = `Pontuação: ${score}`
    food = spawnFood()
  } else {
    snake.pop()
  }
}
