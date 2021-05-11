import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

/*
Square is just a function component
When clicked it puts the appropriate design from css file
You need to just assign the correct div name for each value
check css file for div names, the ones needed here are
circle red-player, circle yellow-player, circle
I have put dollar signs where you need to fill up
*/

function Square(props) {
    return (
      <button className="square" onClick={() => props.onClick()}>
        <div className={props.value === 'Red' ? "circle red-player" : props.value === 'Yellow' ? "circle yellow-player" : "circle"}></div>
      </button>
    );
}

/*
in renderSquare call the square component
pass value and onclick props to it
in the render method of Col component
call render square for all squares in
1 column that is from 0-5.
inside the div board-col
*/
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
    //hence 7 x 6, don't get confused
    constructor() {
        super();
        this.state = {
            boardValue: new Array(7).fill(null).map(row => new Array(6).fill(null)),
            redIsNext: true,
            winner: null
        }
    }

    handleClick(col) {
        /* Check if there exists a winner 
        If winner is not null then return since game is over 
        and any other click should not continue playing*/

        const val = this.state.boardValue.slice();
        const curPlayer = this.state.redIsNext? 'Red' : 'Yellow';
        let findResult;
        val[0][0]  = 'Yellow';

        /*val is our current board
        check for the [col][0-5] which is the first free cell
        since in connect4 there can only be 1 position 
        for each column in a particular turn
        assign that cell the curPlayer value
        after making the turn call gameOver function
        and assign that value to findResult
        NOTE: when looping from 0-5 if we have reached the end(5)
        of the loop and there is no empty cell that implies the column
        is filled, so return immediately since the play is not possible
        NEED to use some jump statements like return, break, goto, continue etc...*/


        /*THE BELOW LINE CHECKS IF GAME IS OVER NOW
        if it is we know that the curPlayer has won since 
        he is the one who made the move*/
        var curWinner = findResult? curPlayer : null;

        /*call this.setState now
        boardValue will be val
        redIsNext should be complemented
        winner assign curWinner*/
        this.setState({boardValue:val,
                       redIsNext : !this.state.redIsNext,
                        winner : null });
        
    }

    renderCol(i) {
        /* Call Column Component Here
        Pass the onclick handler and
        that column's values */
        return(
            <Col onClick = {() => this.handleClick(i)} value = {this.state.boardValue[i]} />
        );
    }

    render() {
        const nextPlayer = this.state.redIsNext ? 'RED' : 'YELLOW'; 
        var status = this.state.winner ? 'WINNER : ' + this.state.winner: 'NEXT PLAYER : ' + nextPlayer;
        // If there exists a winner status should show winner is ---
        // Else status should show next player is ---
        // Use the state values winner and isRedNext for doing the above conditions easily

        /* Render all 7 columns (0-6)
        inside the div game-board */
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
            </div>
        );
    }
}

/*
Return true if all 4 positions have the same colour
Else return false
NOTE(possible bug): if all 4 have null then it should return false 
since the game is not over, don't return true there
*/

function check(a, b, c, d) {
    if(a === b && b === c && c === d && a)
    return true;
    return false;
}

/*
Function to check if the game is over
check if there exists a winner
take all possible combinations of 4 that can win
and pass it to the check function to see if they are all the same
I have checked for all vertical conditions
In a similar manner check for the other 3 directions
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
Call Board Component from game
write one line to call board below the h1 header
no props passed 
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