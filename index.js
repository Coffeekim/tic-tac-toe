import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    )
}

    class Board extends React.Component {
        renderSquare(i) {
            return (
                <Square
                    key = {'Square ' + i}
                    value={this.props.squares[i]}
                    onClick={() => this.props.onClick(i)}
                />
            );
        }
        renderSquares(n) {
            let squares = [];
            for (let i = n; i < n + 3; i++) {
                squares.push(this.renderSquare(i));
            }
            return squares;
        }
        renderRows(i) {
            return <div className='board-row'>{this.renderSquares(i)}</div>;
        }
        render(){
            return (
                <div>
                    {this.renderRows(0)}
                    {this.renderRows(3)}
                    {this.renderRows(6)}
                </div>
            );
        }
    }

    class Game extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                history: [{
                    squares: Array(9).fill(null),
                }],
                stepNumber: 0,
                xIsNext:true,
                isDescending: true
            }
        }

        jumpTo(step) {
            this.setState({
                stepNumber: step,
                xIsNext: (step % 2) === 0,
            });
        }

        sortHistory() {
            this.setState({
              isDescending: !this.state.isDescending
            });
          }

        handleClick(i) {
            const locations = [
                [' col 1', ' row 1'],
                [' col 2', ' row 1'],
                [' col 3', ' row 1'],
                [' col 1', ' row 2'],
                [' col 2', ' row 2'],
                [' col 3', ' row 2'],
                [' col 1', ' row 3'],
                [' col 2', ' row 3'],
                [' col 3', ' row 3'],
            ]
            const history = this.state.history.slice(0, this.state.stepNumber + 1);
            const current = history[history.length - 1];
            const squares = current.squares.slice();
            if (calculateWinner(squares) || squares[i]) {
                return;
            }
            squares[i] = this.state.xIsNext ? 'X' : 'O';
            this.setState({
                history: history.concat([{
                    squares: squares,
                    location: locations[i],
                }]),
                stepNumber: history.length,
                xIsNext: !this.state.xIsNext,
            });
        }

        render() {
            const history = this.state.history;
            const current = history[this.state.stepNumber];
            const winner = calculateWinner(current.squares);

            const moves = history.map((step, move) => {
                const desc = move ? 
                    'Go to the move №' + move + ' in ' + history[move].location : 
                    'Go to the game start'
                return(
                    <li key={move}>
                        <button onClick={() => {this.jumpTo(move)}}>
                            {move == this.state.stepNumber ? <b>{desc}</b> : desc}
                        </button>
                    </li>
                );
            });

            let status;
            if (winner) {
                status = 'Winner: ' + winner;
            } else {
                status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
            }
            return (
                <div className="game">
                    <div className="game-board">
                        <Board
                            squares={current.squares}
                            onClick={(i) => this.handleClick(i)}
                        />
                    </div>
                    <div className="game-info">
                        <div>{status}</div>
                        <ol>{this.state.isDescending ? moves : moves.reverse()}</ol>
                        <button onClick={() => this.sortHistory()}>
                            Sort by: {this.state.isDescending ? "Descending" : "Asending"}
                        </button>
                    </div>
                </div>
            );
        }
    }

    function calculateWinner(squares) {
        const lines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];
        for (let i = 0; i < lines.length; i++) {
            const [a, b, c] = lines[i];
            if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
                return squares[a];
            }
        }
        return null;
    }

  // ========================================
  
  const root = ReactDOM.createRoot(document.getElementById("root"));
  root.render(<Game />);
  
