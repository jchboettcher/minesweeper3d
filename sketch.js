
const w = 10
const h = 8
const mines = [...Array(h)].map(i=>Array(w).fill(0))
const found = [...Array(h)].map(i=>Array(w).fill(0))
const flags = [...Array(h)].map(i=>Array(w).fill(0))
const nmines = 10
let started = false
let blowUp = false
let won = false

const offset = 80
const sqsize = 30

function setup() {
  createCanvas(2*offset+sqsize*w,2*offset+sqsize*h)
  textAlign(CENTER, CENTER)
  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault());
  }
}

const initializeMines = (x,y) => {
  for (let i = 0; i < nmines; i++) {
    let randx = floor(random(w))
    let randy = floor(random(h))
    // while ((randx == x && randy == y) || !!mines[randy][randx]) {
    while ((abs(randx - x) < 2 && abs(randy - y) < 2) || !!mines[randy][randx]) {
      randx = floor(random(w))
      randy = floor(random(h))
    }
    mines[randy][randx] = 9
  }
}

const initializeNums = () => {
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      if (mines[j][i] == 9) {
        continue
      }
      let count = 0
      for (let k = -1; k < 2; k++) {
        for (let l = -1; l < 2; l++) {
          if (i+k < 0 || i+k >= w || j+l < 0 || j+l >= h) {
            continue
          }
          if (mines[j+l][i+k] == 9) {
            count += 1
          }
        }
      }
      mines[j][i] = count
    }
  }
}

const propagateClick = (x,y) => {
  const q = [{i: x, j: y}]
  while (q.length != 0) {
    const {i, j} = q.pop()
    if (!!found[j][i]) {
      continue
    }
    found[j][i] = 1
    flags[j][i] = 0
    if (!mines[j][i]) {
      for (let k = -1; k < 2; k++) {
        for (let l = -1; l < 2; l++) {
          if (i+k < 0 || i+k >= w || j+l < 0 || j+l >= h) {
            continue
          }
          if (!found[j+l][i+k]) {
            q.push({i: i+k, j: j+l})
          }
        }
      }
    }
  }
}

const checkWin = () => {
  const nfound = found.reduce((acc,arr) => acc+arr.reduce((acc2,i) => acc2 + i,0),0)
  if (nfound + nmines == w*h) {
    won = true
  }
}

const findMouse = () => ({x: floor((mouseX-offset)/sqsize), y: floor((mouseY-offset)/sqsize)})

function mousePressed() {
  if (blowUp || won) {
    return
  }
  const {x,y} = findMouse()
  if (x < 0 || x >= w || y < 0 || y >= h) {
    return
  }
  if (mouseButton == LEFT) {
    if (!started) {
      started = true
      initializeMines(x,y)
      initializeNums()
    }
    if (!!found[y][x]) {
      return
    }
    if (!!flags[y][x]) {
      flags[y][x] = 0
      return
    }
    if (mines[y][x] == 9) {
      blowUp = true
      return
    }
    propagateClick(x,y)
    checkWin()
  } else if (mouseButton == RIGHT) {
    flags[y][x] = !flags[y][x]
  }
}

// function keyPressed() {
//   initializeMines(0,4)
// }

function draw() {
  background(255)
  textSize(24)
  text(nmines-flags.reduce((acc,arr) => acc+arr.reduce((acc2,i) => acc2 + i,0),0),width/2,offset/2+8)
  push()
  translate(offset,offset)
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      if (!!found[j][i]) {
        fill(230)
        rect(i*sqsize,j*sqsize,sqsize,sqsize)
        if (!!mines[j][i]) {
          fill(0)
          textSize(12)
          text(mines[j][i],i*sqsize+sqsize/2,j*sqsize+sqsize/2)
        }
      } else {
        if (mines[j][i] == 9 && (blowUp || won)) {
          fill(blowUp ? color(255,0,0) : color(0,255,0))
          rect(i*sqsize,j*sqsize,sqsize,sqsize)
        } else {
          fill(255)
          rect(i*sqsize,j*sqsize,sqsize,sqsize)
        }
      }
      if (!!flags[j][i]) {
        fill(0,0,255)
        circle(i*sqsize+sqsize/2,j*sqsize+sqsize/2,sqsize/3)
      }
    }
  }
  pop()
}
