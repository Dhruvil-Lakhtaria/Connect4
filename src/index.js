import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

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
          {this.renderSquare(5)}
          {this.renderSquare(4)}
          {this.renderSquare(3)}
          {this.renderSquare(2)}
          {this.renderSquare(1)}
          {this.renderSquare(0)}
        </div>
      );
    }
}

class Board extends React.Component {
    
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

    miniMax(tempBoard,curPlayer,alpha,beta,depth,track)
    {
        let score;
        if(depth === 0 || gameOver(tempBoard) || isFull(tempBoard))
        {
            return getScore(tempBoard);
        }
        const opp = (curPlayer === 'Red')?'Yellow':'Red';
        var best = (curPlayer === 'Red')? Infinity:-Infinity;
        var pos = 3;
        for(let c = 0;c<7;c++)
        {
          tempBoard[c][track[c]] = curPlayer;
          track[c]++;
          score = this.miniMax(tempBoard,opp,alpha,beta,depth-1,track);
          track[c]--;
          tempBoard[c][track[c]] = null;

          if(curPlayer === 'Red')
          {
              if(best>score)
              {
                best = score;
                pos = c;
              }
              beta  = beta>best?best:beta;
              if(alpha>beta)
              break;
          }
          else
          {
            if(best<score)
              {
                best = score;
                pos = c;
              }
              alpha = best>alpha?best:alpha;
              if(alpha>beta)
              break;
          }
        }
        if(depth === 8)
        return pos;
        
        return best;
    }

    AIplay()
    { 
        
        
        if(gameOver(this.state.boardValue.slice()))
        return ;
        const val = this.state.boardValue.slice();
        const curPlayer = this.state.redIsNext?'Red':'Yellow';
        let depth = 8;
        var track = new Array(7).fill(7);

        for(let c = 0;c<7;c++)
        {
            for(let r = 0;r<6;r++)
            {
                if(val[c][r] === null)
               {
                track[c] = r;
                break;
               }
            }
        }
        
        var pos = this.miniMax(val,curPlayer,-Infinity,Infinity,depth,track);
        
         val[pos][track[pos]] = curPlayer;
         var curWinner = gameOver(val) ? curPlayer : null;
         this.setState({
             boardValue : val,
                        redIsNext : !this.state.redIsNext,
                        winner :  curWinner
            });
    }
    handleClick(col) {
     
        if(this.state.winner !== null )
        return;

        const val = this.state.boardValue.slice();
        const curPlayer = this.state.redIsNext? 'Red' : 'Yellow';
        let findResult;

        let level = null;
       
            for(let i = 0 ;i<=5;i++)
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

        findResult = gameOver(val);
        var curWinner = findResult? curPlayer : null;

        this.setState({
            boardValue: val,
            redIsNext: !this.state.redIsNext,
            winner: curWinner,},
            () =>   {
                        this.AIplay(); 
                    }
                    );
    }

    renderCol(i) {
        
        return(
            <Col onClick = {() => this.handleClick(i)} value = {this.state.boardValue[i]} />
        );
    }

    render() {
        const nextPlayer = this.state.redIsNext ? 'COMPUTER' : 'USER'; 
        const currVal = this.state.boardValue.slice();
        var checkFull = isFull(currVal);
        var status = this.state.winner ? nextPlayer + ' WINS ' : checkFull ? 'DRAW': 'CAN YOU BEAT THE COMPUTER';
        
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
function calc(a,b,c,d)
{
   var r = 0;
   var y = 0;
   
    if(a === 'Red')
    r++;
    if(b === 'Red')
    r++;
    if(c === 'Red')
    r++;
    if(d === 'Red')
    r++;

    if(a === 'Yellow')
    y++;
    if(b === 'Yellow')
    y++;
    if(c === 'Yellow')
    y++;
    if(d === 'Yellow')
    y++;

    if(y === 4 && r === 0)
    return 5000;

    else if(y === 3 && r === 0)
    return 50;

    else if(y === 2 && r === 0)
    return 4;

    else if(y === 0  && r === 4)
    return -3000;

    else if(y === 0  && r === 3)
    return -100;

    else if(y === 0  && r === 2)
    return -10;

    else
    return 0;
   
}
function getScore(board)
{
    var total = 0;
    //VERTICAL
    for(let c = 0;c<7;c++)
    {
        for(let r = 0;r<3;r++)
        {
            total += calc(board[c][r],board[c][r+1],board[c][r+2],board[c][r+3]);
        }
    }
     //HORIZONTAL
     for(let r = 0;r<6;r++)
     {
         for(let c = 0;c<4;c++)
         {
             total += calc(board[c][r],board[c+1][r],board[c+2][r],board[c+3][r]);
         }
     }
//DIAGONAL
     for(let c = 0;c <4;c++)
     {
         for(let r = 0;r <3;r++)
         {
             total += calc(board[c][r],board[c+1][r+1],board[c+2][r+2],board[c+3][r+3]);
         }
     }
//ANTIDIAGONAL
     for(let c= 6;c>2;c--)
     {
         for(let r = 0;r<3;r++)
         {
             total += calc(board[c][r],board[c-1][r+1],board[c-2][r+2],board[c-3][r+3]);
         }
     }

     return total;
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
           if(board[c][5] === null)
           return false;
    } 
   return true;
}

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

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);