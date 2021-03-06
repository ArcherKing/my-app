/*  
    圈圈叉叉小遊戲
    https://zh-hant.reactjs.org/tutorial/tutorial.html
    1.在歷史動作列表中，用（欄，列）的格式來顯示每個動作的位置。
    2.在動作列表中，將目前被選取的項目加粗。
    3.改寫 Board，使用兩個 loop 建立方格而不是寫死它。
    4.加上一個切換按鈕讓你可以根據每個動作由小到大、由大到小來排序。
    5.當勝負揭曉時，把連成一條線的那三個方格凸顯出來。
    6.當沒有勝負時，顯示遊戲結果為平手。
*/
import React from 'react';
import ReactDOM, { render } from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
            style={props.winSquare ? {backgroundColor: "pink"} : {}}
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        let winSquare;
        if (this.props.winLine) {
            winSquare = this.props.winLine.indexOf(i) !== -1;
        }
        return (
            <Square
                key={i}
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
                winSquare={winSquare}
            />
        );
    }

    render() {
        const indexes = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];

        return (
            <div>
                {indexes.map((row)=>
                    <div key={row} className="board-row">
                        {row.map((i)=>this.renderSquare(i))}
                    </div>
                )}
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
                column: null,
                row: null,
            }],
            stepNumber: 0,
            xIsNext: true,
            ascend: true,
        };
    }

    handleClick(i) {
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
                column: Math.floor(i / 3) + 1,
                row: (i % 3) + 1
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    sorting() {
        this.setState({
            ascend: !this.state.ascend,
        });
    }

    render() {
        const history = this.state.history.slice();
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        let moves = this.state.history.map((step, move) => {
            const desc = move ?
                `Go to move #${move} (${step.column},${step.row})` :
                'Go to game start';
            return (
                <li key={move}>
                    <button
                        style={(move===this.state.stepNumber) ? {fontWeight: "bold"} : {}}
                        onClick={() => this.jumpTo(move)}>{desc}
                    </button>
                </li>
            );
        });

        let state, winLine;
        if (winner) {
            state = 'Winner: ' + winner.winner;
            winLine = winner.winLine;
        } else if (this.state.stepNumber >= 9) {
            state = 'Winner: Draw'
        } else {
            state = 'Next Player: ' + (this.state.xIsNext ? 'X' : 'O');
        }
        
        // 升降序處理
        let sort = this.state.ascend ? 'Ascend' : 'Descend';
        if (!this.state.ascend) {moves.reverse();}

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        winLine={winLine}
                    />
                </div>
                <div className="game-info">
                    <div>{state}</div>
                    <button onClick={() => this.sorting()}>{sort}</button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const line = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < line.length; i++) {
        const [a, b, c] = line[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                winner: squares[a],
                winLine: [a, b, c]
            };
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);