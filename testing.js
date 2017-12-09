
var board = [[-1,-1,-1,-1,-1],
         [-1,-1,-1,-1,-1],
         [2,2,1,1,-1],
         [-1,-1,-1,-1,-1],
         [-1,-1,-1,1,-1],
         [2,2,1,1,1],
         [1,2,1,1,1],
         [1,2,3,-1,-1]];

console.log(board);

isRowFull = function(rowIndex){
    let row = board[rowIndex];
    let rowFull = true;
    for(let i = 0; i < row.length; i++){
        if(row[i] === -1){
            rowFull = false;
            break;
        }
    }
    return rowFull;
},
getFullRows = function(board){
    let numberOfRows = board.length;
    let fullRowArray = [];
    for(let i = 0; i < numberOfRows; i++){
        if(this.isRowFull(i)){
            fullRowArray.push(i);
        }
    }
    return fullRowArray;
},         

dropFullRows = function(fullRowArray, board){

    // Delete full rows
    for(let j = 0; j < fullRowArray.length; j++){
        let rowIndex = fullRowArray[j];
        
        for(let k = rowIndex; k > 0; k--){
            //let row = JSON.parse(JSON.stringify(board[k]));
            //let rowAbove = JSON.parse(JSON.stringify(board[k-1]));
            let row = board[k];
            let rowAbove = board[k-1];
            for(let i = 0; i < row.length; i++){
                row[i] = rowAbove[i];
            }
            board[k] = row;
        }
    }
}

var fullRowArray = getFullRows(board); 
if(fullRowArray.length > 0){
    dropFullRows(fullRowArray, board);
}



