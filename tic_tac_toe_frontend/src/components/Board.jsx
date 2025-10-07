import React from 'react';
import Square from './Square';

/**
 * PUBLIC_INTERFACE
 * Board component that renders a 3x3 grid of squares.
 * Props:
 * - squares: string[] of length 9 containing 'X' | 'O' | null
 * - onSquareClick: (index: number) => void
 * - winningLine: number[] | null for highlighting winning squares
 * - disabled: boolean to prevent clicks after game is over
 */
export default function Board({ squares, onSquareClick, winningLine, disabled }) {
  const renderSquare = (i) => {
    const isWinning = Array.isArray(winningLine) && winningLine.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => !disabled && onSquareClick(i)}
        highlight={isWinning}
        disabled={disabled || Boolean(squares[i])}
      />
    );
  };

  return (
    <div className="board">
      <div className="row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
}
