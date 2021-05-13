import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
Square is just a function component
When clicked it puts the appropriate design from css file
*/

function Square(props) {
    return (
      <button className="square" onClick={() => props.onClick()}>
        <div className={props.value === 'Red' ? "circle red-player" : props.value === 'Yellow' ? "circle yellow-player" : "circle"}></div>
      </button>
    );
}

class Col extends React.Component {

    renderSquare(i) {
     return(
        <Square value = {this.props.value[i]}  onClick = {this.props.onClick} />
     );
    }
  
    render() {
      return (
        <div className="board-col">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
      );
    }
}

class Board extends React.Component {
    //Default constructor values
    //NOTE: our board array is column x row format 
    //hence 7 x 6
    constructor() {
        super();
        this.state = {
            boardValue: new Array(7).fill(null).map(row => new Array(6).fill(null)),
            redIsNext: true,
            winner: null
        }
    }

    handleReset()
    {   const val = this.state.boardValue.slice();
        for(let c = 0;c<7;c++)
        {
            for(let r = 0;r<6;r++)
            {
                val[c][r] = null;
            }
        }
        this.setState({boardValue:val,
            redIsNext : true,
             winner : null });
    }

    handleClick(col) {
        /* Check if there exists a winner 
        If winner is not null then return since game is over 
        and any other click should not continue playing*/
        if(this.state.winner !== null )
        return;

        const val = this.state.boardValue.slice();
        const curPlayer = this.state.redIsNext? 'Red' : 'Yellow';
        let findResult;

        let level = null;
       
            for(let i = 5 ;i>=0;i--)
            {  
                if(val[col][i] === null)
                {
                level = i;
                val[col][i] = curPlayer;
                break;
                }
            }
            if(level === null)
            return;

        /*THE BELOW LINE CHECKS IF GAME IS OVER NOW
        if it is we know that the curPlayer has won since 
        he is the one who made the move*/
        findResult = gameOver(val);
        var curWinner = findResult? curPlayer : null;

        this.setState({boardValue:val,
                       redIsNext : !this.state.redIsNext,
                        winner : curWinner });
    }

    renderCol(i) {
        
        return(
            <Col onClick = {() => this.handleClick(i)} value = {this.state.boardValue[i]} />
        );
    }

    render() {
        const nextPlayer = this.state.redIsNext ? 'RED' : 'YELLOW'; 
        const currVal = this.state.boardValue.slice();
        var checkFull = isFull(currVal);
        var status = this.state.winner ? 'WINNER : ' + this.state.winner : checkFull ? 'DRAW': 'NEXT PLAYER : ' + nextPlayer;
        
        return (
            <div className="game">
                <div className="status">{status}</div>
                <div className="game-board">
                {this.renderCol(0)}
                {this.renderCol(1)}
                {this.renderCol(2)}
                {this.renderCol(3)}
                {this.renderCol(4)}
                {this.renderCol(5)}
                {this.renderCol(6)}
                </div>
                <div className = "reset">
                <button className ="reset btn"  onClick = {() => this.handleReset()}>
                    RESET
                </button>
                </div>
            </div>
        );
    }
}


function check(a, b, c, d) {
    if(a === b && b === c && c === d && a)
    return true;
    return false;
}


function isFull(board)
{
   for(let c = 0;c < 7; c++)
    {       
           if(board[c][0] === null)
           return false;
    } 
   return true;
}

/*
Function to check if the game is over
check if there exists a winner
take all possible combinations of 4 that can win
and pass it to the check function to see if they are all the same
*/

function gameOver(board) {
    //VERTICAL
    for (let c = 0; c < 7; c++)
        for (let r = 0; r < 3; r++)
            if (check(board[c][r], board[c][r+1], board[c][r+2], board[c][r+3]))
                return true;
    //HORIZONTAL
            for(let r = 0;r<6;r++)
            {
                for(let c = 0;c<4;c++)
                {
                    if(check(board[c][r],board[c+1][r],board[c+2][r],board[c+3][r]))
                    return true;
                }
            }
    //DIAGONAL
            for(let c = 0;c <4;c++)
            {
                for(let r = 0;r <3;r++)
                {
                    if(check(board[c][r],board[c+1][r+1],board[c+2][r+2],board[c+3][r+3]))
                    return true;
                }
            }
    //ANTIDIAGONAL
            for(let c= 6;c>2;c--)
            {
                for(let r = 0;r<3;r++)
                {
                    if(check(board[c][r],board[c-1][r+1],board[c-2][r+2],board[c-3][r+3]))
                    return true;
                }
            }
    return null;
}

/* 
Topmost Component Game
*/

class Game extends React.Component {
    render() {
        return (
            <div>
                <h1>Connect4</h1>
                <Board/>
                
            </div>
        );
    }
}

// ========================================
// Entry Point of Code, Dont change anything
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);