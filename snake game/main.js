// defining canvas, context, width and height
let canvas = document.getElementById("canvas");
let context = canvas.getContext("2d");

let width = canvas.width;
let height = canvas.height;

//dividing canvas into blocks
let blockSize = 10;
let widthInBlocks = width / blockSize; // tell us how many blocks wide the canvas is //40 blocks
let heightInBlocs = height / blockSize; // tell us how many blocks tall the canvas is //40 blocks
//console.log(widthInBlocks);

// score variable
let score = 0;

//drawng the border
let drawBorder = function () {
    context.fillStyle = "Gray";
    context.fillRect(0, 0, width, blockSize); // top
    context.fillRect(0, height - blockSize, width, blockSize); //bottom
    context.fillRect(0, 0, blockSize, height); // left
    context.fillRect(width - blockSize, 0, blockSize, height); // right
};

//displating the score
let drawScore = function () {
    context.font = "20px Courier";
    context.fillStyle = "Black";
    context.textAlign = "left";
    context.textBaseline = "top";
    context.fillText("Score: " + score, blockSize, blockSize);
};

//ending the game
let gameOver = function () {
    clearInterval(intervalId);
    context.font = "60px Courier";
    context.fillStyle = "Black";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText("Game Over", width / 2, height / 2);
};

// Challenge #2
/*let intervalId = setInterval(function () {
  ctx.clearRect(0, 0, width, height);
  drawBorder();
  drawScore();
  score++;
}, 100);*/

// block constructor
let Block = function (col, row) {
    this.col = col;
    this.row = row;
};

// adding the drawSquare method
Block.prototype.drawSquare = function (color) {
    let x = this.col * blockSize;
    let y = this.row * blockSize; // 5x10 = 50 pixels
    context.fillStyle = color;
    context.fillRect(x, y, blockSize, blockSize); // position of x and y, width, height
};

// adding the drawcirlce method
Block.prototype.drawCircle = function (color) {
    let centerX = this.col * blockSize + blockSize / 2; // (3x10) + (10/2) = 35 pixeles
    let centerY = this.row * blockSize + blockSize / 2;
    context.fillStyle = color;
    circle(centerX, centerY, blockSize / 2, true); // x, y, radius, direction
};

// circle method
let circle = function (x, y, radius, fillCircle) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    if (fillCircle) {
        context.fill();
    } else {
        context.stroke();
    }
};

// adding the eual method
Block.prototype.equal = function (otherBlock) {
    return this.col === otherBlock.col && this.row === otherBlock.row;
};

// creating the snake
// snake constructor
let Snake = function () {
    this.segments = [
        new Block(7, 5), //head
        new Block(6, 5),
        new Block(5, 5), // tail
    ];
    this.direction = "right";
    this.nextDirection = "right";
};

// drawing the snake
Snake.prototype.draw = function () {
    for (let i = 0; i < this.segments.length; i++) {
        this.segments[i].drawSquare("Blue");
    }
};

// moving the snake
// adding the move method
Snake.prototype.move = function () {
    let head = this.segments[0];
    let newHead;

    this.direction = this.nextDirection;

    if (this.direction === "right") {
        newHead = new Block(head.col + 1, head.row);
    } else if (this.direction === "down") {
        newHead = new Block(head.col, head.row + 1);
    } else if (this.direction === "left") {
        newHead = new Block(head.col - 1, head.row);
    } else if (this.direction === "up") {
        newHead = new Block(head.col, head.row - 1);
    }
    if (this.checkCollision(newHead)) {
        // = TRUE - GAME OVER
        gameOver();
        return;
    }

    this.segments.unshift(newHead); //add new block to head

    if (newHead.equal(apple.position)) {
        // newHead = apple = TRUE
        score++;
        apple.move();
    } else {
        this.segments.pop(); // delete block at end
    }
};

// check collision method
Snake.prototype.checkCollision = function (head) {
    let leftCollision = head.col === 0; //will be true if snake collides with left wall
    let topCollision = head.row === 0;
    let rightCollision = head.col === widthInBlocks - 1;
    let bottomCollision = head.row === heightInBlocs - 1;

    let wallCollision =
        leftCollision || topCollision || rightCollision || bottomCollision;
    console.log(wallCollision);

    //check for self collision
    let selfCollision = false;

    for (let i = 0; i < this.segments.length; i++) {
        if (head.equal(this.segments[i])) {
            selfCollision = true;
        }
    }

    return wallCollision || selfCollision;
};

//setting snake's direction
//Adding the keydown event handler
let directions = {
    37: "left",
    38: "up",
    39: "right",
    40: "down",
};

$("body").keydown(function (event) {
    let newDirection = directions[event.keyCode];
    //console.log(newDirection);
    if (newDirection !== undefined) {
        snake.setDirection(newDirection);
    }
});

//adding the setDirection Method
Snake.prototype.setDirection = function (newDirection) {
    if (this.direction === "up" && newDirection === "down") {
        return;
    } else if (this.direction === "right" && newDirection === "left") {
        return;
    } else if (this.direction === "down" && newDirection === "up") {
        return;
    } else if (this.direction === "left" && newDirection === "right") {
        return;
    }
    this.nextDirection = newDirection;
};

//creating the apple
// writing the apple constructor
let Apple = function () {
    this.position = new Block(10, 10);
};

// drawin the apple
Apple.prototype.draw = function () {
    this.position.drawCircle("LimeGreen");
};

//moving the apple
Apple.prototype.move = function () {
    let randomCol = Math.floor(Math.random() * (widthInBlocks - 2) + 1); //Math.random() * (38) + 1 // 0-37 + 1
    let randomRow = Math.floor(Math.random() * (heightInBlocs - 2) + 1); //Math.random() * (38) + 1 // 0-37 + 1
    console.log(randomCol, randomRow);
    this.position = new Block(randomCol, randomRow);
};

//create objects 
let snake = new Snake();
let apple = new Apple();

//setinvterval game
var intervalId = setInterval(function () {
    context.clearRect(0, 0, width, height);
    drawScore();
    snake.move();
    snake.draw();
    apple.draw();
    drawBorder();
}, 100);