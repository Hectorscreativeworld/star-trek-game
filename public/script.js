// const icons = ['starShip1', 'starShip2', 'starShip3', 'starship4']
const images = [
  'Star_wars_1.png',
  'Star_wars_2.png',
  'Star_wars_3.png',
  'Star_wars_4.png'
]

const starTrekStart = document.querySelector('.starTrekShip-image')
const starWarsStart = document.querySelector('.starWarShip-image')
const gameOverEle = document.getElementById('gameOverEle')
const container = document.getElementById('container')
const box = document.querySelector('.box')
const base = document.querySelector('.base')
const dashboard = document.querySelector('.dashboard')
const scoreDash = document.querySelector('.scoreDash')
const progressBar = document.querySelector('.progress-bar')
const boxCenter = [
  box.offsetLeft + box.offsetWidth / 2,
  box.offsetTop + box.offsetHeight / 2
]
const bannerimage = document.querySelector('.banner-image')
const characterchoose = document.querySelector('.character-choose')
const ship = document.querySelector('.ship')

// var rect = box.getBoundingClientRect()
// console.log(rect)
let height = window.innerHeight
let width = window.innerWidth

let gamePlay = false
let player
let animateGame

starTrekStart.addEventListener('click', () => {
  ship.src = './images/StarTrek.png'
  startGame()
})

starWarsStart.addEventListener('click', () => {
  ship.src = './images/Star_wars_1.png'
  startGame()
})

container.addEventListener('mousedown', mouseDown)
container.addEventListener('mousemove', movePosition)

function startGame() {
  container.style.display = 'block'
  dashboard.style.display = 'block'

  bannerimage.style.display = 'none'
  characterchoose.style.display = 'none'
  gamePlay = true
  gameOverEle.style.display = 'none'
  player = {
    score: 0,
    barwidth: 500,
    lives: 100000
  }
  setupBadguys(15)
  animateGame = requestAnimationFrame(playGame)
}

function playGame() {
  if (gamePlay) {
    moveShots()
    updateDash()
    moveEnemy()
    animateGame = requestAnimationFrame(playGame)
  }
}

function movePosition(e) {
  let deg = getDeg(e)
  box.style.webkitTransform = 'rotate(' + deg + 'deg)'
  box.style.mozTransform = 'rotate(' + deg + 'deg)'
  box.style.msTransform = 'rotate(' + deg + 'deg)'
  box.style.oTransform = 'rotate(' + deg + 'deg)'
  box.style.transform = 'rotate(' + deg + 'deg)'
}

function moveEnemy() {
  let tempEnemy = document.querySelectorAll('.baddy')
  let hitter = false
  let tempShots = document.querySelectorAll('.fireme')
  for (let enemy of tempEnemy) {
    if (
      enemy.offsetTop > 550 ||
      enemy.offsetTop < 0 ||
      enemy.offsetLeft > 750 ||
      enemy.offsetLeft < 0
    ) {
      enemy.parentNode.removeChild(enemy)
      badmaker()
    } else {
      enemy.style.top = enemy.offsetTop + enemy.movery + 'px'
      enemy.style.left = enemy.offsetLeft + enemy.moverx + 'px'
      for (let shot of tempShots) {
        if (isCollide(shot, enemy) && gamePlay) {
          player.score += enemy.points
          enemy.parentNode.removeChild(enemy)
          shot.parentNode.removeChild(shot)
          updateDash()
          badmaker()
          break
        }
      }
    }
    if (isCollide(box, enemy)) {
      hitter = true
      player.lives--
      if (player.lives < 0) {
        gameOver()
      }
    }
  }
  if (hitter) {
    base.style.backgroundColor = 'red'
    hitter = false
  } else {
    base.style.backgroundColor = ''
  }
}

function gameOver() {
  cancelAnimationFrame(animateGame)
  gameOverEle.style.display = 'block'
  gameOverEle.querySelector('span').innerHTML =
    'GAME OVER<br>Your Score' + player.score
  gamePlay = false
  let tempEnemy = document.querySelectorAll('.baddy')
  for (let enemy of tempEnemy) {
    enemy.parentNode.removeChild(enemy)
  }
  let tempShots = document.querySelectorAll('.fireme')
  for (let shot of tempShots) {
    shot.parentNode.removeChild(shot)
  }
}

function updateDash() {
  scoreDash.innerHTML = player.score
  let tempPer = (player.lives / player.barwidth) * 100 + '%'
  progressBar.style.width = tempPer
}

function isCollide(a, b) {
  let aRect = a.getBoundingClientRect()
  let bRect = b.getBoundingClientRect()
  return !(
    aRect.bottom < bRect.top ||
    aRect.top > bRect.bottom ||
    aRect.right < bRect.left ||
    aRect.left > bRect.right
  )
}

function getDeg(e) {
  let angle = Math.atan2(e.clientX - boxCenter[0], -(e.clientY - boxCenter[1]))
  return angle * (180 / Math.PI)
}

function degRad(deg) {
  return deg * (Math.PI / 180)
}

function mouseDown(e) {
  if (gamePlay) {
    let div = document.createElement('div')
    let deg = getDeg(e)
    div.setAttribute('class', 'fireme')
    div.moverx = 5 * Math.sin(degRad(deg))
    div.movery = -5 * Math.cos(degRad(deg))
    div.style.left = boxCenter[0] - 5 + 'px'
    div.style.top = boxCenter[1] - 5 + 'px'
    div.style.width = 10 + 'px'
    div.style.height = 10 + 'px'
    container.appendChild(div)
  }
}

function setupBadguys(num) {
  for (let x = 0; x < num; x++) {
    badmaker()
  }
}
function randomMe(num) {
  return Math.floor(Math.random() * num)
}

function badmaker() {
  let div = document.createElement('div')
  // let myIcon = 'fa-' + icons[randomMe(icons.length)];
  let imgPath = '/images/' + images[randomMe(images.length)]
  let x, y, xmove, ymove
  let randomStart = randomMe(4)
  let dirSet = randomMe(5) + 2
  let dirPos = randomMe(7) - 3

  switch (randomStart) {
    case 0:
      x = 0
      y = randomMe(height)
      ymove = dirPos
      xmove = dirSet
      break
    case 1:
      x = width
      y = randomMe(height)
      ymove = dirPos
      xmove = dirSet * -1
      break
    case 2:
      x = randomMe(width)
      y = 0
      ymove = dirSet
      xmove = dirPos
      break
    case 3:
      x = randomMe(width)
      y = height
      ymove = dirSet * -1
      xmove = dirPos
      break
  }
  // div.innerHTML = '<i class="fas ' + myIcon + '"></i>';
  div.innerHTML = '<img src="' + imgPath + '"></img>'
  div.setAttribute('class', 'baddy img')
  div.style.fontSize = randomMe(20) + 30 + 'px'
  div.style.left = x + 'px'
  div.style.top = y + 'px'
  div.points = randomMe(5) + 1
  div.moverx = xmove
  div.movery = ymove
  container.appendChild(div)
}

function moveShots() {
  let tempShots = document.querySelectorAll('.fireme')
  for (let shot of tempShots) {
    if (
      shot.offsetTop > height ||
      shot.offsetTop < 0 ||
      shot.offsetLeft > width ||
      shot.offsetLeft < 0
    ) {
      shot.parentNode.removeChild(shot)
    } else {
      shot.style.top = shot.offsetTop + shot.movery + 'px'
      shot.style.left = shot.offsetLeft + shot.moverx + 'px'
    }
  }
}
