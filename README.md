### ![GA](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)
### General Assembly, Software Engineering Immersive 
# Mushroom Picking Adventure


## Overview

This is my first project, as part of the Software Engineering Immersive Course from the General Assembly.

The assignment was to create a **grid-based game** to be rendered in the browser using HTML, CSS and vanilla JavaScript. The project was to be completed **individually** within **one week**.

Given a list of options from GA, I chose to recreate one of my favourite classic games [Minesweeper](https://en.wikipedia.org/wiki/Minesweeper_(video_game)) into a **Mushroom Picking Adventure**.

<img align = 'center' src='https://i.imgur.com/GdljEDX.png' >

### How to play

The general idea of the game is to try to figure out the locations of mushrooms in a grid and 'mark' them. The game provides numbered clues as the player makes progress. Numbers show how many neighbouring cells have mushrooms and the player has to decide where they are hidden in the remaining cells, and right click those cells to place mushrooms.

The game ends as a player wins - once all mushrooms are (correctly) marked, or losses - if the player reveals a mushroom.

By left-clicking a random cell, the player starts the game and reveals either a mushroom, a number, or an empty cell.

- If the player clicks on a cell with a mushroom, the game is immediately over and the board is cleared to reveal the location of all the other mushrooms.

- If the player clicks on a cell without mushroom, two things can happen:
	- If the cell is next to any mushrooms, that cell would show the total number of mushrooms surrounding the cell.
	- If the cell is not a mushroom and not next to any mushrooms (just an empty cell), cells around get revealed till numbers or mushrooms are reached.
- If the player manages to 'mark' all the mushrooms without actually clicking on them, then the player wins and receives a score.

<img align = 'center' src='https://i.imgur.com/PuQaU0i.gif' >

You can play my game [here](https://zvesna.github.io/project-1/), or find the GitHub repo [here](https://github.com/ZVesna/project-1).

---
***NOTE***

Please note that while the game is designed in terms of mushrooms and 'nauseated' faces, this documentation is written in terms of the original Minesweeper lingo (e.g. referring to mines and flags), as the underlying code also uses this jargon.

---


## Brief

Requirements:

* **Render a game in the browser**
* **Design logic for winning** and **visually display which player won**
* **Include separate HTML / CSS / JavaScript files**
* Stick with **KISS (Keep It Simple Stupid)** and **DRY (Don't Repeat Yourself)** principles
* Use **JavaScript** for **DOM manipulation**
* **Deploy your game online**, where the rest of the world can access it
* Use **semantic markup** for HTML and CSS (adhere to best practices).

### Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- Git
- GitHub
- Google Fonts
- Local Storage


## Approach

### Planning

In order to create this game, I identified a few core pieces of logic: 

1. Generate and populate the grid with mines:
  - Set a grid size
  - Assign mines to unique cells

2. Use logic to define the game boundaries - corners and edges of the grid

3. Check adjacent cells when a cell without a mine is selected:
  - Ensure only valid cells are checked
  - Use boundary logic to execute

4. Force an adjacent checker to run recursively, if it detects more safe cells:
  - Create logic to prevent the algorithm to run perpetually
  - Ensure the checker runs accurately and does not select mine cells in the process

<img align = 'center' src='https://i.imgur.com/sKPbWDH.png' >

*An early blueprint for the game.*


### The Grid

The grid is where the game is visually populated.

A variable *width* is used in conjunction with a for loop to make an array of cells, while pushing each cell to the grid component. For ease of navigation, debugging and legibility in functions that select these cells further down the line, the cells index was assigned as an ID to each cell.

A piece of code that creates the grid:

```js 
for (let i = 0; i < width * width; i++) {
  const cell = document.createElement('div')
  cell.setAttribute('id', i)
  grid.appendChild(cell)
  cells.push(cell)
  cell.style.width = `${100 / width}%`
  cell.style.height = `${100 / width}%`
}
```

Grid was populated with mines using random number generator. After a random index is generated, mine position is declared with that index within the grid. To ensure that the index was unique, the grid was checked if it already contained a mine on that position.

```js
function addRandomMines() {
  let mineCount = 10
  minesLeft.innerHTML = 10 
  
  while (mineCount > 0) {
    const randomIndex = Math.floor(Math.random() * cells.length)
    const minePosition = cells[randomIndex]
    if (minePosition.classList.contains('mine')) {
      continue
    } else {
      minePosition.classList.add('mine')
      mineCount -= 1
    } 
  }
}  
```

## Boundaries and Adjacent Cells

The boundaries needed to be clearly set for this type of the game to function properly. Otherwise, there was a high chance that functions would not work as intended.

In order to set the rules within a grid for all possible scenarios, left and right edges of the grid were defined.

To assign the correct numbers, a function was run on every cell and a counter kept track of how many neighbouring cells contained mines. If a cell contained a mine, any of the surrounding cells should have taken that number into account and displayed it to the player. If the cell had no neighbouring mines, it was assigned empty. This meant that every cell had to be checked and added up to the total number of mines in the neighbouring cells.

A function that checks an adjacent cell, and logs the mine count if one is detected:

```js
function countMinesAround() {
  for (let i = 0; i < cells.length; i++) {
    let count = 0
    const isLeft = (i % width === 0)
    const isRight = (i % width === width - 1)

    if (!cells[i].classList.contains('mine')) {
      if (i > 0 && !isLeft && cells[i - 1].classList.contains('mine')) count ++
      if (i > 8 && !isRight && cells[i + 1 - width].classList.contains('mine')) count ++
      if (i >= 9 && cells[i - width].classList.contains('mine')) count ++
      if (i >= 10 && !isLeft && cells[i - 1 - width].classList.contains('mine')) count ++
      if (i < 80 && !isRight && cells[i + 1].classList.contains('mine')) count ++
      if (i < 72 && !isLeft && cells[i - 1 + width].classList.contains('mine')) count ++
      if (i < 71 && !isRight && cells[i + 1 + width].classList.contains('mine')) count ++
      if (i <= 71 && cells[i + width].classList.contains('mine')) count ++
      cells[i].setAttribute('data', count)
    }
  }
}
```


## Recursion

Recursion is, in my opinion, the heart of the game. Also, the most complex part of the project. It is used to check neighboring cells of any cell player clicked on while playing the game.

Based on the function below, there were many arguments that could break this recursion:

- If the game was over on click function
- If the cell clicked has already been checked or has a flag on it
- If the cell contained a number larger than zero, that number was added to its inner HTML, so it showed up. We marked it as checked and moved on.

```js
// left click - opens the cell
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
```

If none of these are met - a cell had a data number of 0, cell was marked as checked and another function is called to check neighbouring cells on the board. It aimed to check all eight surrounding cells, and the logic was very similar to counting mines.

In order for this action to happen really quickly after the cell is clicked, **setTimeout()** is added with a predefined value of 10 milliseconds. This part was quite important for the recursion.

Neighboring cells are checked based on the ID of the clicked cell. First, we get the ID of the surrounding cell. Than grab that cell as a *newCell* and pass it to the click(cell) function, to be checked again. If it passes, it continues to go through the loop again, and if it gets returned on click function, the loop stops.

So, in case we clicked on an empty cell, we expected all cells that are not numbers or mines to be revealed.

Part of the robust algorithm:

```js
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
    .
    .
    .
    if (currentId <= 71) {
      const newId = cells[parseInt(currentId) + width].id
      const newCell = document.getElementById(newId)
      click(newCell)
    }
  }, 10)
}
```


## Additional Components

**Flagging the Board**

Along with revealing the board through clicks, another core part of the game included the use of flagging "dangerous" cells. 

**Event listeners** were added to left and right click. The left click was "discovering" the cells, and the right click was repurposed to "flag" the mine.

This code block shows the function of the right click:

```js
// right click - flags the mine
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
```

**Clearing the Board**

After the initial game was over - with either of two possible outcomes, players could click on a 'basket' icon to start a new game. This was possible due to two functions:

1. removeMines() - that removed all the classes from the cells and reset all the parameters for a new game
2. addRandomMines() - that randomly assigned the mines

```js
// start new game without refreshing the page
start.addEventListener('click', () => {
  removeMines()
  addRandomMines()
})
```

**Timer and Mines Counter**

Timer was set using **setInterval()** method. Although it was set as a stretch goal at the beginning, and something that is nice to have, it took me a while to make it work properly. It runs through almost the entire code, and order - when it was used, played a big role in its proper functioning.

It was triggered on the players' initial click, and it stopped when the game was won or lost. If the game was won, the timer value would be passed as the player's high score if he added a score to the scoreboard.

The mines counter is an important feature which tracks the number of flags the player has made. Once the value is at 0, and all flagged cells exactly match mine positions, the winning function gets run and "You won!" showed up.

If a player clicked on a mine, all the mines were revealed and the timer stopped.

**Add Score**

Making use of the local storage and the timer component, I added one more functionality to the game - an option for a player to add the score after he successfully completed the game.

By clicking on 'Add score', a pop-up window shows up with a prompt for players to enter their name. Time was added automatically.

<img align = 'center' src='https://i.imgur.com/LX41zfY.png' >

**Styling**

I wanted to create a unique design which still made sense within the minesweeper game rules. That is why I chose an appealing forest theme to tell the story. Player had to collect all the mushrooms (flags), but avoid the poisonous ones (mines).

Effective background was definitely a good choice, and I was really pleased with how it looked.

As the game was styled using CSS, I added a media query to make it **fully responsive**.

For fonts, I used Roboto Mono for the game and Londrina Shadow for the name of the game and the alert.


## Conclusion

**Wins**

- I enjoyed making my own game for the first time ever. I went through the whole process of planning, dividing the workload by days, debugging and deciding on whether I should enable some functionalities or not.

**Challenges**

- One of the biggest challenges I faced was actually figuring out that the right click on Mac mouse is 'not always' THE right click. I spent hours double-checking everything and polishing the code in order to find the bug, just to find out what was the real issue.

- And of course, timer, as it was nested in almost every function.

**Potential future features**

- Update the game to support different difficulties/grid sizes.

- Limit the number of entries for a scoreboard to 10.

- Add remote storage for scoreboard.

**Bugs**

- Reveal all the fields when all the mines are flagged and the timer has stopped.

**Lessons learned**

This project was a true learning experience! Overall, I really enjoyed building an all-time-favourite game of mine.

It provided a valuable lesson on planning, and how crucial is the process of whiteboarding and taking notes. I also enjoyed learning about local storage and giving players a chance to save their high scores.
