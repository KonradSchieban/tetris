var interval = 60;

var canvas;
var ctx;
var width;
var height;

var config = {
    updatePeriod: 500,
}

var model = {
    board: [],//[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,1,1,0,1,0],...] board[y][x]
    numCols: 9,
    numRows: 10,
    currentStone: [[4,1],[4,2]], //[[1,2],[1,3],...] [[x1,y1],[x2,y2],...]
    currentStoneType: 1,
    colorCode: ["black","blue","red","yellow","green","orange","brown"],
    stoneShapes: [[],
                  [[0,0],[0,1],[1,0],[1,1]],
                  [[0,0],[0,1],[1,1],[1,2]],
                  [[0,0],[1,0],[1,1],[2,1]],
                  [[0,0],[0,1],[0,2],[0,3]],
                  [[0,0],[1,0],[2,0],[1,1]],
                  [[0,0],[0,1],[0,2],[1,2]],
                  [[0,0],[1,0],[2,0],[2,1]]],
    getStoneShape: function(index){
        // funny thing here: need to retrieve _a_copy_ of a shape but not a reference. This is done with the following workaround 
        return JSON.parse(JSON.stringify(model.stoneShapes[index]));
    }
}

var mvc = {
    paintCell: function(x, y, color){
        ctx.fillStyle = color;
        ctx.fillRect(x*cell_width, y*cell_width, cell_width, cell_width);
        ctx.strokeStyle = "white";
        ctx.strokeRect(x*cell_width, y*cell_width, cell_width, cell_width);
    },
    init: function(){
        for(let y = 0; y < model.numRows; y++){
            let row = [];
            for(let x = 0; x < model.numCols; x++){
                row[x] = 0;
            }
            model.board[y] = row;
        }
        mvc.generateNewStone();
        setInterval(mvc.game,config.updatePeriod);
    },
    renderBoard: function(){
        for(let y = 0; y < model.board.length; y++){
            let row = model.board[y];
            for(let x = 0; x < row.length; x++){
                mvc.paintCell(x,y,model.colorCode[row[x]]);
            }
        }
        return;
    },
    renderCurrentStone: function(){
        for(let i = 0; i < model.currentStone.length; i++){
            let curStoneCell = model.currentStone[i];
            mvc.paintCell(curStoneCell[0],curStoneCell[1],model.colorCode[model.currentStoneType]);
        }
        return;
    },
    dropCurrentStone: function(){
        
        if(!mvc.checkCollisionOnDrop()){

            for(let i = 0; i < model.currentStone.length; i++){
                let currentCell = model.currentStone[i];
                currentCell[1]++;
                model.currentStone[i] = currentCell;
            }
            return 0;
        }else{
            for(let i = 0; i < model.currentStone.length; i++){
                let currentCell = model.currentStone[i];
                model.board[currentCell[1]][currentCell[0]] = model.currentStoneType; // do I really need this line?
            }
            return 1;
        }
    },
    checkCollisionOnDrop: function(){
        let isCollision = false;

        for(let i = 0; i < model.currentStone.length; i++){
            let stoneCell = model.currentStone[i];
            let droppedCell = [stoneCell[0],stoneCell[1]+1];
            if(!mvc.stoneContainsCell(model.currentStone,droppedCell)){
                if(droppedCell[1] >= model.numRows){
                    console.log("Stone reached bottom");
                    isCollision = true;
                    break;
                }else if(model.board[droppedCell[1]][droppedCell[0]] != 0 ){
                    console.log("Stone reached other stone");
                    isCollision = true;
                    break;
                }
            }
        }
        return isCollision;
    },
    checkCollisionOnShift: function(xIncr){
        let isCollision = false;

        for(let i = 0; i < model.currentStone.length; i++){
            let stoneCell = model.currentStone[i];
            let shiftedCell = [stoneCell[0]+xIncr,stoneCell[1]];
            if(!mvc.stoneContainsCell(model.currentStone,shiftedCell)){
                if(model.board[shiftedCell[1]][shiftedCell[0]] != 0 ){
                    console.log("Stone reached other stone");
                    isCollision = true;
                    break;
                }
            }
        }
        return isCollision;
    },
    generateNewStone: function(){
        model.currentStoneType = Math.floor(Math.random()*6) + 1;
        let xOffset = 5;
        //let newStone = model.stoneShapes[model.currentStoneType];
        let newStone = model.getStoneShape(model.currentStoneType);
        for(let i = 0; i < newStone.length; i++){
            newStone[i][0] += xOffset;
        }
        console.log("Created new stone: " + newStone.toString());
        model.currentStone = newStone;
    },
    game: function(){
        mvc.renderBoard();
        mvc.renderCurrentStone();
        let moveCode = mvc.dropCurrentStone();
        if(moveCode === 1){
            mvc.generateNewStone();
        }
    },
    moveCurrentStone: function(direction){
        let xIncr;
        if(direction == "left"){
            console.log("moving left");
            xIncr = -1;
        }else if(direction == "right"){
            console.log("moving right");
            xIncr = 1;
        }
        if(mvc.checkMovePossible(xIncr)){
            for(let i = 0; i < model.currentStone.length; i++){
                let currentStoneCell = model.currentStone[i];
                let newCurrentStoneCell = [currentStoneCell[0]+xIncr,currentStoneCell[1]];
                model.currentStone[i] = newCurrentStoneCell;
            }
        }
    },
    checkMovePossible: function(xIncr){
        let isMovePossible = true;
        for(let i = 0; i < model.currentStone.length; i++){
            let currentStoneCell = model.currentStone[i];
            if(currentStoneCell[0]+xIncr < 0 || currentStoneCell[0]+xIncr >= model.numCols){
                //move not possible because border is reached
                isMovePossible = false;
                break;
            }else if(mvc.checkCollisionOnShift(xIncr)){
                //check if collision on side
                isMovePossible = false;
                break;
            }
        }
        return isMovePossible;
    },
    stoneContainsCell: function(stone,cell){
        let contains = false;
        for(let i = 0; i< stone.length; i++){
            stoneCell = stone[i];
            if(stoneCell[0] === cell[0] && stoneCell[1] === cell[1]){
                contains = true;
                break;
            }
        }
        return contains;
    },
    rotateCurrentStone: function(){
        
    }
}

$(document).ready(function(){
	//Canvas stuff
	canvas = $("#canvas")[0];
	ctx = canvas.getContext("2d");
	width = $("#canvas").width();
	height = $("#canvas").height();
	
	//Lets save the cell width in a variable for easy control
	cell_width = height/model.numRows;
	
	mvc.init();
	
});

$(document).keydown(function(e){
	var key = e.which;
	
	if(key == "37"){ 
        mvc.moveCurrentStone("left");
    }else if(key == "38"){ //up
		mvc.rotateCurrentStone();
    }else if(key == "39"){
        mvc.moveCurrentStone("right");
    }
});