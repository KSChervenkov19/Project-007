var GAME = {
	isComputerPlaying: false,
	isGameOver: false,
	numberOfPlayedSquares: 0,

	gameBoard: [null, null, null, null, null, null, null, null, null],

	squares: $('.square'),

	winningCombos: [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]],

	updateGameBoard: function(index, value, el){
		
		this.gameBoard[index] = value;
		el.html(value);
		
	},

	init: function(){

		this.squares.each(function(){

			$(this).html('');

		});

		this.gameBoard = [null, null, null, null, null, null, null, null, null]; 
		this.isComputerPlaying = false;
		this.isGameOver = false;
		this.numberOfPlayedSquares = 0;

	},

	checkWin: function(value){

		var winner = false;
        
        for (var combo = 0; combo < this.winningCombos.length; combo++){
            var a = this.winningCombos[combo][0];
            var b = this.winningCombos[combo][1];
            var c = this.winningCombos[combo][2];
            
            if (GAME.gameBoard[a] === GAME.gameBoard[b]){
                if (GAME.gameBoard[b] === GAME.gameBoard[c]){
                    if (GAME.gameBoard[a] !== null){
                        this.endGame(value);
                        winner = true;
                    } 
                }
            } 
        } 
        
        return winner;

	},

	endGame: function(value){

		if(value === 'X'){
			alert('Congratulations you won!!!');
		}else if(value === 'O'){
			alert('The Computer won');
		}else{
			alert('It\'s a draw...');
		}

		this.isGameOver = true;

		var playAgain = confirm('Click Ok to play again...');

		if(playAgain === true){
			this.init();
		}

	}

};

var AI = {

	getBestMove: function(){

		var cellRank = [3,2,3,2,4,2,3,2,3];

		for(var i = 0; i < GAME.gameBoard.length; i++){
		    if(GAME.gameBoard[i] !== null){
		        cellRank[i] -= 99;
		    }
		}

		for(var combo = 0; combo < GAME.winningCombos.length; combo++){
		    var a = GAME.winningCombos[combo][0];
		    var b = GAME.winningCombos[combo][1];
		    var c = GAME.winningCombos[combo][2];
		    		    
		    if(GAME.gameBoard[a] === GAME.gameBoard[b]){
		        if(GAME.gameBoard[a] !== null){
		            if(GAME.gameBoard[c] === null){
		                cellRank[c] += 10;
		            }
		        } 
		    }
		    
		    if(GAME.gameBoard[a] === GAME.gameBoard[c]){
		        if(GAME.gameBoard[a] !== null){
		            if(GAME.gameBoard[b] === null){
		                cellRank[b] += 10;
		            } 
		        }
		    } 
		    
		    if(GAME.gameBoard[b] === GAME.gameBoard[c]){
		        if(GAME.gameBoard[b] !== null){
		            if(GAME.gameBoard[a] === null){
		                cellRank[a] += 10;
		            } 
		        } 
		    }         		    
		} 

		var bestCell = -1;
		var highest = -999;

		for(var j = 0; j < GAME.gameBoard.length; j++){
		    if(cellRank[j] > highest){
		        highest = cellRank[j];
		        bestCell = j;
		    }
		}

		return bestCell;        

	},

	playTurn: function(){

		GAME.isComputerPlaying = true;

		var theSquareToPlay = this.getBestMove();

		var $theSelectedSquare = $('.square-0' + theSquareToPlay);

		GAME.numberOfPlayedSquares++;
		setTimeout(function(){
			
			GAME.updateGameBoard(theSquareToPlay, 'O', $theSelectedSquare);
			GAME.checkWin('O');
			GAME.isComputerPlaying = false;

		}, 500);

	}

};
GAME.squares.click(function(){

	var squareIndexValue = parseInt($(this).data('index'));

	function checkIfTurnIsReady(){

		if(GAME.isGameOver){ return false; }
		if(GAME.isComputerPlaying){ return false; }
		if(GAME.gameBoard[squareIndexValue] === null){ return true; }

	}

	var isTurnReady = checkIfTurnIsReady();

	if( isTurnReady ){

		GAME.updateGameBoard( squareIndexValue, 'X', $(this) );
		GAME.numberOfPlayedSquares++;
		var winner = GAME.checkWin('X');
		if(winner === false && GAME.numberOfPlayedSquares < 9){
			AI.playTurn();
		}else if(GAME.numberOfPlayedSquares === 9){
			GAME.endGame('draw');
		} 

	}

}); 