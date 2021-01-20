const grid = document.querySelector('.grid')
const start = document.querySelector('button')
const width = 9
const height = 9
const cells = []
let isGameOver = false
let found = 0
let minesLeft = 10



// ? Different width and height, for square cells -> 
// ? change .grid width and height in javascript!
// ! add these into functions to generate different size grids
// ! remove from css
// ? grid.style.width = '1000px' // outside the loop
// ? grid.style.height = '1000px'
// ? I can set variable for them as well
// ! What happens if I use this value instead of 300 below?



// ? Same width and height
for (let i = 0; i < width * height; i++) {
  const cell = document.createElement('div')
  cell.classList.add('cell')
  cell.setAttribute('id', i)
  grid.appendChild(cell)
  cells.push(cell)
  cell.innerHTML = i
  cell.style.width = `${100 / width}%`
  cell.style.height = `${100 / height}%`
  
  // ? to prevent right click from defaul behaviuor
  // ? (opening the drop down menu)
  cell.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    // this piece of code is enough for right click only
  })
  // ? addEventListener for left and right click - if statement
  cell.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
      click(cell)
    } else if (e.button === 2) {
      mineFound(cell)
    }
  })
}

// ? use the random generated index to grab particular cell
// ? and place a mine by adding class .mine to it
// ! mineCount to have different values
function addRandomMines() {
  let mineCount = 10
  
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

// ? removes .mine class for each cell that contains the class .mine
// ! create a const for the check if it is going to be used again
function removeMines() {
  cells.forEach(cell => {
    if (cell.classList.contains('mine')) {
      cell.classList.remove('mine')
    }  
  })
}

function mineFound(cell) {
  const mineCount = 10
  console.log(isGameOver)
  if (isGameOver) {
    return
  }
  if (!cell.classList.contains('checked') && (found < mineCount)) {
    if (!cell.classList.contains('flag')) {
      cell.classList.add('flag')
      cell.innerHTML = '🍄'
      found ++
      minesLeft.innerHTML = mineCount - found
      //checkForWin()
    } else {
      cell.classList.remove('flag')
      cell.innerHTML = ''
      found --
      minesLeft.innerHTML = mineCount - found
    }
  }
}

function click(cell) {
  const currentId = cell.id
  if (isGameOver) {
    return
  }
  if (cell.classList.contains('checked') || cell.classList.contains('flag')) {
    return
  }
  if (cell.classList.contains('mine')) {
    gameOver(cell)
  } else {
    const value = cell.getAttribute('data')
    if (value !== 0) {
      cell.classList.add('checked')
      if (value === 1) cell.classList.add('one')
      if (value === 2) cell.classList.add('two')
      if (value === 3) cell.classList.add('three')
      if (value === 4) cell.classList.add('four')
      if (value === 5) cell.classList.add('five')
      if (value === 6) cell.classList.add('six')
      if (value === 7) cell.classList.add('seven')
      if (value === 8) cell.classList.add('eight')
      cell.innerHTML = value
      return
    }
    checkCell(cell, currentId) // where to call this function?
  }
}

// ? function that will count the mines around each cell
function countMinesAround() {
  for (let i = 0; i < cells.length; i++) {
    let count = 0
    const isLeftEdge = (i % width === 0)
    const isRightEdge = (i % width === width - 1)

    if (!cells[i].classList.contains('mine')) {
      if (i > 0 && !isLeftEdge && cells[i - 1].classList.contains('mine')) count ++
      if (i > 8 && !isRightEdge && cells[i + 1 - width].classList.contains('mine')) count ++
      if (i > 9 && cells[i - width].classList.contains('mine')) count ++
      if (i > 10 && !isLeftEdge && cells[i - 1 - width].classList.contains('mine')) count ++
      if (i < 80 && !isRightEdge && cells[i + 1].classList.contains('mine')) count ++
      if (i < 72 && !isLeftEdge && cells[i - 1 + width].classList.contains('mine')) count ++
      if (i < 71 && !isRightEdge && cells[i + 1 + width].classList.contains('mine')) count ++
      if (i < 71 && cells[i + width].classList.contains('mine')) count ++
      cells[i].setAttribute('data', count)
    }
  }
}



function checkCell(cell, currentId) {
  const isLeftEdge = (currentId % width === 0)
  const isRightEdge = (currentId % width === width - 1)

  setTimeout(() => {
    if (currentId > 0 && !isLeftEdge) {
      const newId = cells[parseInt(currentId) - 1].id
      //const newId = parseInt(currentId) - 1   ....refactor
      const newCell = document.getElementById(newId)
      click(newCell)
    }
    if (currentId > 8 && !isRightEdge) {
      const newId = cells[parseInt(currentId) + 1 - width].id
      //const newId = parseInt(currentId) +1 -width   ....refactor
      const newCell = document.getElementById(newId)
      click(newCell)
    }
    if (currentId > 9) {
      const newId = cells[parseInt(currentId - width)].id
      //const newId = parseInt(currentId) -width   ....refactor
      const newCell = document.getElementById(newId)
      click(newCell)
    }
    if (currentId > 10 && !isLeftEdge) {
      const newId = cells[parseInt(currentId) - 1 - width].id
      //const newId = parseInt(currentId) -1 -width   ....refactor
      const newCell = document.getElementById(newId)
      click(newCell)
    }
    if (currentId < 80 && !isRightEdge) {
      const newId = cells[parseInt(currentId) + 1].id
      //const newId = parseInt(currentId) +1   ....refactor
      const newCell = document.getElementById(newId)
      click(newCell)
    }
    if (currentId < 72 && !isLeftEdge) {
      const newId = cells[parseInt(currentId) - 1 + width].id
      //const newId = parseInt(currentId) -1 +width   ....refactor
      const newCell = document.getElementById(newId)
      click(newCell)
    }
    if (currentId < 71 && !isRightEdge) {
      const newId = cells[parseInt(currentId) + 1 + width].id
      //const newId = parseInt(currentId) +1 +width   ....refactor
      const newCell = document.getElementById(newId)
      click(newCell)
    }
    if (currentId < 71) {
      const newId = cells[parseInt(currentId) + width].id
      //const newId = parseInt(currentId) +width   ....refactor
      const newCell = document.getElementById(newId)
      click(newCell)
    }
  }, 10)
}

//game over
function gameOver() {
  //result.innerHTML = 'BOOM! Game Over!'
  isGameOver = true

  //show ALL the bombs
  cells.forEach(cell => {
    if (cell.classList.contains('mine')) {
      cell.innerHTML = '🤢'
      cell.classList.remove('mine')
      cell.classList.add('checked')
    }
  })
}





// ? Function has to be called every time the page reloads or player presses Start button
addRandomMines()

start.addEventListener('click', () => {
  removeMines()
  addRandomMines()
})