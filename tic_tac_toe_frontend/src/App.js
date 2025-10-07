import React, { useMemo, useState } from 'react';
import './App.css';
import './styles/theme.css';
import Board from './components/Board';
import Scoreboard from './components/Scoreboard';

// Utility: calculate winner and return winner symbol and winning indices
// PUBLIC_INTERFACE
export function calculateWinner(squares) {
  /** Determine if there is a winner on the 3x3 board.
   * Returns an object: { winner: 'X'|'O'|null, line: number[]|null }
   * where line contains the indices of the winning squares for highlighting.
   */
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // cols
    [0, 4, 8],
    [2, 4, 6], // diagonals
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: null };
}

// PUBLIC_INTERFACE
export default function App() {
  /** Root application rendering the Tic Tac Toe game using the Ocean Professional theme. */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [winningLine, setWinningLine] = useState(null);
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });

  const currentPlayer = xIsNext ? 'X' : 'O';

  const { winner, line } = useMemo(() => calculateWinner(squares), [squares]);
  const isDraw = useMemo(() => squares.every(Boolean) && !winner, [squares, winner]);

  // Update game over state and scoreboard when winner/draw changes
  if (!gameOver && (winner || isDraw)) {
    if (winner) {
      setGameOver(true);
      setWinningLine(line);
      setScores(prev => ({ ...prev, [winner]: prev[winner] + 1 }));
    } else if (isDraw) {
      setGameOver(true);
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
    }
  }

  const handleSquareClick = (index) => {
    if (gameOver || squares[index]) return; // prevent moves after win or on filled cell
    const nextSquares = squares.slice();
    nextSquares[index] = currentPlayer;
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
  };

  const handleResetGame = () => {
    // Reset clears board but preserves scoreboard
    setSquares(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
    setWinningLine(null);
  };

  const handleNewGame = () => {
    // New Game clears board and scoreboard
    handleResetGame();
    setScores({ X: 0, O: 0, draws: 0 });
  };

  const statusText = winner
    ? `Winner: ${winner}`
    : isDraw
    ? 'Draw!'
    : `Current Player: ${currentPlayer}`;

  return (
    <div className="app-root ocean-bg">
      <div className="container card">
        <header className="header">
          <h1 className="title">Tic Tac Toe</h1>
          <p className={`status ${winner ? 'status-win' : isDraw ? 'status-draw' : ''}`}>
            {statusText}
          </p>
        </header>

        <Scoreboard scores={scores} currentPlayer={winner ? null : currentPlayer} />

        <Board
          squares={squares}
          onSquareClick={handleSquareClick}
          winningLine={winningLine}
          disabled={gameOver}
        />

        <div className="controls">
          <button className="btn primary" onClick={handleResetGame} aria-label="Reset Game">
            Reset Game
          </button>
          <button className="btn outline" onClick={handleNewGame} aria-label="New Game">
            New Game
          </button>
        </div>

        <footer className="footer">
          <small>Ocean Professional Theme • Clean & Modern</small>
        </footer>
      </div>
    </div>
  );
}
