const grid = 16;
let canvas = document.getElementById("tetris");
let ctx = canvas.getContext("2d");
const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

let nextShapeCanvas = document.getElementById("next-shape-canva");
let ctxNextShape = nextShapeCanvas.getContext("2d");
const nxtSpCanvasWidth = nextShapeCanvas.width;
const nxtSpcanvasHeight = nextShapeCanvas.height;

class Position {
  constructor(x,y){
    this.x = x;
    this.y = y;
  }

  getX(){
    return this.x;
  }

  getY(){
    return this.y;
  }

  setX(x){
    this.x = x;
  }

  setY(y){
    this.y = y;
  }
}

class Block {
  constructor(position, color){
    this.position = position;
    this.color=color;
  }

  drawBlock(){
    ctx.fillStyle=this.color;
    ctx.fillRect(this.position.x, this.position.y, grid-1, grid-1);
  }
  
  undrawBlock() {
    ctx.clearRect(this.position.x,this.position.y,grid-1,grid-1);
  }
  
  moveDown() {
    this.undrawBlock();
    this.position.setY(this.position.y + grid);
    this.drawBlock();
  }

  moveRight() {
    this.undrawBlock();
    this.position.setX(this.position.x + grid);
    this.drawBlock();
  }

  moveLeft() {
    this.undrawBlock();
    this.position.setX(this.position.x - grid);
    this.drawBlock();
  }
  
  getPosition() {
    return this.position;
  }

  setPosition(x,y) {
    this.position = new Position(x,y);
  }

  drawBlockNxtShp(){
    ctxNextShape.fillStyle=this.color;
    ctxNextShape.fillRect(this.position.x - (3 * 16),this.position.y + 2*grid, grid-1, grid-1);
  }
}

class Shape {
  constructor(blocks, stopped, index){
    this.blocks=blocks;
    this.stopped = stopped;
    this.index = index;
  }

  init(){
    for(let block of this.blocks){
      block.drawBlock()
    }
  }
  
  getBlocks() {
    return Array.from(this.blocks);
  }

  setBlocks(blocks){
    this.blocks = blocks;
  }

  getIndex() {
    return this.index;
  }

  setShapeStopped(stopped) {
    this.stopped = stopped;
  }
  isShapeStopped() {
    return this.stopped;
  }

  moveDown() {
    for (let block of this.blocks) {
      block.moveDown();
    }
  }
  
  moveRight() {
    for (let block of this.blocks) {
      block.moveRight();
    }
  }

  moveLeft() {
    for (let block of this.blocks) {
      block.moveLeft();
    }
  }

  clear() {
    for (let block of this.blocks) {
      block.undrawBlock();
    }
    this.blocks = [];
  }

  drawNxtShp(){
    for (const block of this.blocks) {
      block.drawBlockNxtShp();
    }
  }
  undrawNxtShp(){
    ctxNextShape.clearRect(0,0,nxtSpCanvasWidth,nxtSpcanvasHeight);
  }
}

class Square extends Shape {
  constructor(x,y, index) {
    let blocks = [];
    let color = "yellow";
    blocks.push(new Block(new Position(x * grid,y * grid), color));
    blocks.push(new Block(new Position(x * grid, (y+1)* grid), color));
    blocks.push(new Block(new Position((x + 1) * grid, y),color));
    blocks.push(new Block(new Position((x + 1) * grid, (y+1)* grid),color));
    super(blocks,false, index);
  }
  rotate(){}
}

class LShape extends Shape {
  constructor(x, y, index) {
    let blocks = [];
    let color = "red";
    blocks.push(new Block(new Position(x * grid, y * grid), color));
    blocks.push(new Block(new Position((x - 1) * grid, y * grid), color ));
    blocks.push(new Block(new Position((x + 1) * grid, y * grid), color));
    blocks.push(new Block(new Position((x + 1) * grid, (y + 1) * grid), color));
    super(blocks,false, index);
    this.position = 0;
  }

  rotate() {
    for (const block of this.blocks) {
      block.undrawBlock();
    }
    if (this.position==0) {
      let block = this.blocks[1];
      this.blocks[2].setPosition(block.getPosition().x, block.getPosition().y -16)
      this.blocks[3].setPosition(block.getPosition().x, block.getPosition().y - 32)
      this.position=1;
    }else if(this.position==1){
      let block = this.blocks[1];
      this.blocks[2].setPosition(block.getPosition().x + 32, block.getPosition().y)
      this.blocks[3].setPosition(block.getPosition().x + 32, block.getPosition().y + 16)
      this.position=0;
    }
    this.init()
  }
}

class Line extends Shape {
  constructor(x, y, index) {
    let blocks = [];
    let color = "blue"
    blocks.push(new Block(new Position((x * grid), (y * grid)), color));
    blocks.push(new Block(new Position(((x - 1) * grid), (y * grid)), color));
    blocks.push(new Block(new Position(((x + 1) * grid), (y * grid)), color));
    blocks.push(new Block(new Position(((x + 2) * grid), (y * grid)), color));
    super(blocks,false, index);
    this.position = 0;
  }

  rotate() {
    for (const block of this.blocks) {
      block.undrawBlock();
    }
    if (this.position==0) {
      let block = this.blocks[2];
      this.blocks[1].setPosition(block.getPosition().x, block.getPosition().y - 16)
      this.blocks[0].setPosition(block.getPosition().x, block.getPosition().y - 32)
      this.blocks[3].setPosition(block.getPosition().x, block.getPosition().y + 16)
      this.position = 1;
    }else if(this.position==1){
      let block = this.blocks[2];
      this.blocks[1].setPosition(block.getPosition().x -16 , block.getPosition().y)
      this.blocks[0].setPosition(block.getPosition().x - 32, block.getPosition().y)
      this.blocks[3].setPosition(block.getPosition().x + 16, block.getPosition().y)
      this.position = 0;
    }
    this.init()
  }

  getNextPosition() {
    return (this.position + 1) % 2;
  }
}

class TShape extends Shape {
  constructor(x, y, index) {
    let blocks = [];
    let color = "brown";
    blocks.push(new Block(new Position( x * grid, y * grid ), color));
    blocks.push(new Block(new Position( (x + 1) * grid, y * grid ), color));
    blocks.push(new Block(new Position( x * grid, (y - 1) * grid ), color));
    blocks.push(new Block(new Position( x * grid, (y + 1) * grid ), color));
    super(blocks,false, index);
    this.position = 0;
  }

  rotate() {
    for (const block of this.blocks) {
      block.undrawBlock();
    }
    if (this.position==0) {
    let block = this.blocks[1];
    this.blocks[3].setPosition(block.getPosition().x - 32, block.getPosition().y )
      this.position=1;
    }else if (this.position==1) {
    let block = this.blocks[0];
    this.blocks[3].setPosition(block.getPosition().x, block.getPosition().y +16)
      this.blocks[1].setPosition(block.getPosition().x - 16, block.getPosition().y)
      this.position=2;
    }
    else if (this.position==2) {
      let block = this.blocks[0];
      this.blocks[3].setPosition(block.getPosition().x + 16, block.getPosition().y)
      this.position=3;
    }
    else if (this.position==3) {
      let block = this.blocks[0];
      this.position=0;
    }
    this.init()
  }
}

class ZShape extends Shape {
  constructor(x, y, index) {
    let blocks = [];
    let color = "green"
    blocks.push(new Block(new Position(x * grid, y * grid ), color));
    blocks.push(new Block(new Position(x * grid, (y - 1) * grid ), color));
    blocks.push(new Block(new Position ((x + 1) * grid, y * grid), color));
    blocks.push(new Block(new Position((x + 1) * grid, (y + 1) * grid), color));
    super(blocks, false, index);
    this.position = 0;
  }

  rotate() {
  }
}

class Tetris{
  constructor(){
    this.blocks = [];
    this.shapes = [];
    this.index = 0;
    this.nextShape = undefined;
    this.canStart = true;
    this.gameOver = false;
  }

  init(){
    if (this.canStart) {
      let shape = this.generateRandomShape();
      this.shapes.push(shape);
      this.drawBlocks()

      this.setNewShape();
      this.canStart=false;
      document.getElementById("start").innerHTML = "";
  }
  }

  restart(){
    this.resetStyles();
    this.blocks = [];
    this.shapes = [];
    this.index = 0;
    this.nextShape = undefined;
    this.canStart = true;
    this.gameOver = false;
    this.init();
  }

  setNewShape(){
    this.nextShape = this.generateRandomShape();
    this.nextShape.undrawNxtShp();
    this.nextShape.drawNxtShp();
  }

  getIndex(){
    return this.index;
  }

  increaseIndex(){
   this.index ++ ;
  }
  
  drawBlocks(){
    for(let block of this.blocks){
      block.drawBlock()
    }
  }

  setEndGame(){
    this.gameOver = true;
    this.setEndGameStyles()
  }


  setEndGameStyles(){
    document.getElementById("start").innerHTML = "Restart!!";
    let canvasContainer = document.querySelector(".canvasContainer");
    canvasContainer.style.opacity = 0.2;
  }

  resetStyles(){
    ctx.clearRect(0,0,canvasWidth,canvasHeight);
    document.getElementById("start").innerHTML = "Start";
    let canvasContainer = document.querySelector(".canvasContainer");
    canvasContainer.style.opacity = 1;
  }

  rotate(){
    let shape = this.shapes.find((el) => el.index == this.index - 1);
    if (shape !== undefined && (!shape.isShapeStopped())) {
      shape.rotate();
    }
  }

  moveDown(shape) {
    if (shape !== undefined && (!shape.isShapeStopped())) {
      let canMove = true;
      for (const block of shape.getBlocks()) {
        if (block.getPosition().y == canvasHeight - grid) {
          canMove = false;
          break;
        }
      }
      if (canMove) {
        shape.moveDown();
        shape.init();
      }
    }
  }
  
  moveRight(shape) {
    if (shape!=undefined && !shape.isShapeStopped()) {
      let canMove = true;
      for (const block of shape.getBlocks()) {
        if (block.getPosition().x == (canvasWidth - 16)) {
          canMove = false;
          break;
        }
      }
      if (canMove) {
        shape.moveRight();
        shape.init();
      }
    }
  }

  moveLeft(shape) {
    if (shape!=undefined && !shape.isShapeStopped()) {
      let canMove = true;
      for (const block of shape.getBlocks()) {
        if (block.getPosition().x == 0) {
          canMove = false;
          break;
        }
      }
      if (canMove) {
        shape.moveLeft();
        shape.init();
      }
    }
  }

  generateRandomShape() {
    let shape = null;
    this.increaseIndex();
    switch (this.getRandomRange(0, 4)) {
      case 0:
        shape = new Line(5,0,this.index);
        break;
      case 1:
        shape = new Square(5,0,this.index);
        break;
      case 2:
        shape = new LShape(5,0,this.index);
        break;
      case 3:
        shape = new ZShape(5,0,this.index);
        break;
      case 4:
        shape = new TShape(5,0,this.index);
        break;
    }
    return shape;    
  }

  getRandomRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  stopShape(shape){
    for (const block of shape.getBlocks()) {
      const blockPosY = block.getPosition().y;
      const blockPosX = block.getPosition().x;

      if (blockPosY == (canvasHeight - 16) || 
        this.blocks.some(el => blockPosX === el.position.x && (blockPosY + grid) === el.position.y)) {
        shape.setShapeStopped(true);
        break;
      }
    }
  }

  fallShapes() {
    if (this.gameOver) {
      return;
    }
    let finalShape = this.shapes.find((shape) => shape.getIndex() === this.index-1) ;
    if (finalShape!==undefined && (finalShape.isShapeStopped())) {
      let newShape = this.nextShape;
      this.setNewShape();
      this.shapes.push(newShape);
    }
    
    this.blocks = [];
    for (let shape of this.shapes) {
      shape.setShapeStopped(false);
      this.stopShape(shape);
      if (!shape.isShapeStopped()) {
        shape.moveDown();
      }else{
        if (shape.getBlocks().some((el)=> el.position.y===0)) {
          this.setEndGame();
        }
      }
      this.blocks.push(...shape.getBlocks());
    }
    this.drawBlocks();

    if (this.gameOver) {
      return;
    }
    let blocksToDelete = this.blocks.filter((block)=>{
      let rowBlocks = [];
      for (const shape of this.shapes) {
        if (shape.isShapeStopped()) {
          let temp = shape.getBlocks().filter((b) => b.getPosition().y === block.getPosition().y);
          rowBlocks.push(...temp);
        }
      }
      return rowBlocks.length === canvasWidth / 16;
    });

    for (const shape of this.shapes) {
      shape.setBlocks(shape.getBlocks().filter((block) => !blocksToDelete.includes(block)));
    }

    this.blocks = this.blocks.filter((block) => !blocksToDelete.includes(block));

    blocksToDelete.forEach((block) => {
      block.undrawBlock();
    });

    this.drawBlocks();
  }

}
let tetris = new Tetris();

let startGame = document.getElementById("start");
startGame.addEventListener("click",(event)=>{
  if (tetris.gameOver) {
    tetris.restart()
  }else{
    tetris.init();
  }
})

document.addEventListener('keydown', (event) => {
  let shape = tetris.shapes.find((el) => el.index == tetris.index - 1);
  if (event.which === 38 ) tetris.rotate();
  else if (event.which === 40) tetris.moveDown(shape);
  else if (event.which === 37) tetris.moveLeft(shape);
  else if (event.which === 39) tetris.moveRight(shape);
  event.preventDefault()
});

setInterval(()=>{
  tetris.fallShapes()
},200)