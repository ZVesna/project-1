const grid = document.querySelector('.grid')
const minesLeft = document.querySelector('.counter')
const start = document.querySelector('button')
const timer = document.querySelector('.timer')
const width = 9
const cells = []
let isGameOver = false
let found = 0
let timerOn = false
timer.innerHTML = '000'
let timerId = 0
//const showAlert = document.querySelector('.alert').style.display = 'none'



// ? create a board
for (let i = 0; i < width * width; i++) {
  const cell = document.createElement('div')
  cell.setAttribute('id', i)
  grid.appendChild(cell)
  cells.push(cell)
  cell.style.width = `${100 / width}%`
  cell.style.height = `${100 / width}%`

  // ? to prevent right click from defaul behaviuor
  cell.addEventListener('contextmenu', (e) => {
    e.preventDefault()
  })

  // ? addEventListener for left and right click
  cell.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
      if (timerOn === false) {
        timerOn = true
        setTimer()
      }
      click(cell)
      
    } else if (e.button === 2) {
      mineFound(cell)
    }
  })
}

// ? use the random generated index to grab particular cell
// ? and place a mine by adding class .mine to it
function addRandomMines() {
  let mineCount = 10
  minesLeft.innerHTML = 10 
  
  while (mineCount > 0) {
    const randomIndex = Math.floor(Math.random() * cells.length)
    const minePosition = cells[randomIndex] // keep const for minePosition
    if (minePosition.classList.contains('mine')) {
      continue
    } else {
      minePosition.classList.add('mine')
      mineCount -= 1
    } 
  }

  cells.forEach(cell => {
    if (!cell.classList.contains('mine')) {
      cell.classList.add('valid')
    }
  })

  countMinesAround()
}

// ? remove all classes and update parameters for the new game
function removeMines() {
  cells.forEach((cell) => {
    cell.className = ''
    cell.innerHTML = ''
    isGameOver = false
    found = 0
    minesLeft.innerHTML = 10
    timerOn = false
    timer.innerHTML = '000'
    clearInterval(timerId)
  })
}

function setTimer() {
  if (timerOn) {
    timer.innerHTML = '000'
    timerId = setInterval(() => {
      timer.innerHTML = Number(timer.innerHTML) + 1
      if (Number(timer.innerHTML) > 999) {
        timer.innerHTML = '999'
      }
    }, 1000)
  }
}

// ? right click - flags the mine
function mineFound(cell) {
  const mineCount = 10
  minesLeft.innerHTML = 10
  if (isGameOver) return
  if (!cell.classList.contains('checked') && (found < mineCount)) {
    if (!cell.classList.contains('flag')) {
      cell.classList.add('flag')
      cell.innerHTML = '🍄'
      found ++
      minesLeft.innerHTML = mineCount - found
      checkWin()
    } else {
      cell.classList.remove('flag')
      cell.innerHTML = ''
      found --
      minesLeft.innerHTML = mineCount - found
    }
  }
}

// ? left click - opens the cell
function click(cell) {
  const currentId = cell.id

  if (isGameOver) return
  if (cell.classList.contains('checked') || cell.classList.contains('flag')) return
  if (cell.classList.contains('mine')) {
    gameOver(cell)
  } else {
    const value = Number(cell.getAttribute('data'))
    if (value !== 0) {
      cell.classList.add('checked')
      cell.innerHTML = value
      if (value === 1) cell.classList.add('one')
      if (value === 2) cell.classList.add('two')
      if (value === 3) cell.classList.add('three')
      if (value === 4) cell.classList.add('four')
      if (value === 5) cell.classList.add('five')
      if (value === 6) cell.classList.add('six')
      if (value === 7) cell.classList.add('seven')
      if (value === 8) cell.classList.add('eight')
      return
    }
    checkCell(cell, currentId)
  }
  cell.classList.add('checked')
}

// ? function that will check cell position and count mines around each cell
function countMinesAround() {
  for (let i = 0; i < cells.length; i++) {
    let count = 0
    const isLeft = (i % width === 0)
    const isRight = (i % width === width - 1)

    if (!cells[i].classList.contains('mine')) {
      if (i > 0 && !isLeft && cells[i - 1].classList.contains('mine')) count ++
      if (i > 8 && !isRight && cells[i + 1 - width].classList.contains('mine')) count ++
      if (i >= 9 && cells[i - width].classList.contains('mine')) count ++
      if (i > 10 && !isLeft && cells[i - 1 - width].classList.contains('mine')) count ++
      if (i < 80 && !isRight && cells[i + 1].classList.contains('mine')) count ++
      if (i < 72 && !isLeft && cells[i - 1 + width].classList.contains('mine')) count ++
      if (i < 71 && !isRight && cells[i + 1 + width].classList.contains('mine')) count ++
      if (i <= 71 && cells[i + width].classList.contains('mine')) count ++
      cells[i].setAttribute('data', count)
    }
  }
}

// ? refactoring in order to count mines for the whole board
function checkCell(cell, currentId) {
  const isLeft = (currentId % width === 0)
  const isRight = (currentId % width === width - 1)

  setTimeout(() => {
    if (currentId > 0 && !isLeft) {
      const newId = cells[parseInt(currentId) - 1].id
      const newCell = document.getElementById(newId)
      click(newCell)
    }
    if (currentId > 8 && !isRight) {
      const newId = cells[parseInt(currentId) + 1 - width].id
      const newCell = document.getElementById(newId)
      click(newCell)
    }
    if (currentId >= 9) {
      const newId = cells[parseInt(currentId - width)].id
      const newCell = document.getElementById(newId)
      click(newCell)
    }
    if (currentId > 10 && !isLeft) {
      const newId = cells[parseInt(currentId) - 1 - width].id
      const newCell = document.getElementById(newId)
      click(newCell)
    }
    if (currentId < 80 && !isRight) {
      const newId = cells[parseInt(currentId) + 1].id
      const newCell = document.getElementById(newId)
      click(newCell)
    }
    if (currentId < 72 && !isLeft) {
      const newId = cells[parseInt(currentId) - 1 + width].id
      const newCell = document.getElementById(newId)
      click(newCell)
    }
    if (currentId < 71 && !isRight) {
      const newId = cells[parseInt(currentId) + 1 + width].id
      const newCell = document.getElementById(newId)
      click(newCell)
    }
    if (currentId <= 71) {
      const newId = cells[parseInt(currentId) + width].id
      const newCell = document.getElementById(newId)
      click(newCell)
    }
  }, 10)
}

// ? game over
function gameOver() {
  isGameOver = true
  clearInterval(timerId)

  // ? show all the bombs
  cells.forEach(cell => {
    if (cell.classList.contains('mine') && !cell.classList.contains('flag')) {
      cell.innerHTML = '🤢'
      cell.classList.remove('mine')
      cell.classList.add('checked')
    }
  })
}

function checkWin() {
  let matches = 0
  const mineCount = 10

  for (let i = 0; i < cells.length; i++) {
    if (cells[i].classList.contains('flag') && cells[i].classList.contains('mine')) {
      matches ++
    }
    if (matches === mineCount && i === cells.length - 1) {
      // ! condition
      console.log('win')
      clearInterval(timerId)
      //showAlert.style.display = 'block'
    }
  }
}

const playerTimes = []
const timesList = document.querySelector('ol')
const addTime = document.querySelector('p')

addTime.addEventListener('click', () => {
  const newName = prompt('Enter your name: ')
  const newTime = Number(prompt('Enter your time: '))
  const player = { name: newName, time: newTime }
  playerTimes.push(player)
  orderAndDisplayScores()
})

function orderAndDisplayScores() {
  // ? take the times
  const array = playerTimes
    // ? sort by ascending order
    .sort((playerA, playerB) => playerA.time - playerB.time)
    .map(player => {
      return `<li>
        ${player.name} has ${player.time}
      </li>`
    })
  timesList.innerHTML = array.join('')
}




// ? Function has to be called every time page reloads or player presses Start button
addRandomMines()

start.addEventListener('click', () => {
  removeMines()
  addRandomMines()
})