
let w = 10
let h = 8
let d = 1
let mines = [...Array(d)].map(i=>[...Array(h)].map(i=>Array(w).fill(0)))
let found = [...Array(d)].map(i=>[...Array(h)].map(i=>Array(w).fill(0)))
let flags = [...Array(d)].map(i=>[...Array(h)].map(i=>Array(w).fill(0)))
let nmines = 10
let started = false
let blowUp = false
let won = false

let wslider
let hslider
let dslider
let nslider
let resetButton
const dimMax = {x: 25, y: 25, z: 10}
const presets = [
  [10,8,1,10],
  [18,14,1,40],
  [24,20,1,99],
  [8,6,3,25],
  [5,5,5,20],
]
const presetButtons = []
let presetting = false

const offset = 110
const btwn = 40
const sqsize = 30
const presetsWidth = 23
const presetsHeight = 23
const presetsTop = 15
const sliderWidth = 150
const sliderHeight = 16
const sliderTop = 35+presetsTop
const sliderSpacing = 25
const buttonWidth = 70
const buttonTop = 50+sliderTop

function setup() {
  createCanvas(max(2*btwn+sqsize*w,4*sliderWidth+4*sliderSpacing),btwn+(btwn+sqsize*h)*d+offset)
  document.getElementsByClassName("p5Canvas")[0].style.left = top.innerWidth/2+'px'
  document.body.style.height = btwn+(btwn+sqsize*h)*d+offset+'px'
  textAlign(CENTER, CENTER)
  for (let element of document.getElementsByClassName("p5Canvas")) {
    element.addEventListener("contextmenu", (e) => e.preventDefault())
  }
  const sliderWidthPx = sliderWidth+'px'
  const sliderHeightPx = sliderHeight+'px'
  wslider = createSlider(1, dimMax.x, w)
  wslider.style('width',sliderWidthPx)
  wslider.style('height',sliderHeightPx)
  wslider.style('margin','0')
  wslider.attribute('id','wslider')
  wslider.position(top.innerWidth/2-sliderWidth*2-1.5*sliderSpacing,sliderTop)
  hslider = createSlider(1, dimMax.y, h)
  hslider.style('width',sliderWidthPx)
  hslider.style('height',sliderHeightPx)
  hslider.style('margin','0')
  hslider.attribute('id','hslider')
  hslider.position(top.innerWidth/2-sliderWidth-sliderSpacing/2,sliderTop)
  dslider = createSlider(1, dimMax.z, d)
  dslider.style('width',sliderWidthPx)
  dslider.style('height',sliderHeightPx)
  dslider.style('margin','0')
  dslider.attribute('id','dslider')
  dslider.position(top.innerWidth/2+sliderSpacing/2,sliderTop)
  nslider = createSlider(0, w*h*d-1, min(nmines,w*h*d-1))
  nslider.style('width',sliderWidthPx)
  nslider.style('height',sliderHeightPx)
  nslider.style('margin','0')
  nslider.attribute('id','nslider')
  nslider.position(top.innerWidth/2+sliderWidth+1.5*sliderSpacing,sliderTop)
  button = createButton('Reset')
  button.style('width',buttonWidth+'px')
  button.position(top.innerWidth/2-buttonWidth/2, buttonTop)
  button.mousePressed(() => reset(false))
  for (let i = 0; i < presets.length; i++) {
    const btn = createButton(''+(i+1))
    btn.mousePressed(presetFuncs(...presets[i]))
    btn.style('width',presetsWidth+'px')
    btn.style('height',presetsHeight+'px')
    btn.position(top.innerWidth/2-presetsWidth*presets.length/2+presetsWidth*i+28,presetsTop)
  }
}

const presetFuncs = (w_, h_, d_, n_) => (() => {
  presetting = true
  w = w_
  h = h_
  d = d_
  nmines = n_
  setVals()
  reset(true)
  presetting = false
})

const setVals = () => {
  let slider = document.getElementById("wslider")
  slider.value = w
  slider = document.getElementById("hslider")
  slider.value = h
  slider = document.getElementById("dslider")
  slider.value = d
  slider = document.getElementById("nslider")
  slider.value = nmines
}

const reset = (resetN) => {
  if (resetN) {
    resizeCanvas(max(2*btwn+sqsize*w,4*sliderWidth+4*sliderSpacing),btwn+(btwn+sqsize*h)*d+offset)
    document.body.style.height = btwn+(btwn+sqsize*h)*d+offset+'px'
    nslider.attribute('max',w*h*d-1)
  }
  mines = [...Array(d)].map(i=>[...Array(h)].map(i=>Array(w).fill(0)))
  found = [...Array(d)].map(i=>[...Array(h)].map(i=>Array(w).fill(0)))
  flags = [...Array(d)].map(i=>[...Array(h)].map(i=>Array(w).fill(0)))
  started = false
  blowUp = false
  won = false
}

const initializeMines = (x,y,z) => {
  const checkForRoom = () => {
    let count = 0
    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        for (let k = -1; k < 2; k++) {
          if (x+i >= 0 && x+i < w && y+j >= 0 && y+j < h && z+k >= 0 && z+k < d) {
            count++
          }
        }
      }
    }
    return w*h*d-count >= nmines
  }
  const dist = checkForRoom() ? 2 : 1
  for (let i = 0; i < nmines; i++) {
    let randx = floor(random(w))
    let randy = floor(random(h))
    let randz = floor(random(d))
    while (abs(randx - x) < dist && abs(randy - y) < dist && abs(randz - z) < dist || !!mines[randz][randy][randx]) {
      randx = floor(random(w))
      randy = floor(random(h))
      randz = floor(random(d))
    }
    mines[randz][randy][randx] = 27
  }
}

const initializeNums = () => {
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      for (let k = 0; k < d; k++) {
        if (mines[k][j][i] == 27) {
          continue
        }
        let count = 0
        for (let i_ = -1; i_ < 2; i_++) {
          for (let j_ = -1; j_ < 2; j_++) {
            for (let k_ = -1; k_ < 2; k_++) {
              if (i+i_ < 0 || i+i_ >= w || j+j_ < 0 || j+j_ >= h || k+k_ < 0 || k+k_ >= d) {
                continue
              }
              if (mines[k+k_][j+j_][i+i_] == 27) {
                count++
              }
            }
          }
        }
        mines[k][j][i] = count
      }
    }
  }
}

const propagateClick = (x,y,z) => {
  const q = [{i: x, j: y, k: z}]
  while (q.length != 0) {
    const {i, j, k} = q.pop()
    if (!!found[k][j][i]) {
      continue
    }
    found[k][j][i] = 1
    flags[k][j][i] = 0
    if (!mines[k][j][i]) {
      for (let i_ = -1; i_ < 2; i_++) {
        for (let j_ = -1; j_ < 2; j_++) {
          for (let k_ = -1; k_ < 2; k_++) {
            if (i+i_ < 0 || i+i_ >= w || j+j_ < 0 || j+j_ >= h || k+k_ < 0 || k+k_ >= d) {
              continue
            }
            if (!found[k+k_][j+j_][i+i_]) {
              q.push({i: i+i_, j: j+j_, k: k+k_})
            }
          }
        }
      }
    }
  }
}

const checkWin = () => {
  const nfound = found.reduce((acc,arr) => acc+arr.reduce((acc2,arr2) => acc2+arr2.reduce((acc3,i) => acc3 + i,0),0),0)
  if (nfound + nmines == w*h*d) {
    won = true
  }
}

const findMouse = () => ({
  x: floor((mouseX-(width-sqsize*w)/2)/sqsize),
  y: floor(((mouseY-offset) % (btwn+h*sqsize)-btwn)/sqsize),
  z: floor((mouseY-offset)/(btwn+h*sqsize)),
})

const isFlagClick = () => (mouseButton == RIGHT || keyIsDown(SHIFT))

function mousePressed() {
  if (blowUp || won) {
    return
  }
  const {x,y,z} = findMouse()
  console.log(x,y,z)
  if (x < 0 || x >= w || y < 0 || y >= h || z < 0 || z >= d) {
    return
  }
  if (isFlagClick()) {
    if (!found[z][y][x]) {
      flags[z][y][x] = !flags[z][y][x]
    }
  } else {
    if (!started) {
      started = true
      initializeMines(x,y,z)
      initializeNums()
    }
    if (!!found[z][y][x]) {
      return
    }
    if (!!flags[z][y][x]) {
      flags[z][y][x] = 0
      return
    }
    if (mines[z][y][x] == 27) {
      blowUp = true
      return
    }
    propagateClick(x,y,z)
    checkWin()
  }
}

const checkUpdate = (w_, h_, d_, n_) => {
  if (w != w_ || h != h_ || d != d_ || nmines != n_) {
    const resetN = nmines == n_
    w = w_
    h = h_
    d = d_
    nmines = n_
    reset(resetN)
  }
}

function draw() {
  if (presetting) {
    return
  }
  checkUpdate(wslider.value(),hslider.value(),dslider.value(),nslider.value())
  background(255)
  push()
  textSize(14)
  fill(0)
  textAlign(RIGHT,CENTER)
  text("presets",width/2-2.5*presetsWidth+18,presetsTop+presetsHeight/2)
  pop()
  push()
  translate(width/2,sliderTop+sliderHeight+9)
  fill(0)
  textSize(13)
  textAlign(LEFT,CENTER)
  text(1,-sliderWidth*2-1.5*sliderSpacing,0)
  text(1,-sliderWidth-0.5*sliderSpacing,0)
  text(1,0.5*sliderSpacing,0)
  text(0,sliderWidth+1.5*sliderSpacing,0)
  textAlign(RIGHT,CENTER)
  text(dimMax.x,-sliderWidth-1.5*sliderSpacing,0)
  text(dimMax.y,-0.5*sliderSpacing,0)
  text(dimMax.z,sliderWidth+0.5*sliderSpacing,0)
  text(w*h*d-1,2*sliderWidth+1.5*sliderSpacing,0)
  pop()
  push()
  textSize(24)
  textAlign(LEFT,CENTER)
  const flagsLeft = nmines-flags.reduce((acc,arr) => acc+arr.reduce((acc2,arr2) => acc2+arr2.reduce((acc3,i) => acc3 + i,0),0),0)
  text(flagsLeft+' bombs',width/2+buttonWidth/2+btwn*0.75,buttonTop+11)
  textAlign(RIGHT,CENTER)
  text(w+' x '+h+' x '+d,width/2-buttonWidth/2-btwn*0.75,buttonTop+11)
  pop()
  push()
  translate(width/2-sqsize*w/2,offset-h*sqsize)
  for (let k = 0; k < d; k++) {
    translate(0,btwn+h*sqsize)
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        if (!!found[k][j][i]) {
          fill(230)
          rect(i*sqsize,j*sqsize,sqsize,sqsize)
          if (!!mines[k][j][i]) {
            fill(0)
            textSize(12)
            text(mines[k][j][i],i*sqsize+sqsize/2,j*sqsize+sqsize/2)
          }
        } else {
          if (mines[k][j][i] == 27 && (blowUp || won)) {
            fill(blowUp ? color(255,0,0) : color(0,255,0))
            rect(i*sqsize,j*sqsize,sqsize,sqsize)
          } else {
            fill(255)
            rect(i*sqsize,j*sqsize,sqsize,sqsize)
          }
        }
        if (!!flags[k][j][i]) {
          fill(0,0,255)
          circle(i*sqsize+sqsize/2,j*sqsize+sqsize/2,sqsize/3)
        }
      }
    }
  }
  pop()
}
