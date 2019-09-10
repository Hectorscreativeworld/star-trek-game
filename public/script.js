// const icons = ['starShip1', 'starShip2', 'starShip3', 'starship4']
const starWarsImages = [
  'Star_wars_1.png',
  'Star_wars_2.png',
  'Star_wars_3.png',
  'Star_wars_4.png'
]

const starTrekImages = [
  'Bird_Icon.png',
  'Defient_Icons.png',
  'Enterprise_Icons.png',
  'Voyguer.png'
]

const starTrekStart = document.querySelector('#starTrekBtn')
const starWarsStart = document.querySelector('#starWarsBtn')
const gameOverEle = document.getElementById('gameOverEle')
const container = document.getElementById('container')
const box = document.querySelector('.box')
const base = document.querySelector('.base')
const dashboard = document.querySelector('.dashboard')
const scoreDash = document.querySelector('.scoreDash')
const progressBar = document.querySelector('.progress-bar')
const highscore = document.getElementById('high-score')
const nameForm = document.getElementById('nameEntry')
const submitButton = document.getElementById('submitBtn')
const playerNameInput = document.getElementById('playerName')

let boxCenter = []
let starTrekSong = []
let starTrekFire1 = []
let starWarsSong = []
let starWarsBlaster = []
let gameSong = []
let gameFire = []

let playerName = ''

function preload() {
  starTrekSong = new Audio('/sounds/NewStarTrekSong.mp3')
  starTrekFire1 = new Audio('/sounds/StarTrekFireFinal.mp3')
  starWarsSong = new Audio('/sounds/StarWarsSong.mp3')
  starWarsBlaster = new Audio('/sounds/StarWarsblaster.mp3')
}
preload()

const bannerimage = document.querySelector('.banner-image')
const characterchoose = document.querySelector('.character-choose')
const ship = document.querySelector('.ship')

let height = window.innerHeight
let width = window.innerWidth

let gamePlay = false
let playerShip = ''

let player
let animateGame

function handleNameEntry() {
  if (playerNameInput.value) {
    console.log(playerNameInput.value)
    console.log(player.score)
    nameForm.style.visibility = 'hidden'
    addScore(playerNameInput.value, player.score)
  }
}
starTrekStart.addEventListener('click', () => {
  ship.style.transform = 'none'
  ship.src = './images/StarTrek.png'
  playerShip = 'starTrek'
  gameSong = starTrekSong
  gameFire = starTrekFire1
  playerName = 'Spock'
  startGame()
})

starWarsStart.addEventListener('click', () => {
  ship.style.transform = 'rotate(-45deg)'
  playerShip = 'starWars'
  ship.src = './images/Star_wars_1.png'
  gameSong = starWarsSong
  gameFire = starWarsBlaster
  playerName = 'Seth'
  startGame()
})

container.addEventListener('mousedown', mouseDown)
container.addEventListener('mousemove', movePosition)

function startGame() {
  container.style.display = 'block'
  dashboard.style.display = 'block'
  gameSong.play()
  gameSong.loop = true
  boxCenter.push(
    box.offsetLeft + box.offsetWidth / 2,
    box.offsetTop + box.offsetHeight / 2
  )

  console.log(boxCenter)
  bannerimage.style.display = 'none'
  characterchoose.style.display = 'none'
  gamePlay = true
  gameOverEle.style.display = 'none'
  player = {
    score: 0,
    barwidth: 500,
    lives: 500
  }
  setupBadguys(10)
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

  box.style.transform = 'translate(-50%, -50%) rotate(' + deg + 'deg)'
}

function moveEnemy() {
  let tempEnemy = document.querySelectorAll('.baddy')
  let hitter = false
  let tempShots = document.querySelectorAll('.fireme')
  for (let enemy of tempEnemy) {
    if (
      enemy.offsetTop > height - 50 ||
      enemy.offsetTop < 0 ||
      enemy.offsetLeft > width - 50 ||
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
  // addScore('Seth', player.score)
  nameEntry.style.visibility = 'visible'
  try {
    gameSong.pause()
    gameSong.currentTime = 0
  } catch (error) {
    console.log(error)
  }
  cancelAnimationFrame(animateGame)
  gameOverEle.style.display = 'block'
  gameOverEle.querySelector('span').innerHTML =
    'GAME OVER<br>Your Score' + player.score
  container.style.display = 'none'
  dashboard.style.display = 'none'

  bannerimage.style.display = 'block'
  characterchoose.style.display = 'block'
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
  console.log(gamePlay, 'running')
  if (gamePlay) {
    gameFire.play()
    let div = document.createElement('div')
    let deg = getDeg(e)
    div.setAttribute('class', 'fireme')
    div.moverx = 5 * Math.sin(degRad(deg))
    div.movery = -5 * Math.cos(degRad(deg))
    div.style.left = boxCenter[0] - 45 + 'px'
    div.style.top = boxCenter[1] - 45 + 'px'
    div.style.width = 10 + 'px'
    div.style.height = 10 + 'px'
    console.log('what is this div', div)
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
  let imgPath
  // let myIcon = 'fa-' + icons[randomMe(icons.length)];
  if (playerShip === 'starTrek') {
    imgPath = '/images/' + starWarsImages[randomMe(starWarsImages.length)]
  } else {
    imgPath = '/images/' + starTrekImages[randomMe(starTrekImages.length)]
  }

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

//******HIGHSCORE******
let _db = null

function fireBaseSetup() {
  var firebaseConfig = {
    apiKey: 'AIzaSyAWX1peSMkWFwHTgIbfImMm7Q5HvwJxDyU',
    authDomain: 'startrekvsstarwars-a5d44.firebaseapp.com',
    databaseURL: 'https://startrekvsstarwars-a5d44.firebaseio.com',
    projectId: 'startrekvsstarwars-a5d44',
    storageBucket: 'startrekvsstarwars-a5d44.appspot.com',
    messagingSenderId: '812673557285',
    appId: '1:812673557285:web:2737a07f79955c07d0f0cc'
  }
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig)

  _db = firebase.firestore()
  const settings = { /* your settings... */ timestampsInSnapshots: true }
  _db.settings(settings)
}

fireBaseSetup()

function addScore(name, score) {
  //let scores = []
  let lowestScore = 0

  _db
    .collection('HighScores')
    .get()
    .then(function(snapshot) {
      if (snapshot.docs && snapshot.docs.length > 0) {
        lowestScore = snapshot.docs[0].data().score
      }
      let lowestKey = false

      snapshot.docs.forEach(function(doc) {
        let key = doc.id
        let data = doc.data()
        if (data.score < lowestScore) {
          lowestScore = data.score
          lowestKey = key
        }
      })

      if (score > lowestScore || snapshot.docs.length < 10) {
        console.log(`Score ${score} made the highscore list`)

        let i =
          snapshot.docs && snapshot.docs.length > 0 ? snapshot.docs.length : 0
        let isFull = false
        if (i > 9) {
          i = 9
          isFull = true
        }
        console.log(`Updating score_${i} ${name} ${score}`)
        if (isFull) {
          _db
            .collection('HighScores')
            .doc(`${lowestKey}`)
            .set({
              name,
              score
            })
        } else {
          _db
            .collection('HighScores')
            .doc(`score_${i}`)
            .set({
              name,
              score
            })
        }
      } else {
        console.log(`Score ${score} did not make the highscore list`)
      }
      displayScores()
    })
}

function displayScores() {
  let scores = []
  console.log('******SCORES**********')

  _db
    .collection('HighScores')
    .get()
    .then(function(snapshot) {
      snapshot.docs.forEach(function(doc) {
        let key = doc.key
        let data = doc.data()
        scores.push(data)
      })
      scores.sort((a, b) => {
        return b.score - a.score
      })

      scores.forEach(x => {
        console.log(`${x.name} ${x.score}`)
      })
      highscore.innerHTML = ''
      function createScoreList(newScores) {
        var ul = document.createElement('ul')
        ul.setAttribute('id', 'scoreList')

        document.getElementById('high-score').appendChild(ul)
        newScores.forEach(renderScores)

        function renderScores(element, index, arr) {
          var li = document.createElement('li')
          li.setAttribute('class', 'item')

          ul.appendChild(li)

          li.innerHTML = li.innerHTML + `${element.name}   ${element.score}`
        }
      }
      createScoreList(scores)
    })
}

displayScores()
