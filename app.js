var config = {
    updatePeriod: 500,
    colorCode: ["blue","red","yellow","green","orange","brown"],
    backgroundColor: "black",
}

var model = {
    board: [],//[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,1,1,0,1,0],...] board[y][x]
    numCols: 9,
    numRows: 10,
    currentStone: [], //[[1,2],[1,3],...] [[x1,y1],[x2,y2],...]
    currentStoneType: 1,
    stoneShapes: [[[0,0],[0,1],[1,0],[1,1]],
                  [[0,0],[0,1],[1,1],[1,2]],
                  [[0,0],[1,0],[1,1],[2,1]],
                  [[0,0],[0,1],[0,2],[0,3]],
                  [[0,0],[1,0],[2,0],[1,1]],
                  [[0,0],[0,1],[0,2],[1,2]],
                  [[0,0],[1,0],[2,0],[2,1]]],
    getStoneShape: function(index){
        // funny thing here: need to retrieve _a_copy_ of a shape but not a reference. This is done with the following workaround 
        return JSON.parse(JSON.stringify(model.stoneShapes[index]));
    },
    init: function(){
        this.initBoard();
        this.generateNewStone();
    },
    initBoard: function(){
        for(let y = 0; y < model.numRows; y++){
            let row = [];
            for(let x = 0; x < model.numCols; x++){
                row[x] = -1;
            }
            model.board[y] = row;
        }
    },
    generateNewStone: function(){
        let numberOfStoneTypes = config.colorCode.length;
        model.currentStoneType = Math.floor(Math.random() * numberOfStoneTypes);
        let xOffset = 4;
        console.log("Chose following stone type: " + model.currentStoneType);
        let newStone = model.getStoneShape(model.currentStoneType);
        for(let i = 0; i < newStone.length; i++){
            newStone[i][0] += xOffset;
        }
        console.log("Created new stone: " + newStone.toString());
        model.currentStone = newStone;
    },
}

var mvc = {
    
    init: function(){
        view.init();
        model.init();
        setInterval(this.game,config.updatePeriod);
    },
    game: function(){
        view.renderBoard(model.board);
        view.renderCurrentStone(model.currentStone,model.currentStoneType);
        let moveCode = mvc.dropCurrentStone();
        if(moveCode === 1){
            model.generateNewStone();
        }
    },
    dropCurrentStone: function(){
        
        if(!this.checkCollisionOnDrop()){

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
            if(!this.stoneContainsCell(model.currentStone,droppedCell)){
                if(droppedCell[1] >= model.numRows){
                    console.log("Stone reached bottom");
                    isCollision = true;
                    break;
                }else if(model.board[droppedCell[1]][droppedCell[0]] != -1 ){
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
            if(!this.stoneContainsCell(model.currentStone,shiftedCell)){
                if(model.board[shiftedCell[1]][shiftedCell[0]] != -1 ){
                    console.log("Stone reached other stone");
                    isCollision = true;
                    break;
                }
            }
        }
        return isCollision;
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

var view = {
    canvas: [],
    ctx: [],
    width: 0,
    heigth: 0,
    cell_width: 0,
    paintCell: function(x, y, color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(x*this.cell_width, y*this.cell_width, this.cell_width, this.cell_width);
        this.ctx.strokeStyle = "white";
        this.ctx.strokeRect(x*this.cell_width, y*this.cell_width, this.cell_width, this.cell_width);
    },
    renderBoard: function(board){
        for(let y = 0; y < board.length; y++){
            let row = board[y];
            for(let x = 0; x < row.length; x++){
                if(row[x] == -1){
                    this.paintCell(x,y,config.backgroundColor);
                }else{
                    this.paintCell(x,y,config.colorCode[row[x]]);
                }
            }
        }
        return;
    },
    renderCurrentStone: function(currentStone, currentStoneType){
        for(let i = 0; i < currentStone.length; i++){
            let curStoneCell = currentStone[i];
            this.paintCell(curStoneCell[0], curStoneCell[1], config.colorCode[currentStoneType]);
        }
        return;
    },
    init: function(){
        //Canvas stuff
        this.canvas = $("#canvas")[0];
        this.ctx = canvas.getContext("2d");
        this.width = $("#canvas").width();
        this.height = $("#canvas").height();
        
        this.cell_width = this.height/model.numRows;
    }
}

$(document).ready(function(){
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

