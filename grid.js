const grid = document.querySelector('.grid')
const width = 9
const height = 10
const cells = []
const start = document.querySelector('button')
const selectGrid = document.querySelector('li')





// ? Different width and height -> 
// ? change .grid width and height in javascript!
// ! add these into functions to generate different size grids
// ! remove from css
// ? grid.style.width = '1000px' // outside the loop
// ? grid.style.height = '1000px'
// ? I can set variable for them as well
// ! define width and height (as number of cells) here? number of mines??
// ? selection based on game, on 'click' (radio button)
// ? check grid width and height for Intermediate and Expert
function gridSize() {
  const width = 9
  const gridWidth = grid.style.width
  const gridHeight = grid.style.height
  if (selectGrid.innerHTML === 'Beginner') {
    width = 9
    gridWidth = '300px'
    gridHeight = '300px'
  } else if (selectGrid.innerHTML === 'Intermediate') { // check the values
    gridWidth = ''
    gridHeight = ''
  } else if (selectGrid.innerHTML === 'Expert') { // check the values
    gridWidth = ''
    gridHeight = ''
  }
}

// ! create separate function to return grid size





// ? use the random generated index to grab particular cell
// ? and place a mine by adding class .mine to it
// ? make sure not to add mine to the same cell multiple times
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

// ? function that will count the mines around each cell
function countMinesAround() {
  let count = 0
  for (let i = 0; i < cells.length; i++) {
    const num = !(cells[i].classList.contains('mine'))
    if (num) {
      if ((i + 1) < cells.length && (i + 1) % width > 0 && cells[i+1].classList.contains('mine')) {
        count += 1
      }
      if ((i - 1) >= 0 && (i - 1) % width >= 0 && cells[i-1].classList.contains('mine')) {
        count += 1
      }
      //if ((i + width) % width > 0
      
    }
  }
}
countMinesAround()

// ? Same width and height
for (let i = 0; i < width ** 2; i++) { // width * height
  const cell = document.createElement('div')
  cell.classList.add('cell')
  grid.appendChild(cell)
  cells.push(cell)
  cell.innerHTML = i
  cell.style.width = `${100 / width}%`
  cell.style.height = `${100 / width}%` // height
  
  // ? to prevent right click from defaul behaviuor
  // ? (opening the drop down menu)
  cell.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    // this piece of code is enough for right click only
  })
  // ? addEventListener for left and right click - if statement
  cell.addEventListener('mouseup', (e) => {
    if (e.button === 0) {
      //console.log('left click')
    } else if (e.button === 2) {
      //console.log('right click')
    }
  })
}

// ? Function has to be called every time the page reloads or player presses Start button
addRandomMines()

start.addEventListener('click', () => {
  removeMines()
  addRandomMines()
})
