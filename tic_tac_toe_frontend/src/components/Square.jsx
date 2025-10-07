import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Square component representing one cell of the board.
 * Props:
 * - value: 'X' | 'O' | null
 * - onClick: () => void
 * - highlight: boolean to indicate winning cell
 * - disabled: boolean to disable interaction
 */
export default function Square({ value, onClick, highlight, disabled }) {
  const classes = [
    'square',
    value === 'X' ? 'x' : '',
    value === 'O' ? 'o' : '',
    highlight ? 'win' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      className={classes}
      onClick={onClick}
      disabled={disabled}
      aria-label={`Square ${value ? value : 'empty'}`}
    >
      <span className="mark">{value}</span>
    </button>
  );
}
