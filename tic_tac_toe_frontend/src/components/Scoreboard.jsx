import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Scoreboard component showing scores for players X, O, and Draws.
 * Props:
 * - scores: { X: number, O: number, draws: number }
 * - currentPlayer: 'X' | 'O' | null
 */
export default function Scoreboard({ scores, currentPlayer }) {
  return (
    <div className="scoreboard">
      <div className={`score card-mini ${currentPlayer === 'X' ? 'active' : ''}`}>
        <span className="label">X</span>
        <span className="value">{scores.X}</span>
      </div>
      <div className="score card-mini neutral">
        <span className="label">Draws</span>
        <span className="value">{scores.draws}</span>
      </div>
      <div className={`score card-mini ${currentPlayer === 'O' ? 'active' : ''}`}>
        <span className="label">O</span>
        <span className="value">{scores.O}</span>
      </div>
    </div>
  );
}
