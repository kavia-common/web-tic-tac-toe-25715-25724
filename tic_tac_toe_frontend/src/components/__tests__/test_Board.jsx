import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Board from '../Board';

function makeSquares(values = Array(9).fill(null)) {
  return values;
}

describe('Board component', () => {
  test('renders 9 squares', () => {
    render(
      <Board
        squares={makeSquares()}
        onSquareClick={jest.fn()}
        winningLine={null}
        disabled={false}
      />
    );
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(9);
  });

  test('passes clicks up to onSquareClick when not disabled', async () => {
    const user = userEvent.setup();
    const onSquareClick = jest.fn();
    render(
      <Board
        squares={makeSquares()}
        onSquareClick={onSquareClick}
        winningLine={null}
        disabled={false}
      />
    );
    const first = screen.getAllByRole('button')[0];
    await user.click(first);
    expect(onSquareClick).toHaveBeenCalledWith(0);
  });

  test('does not call onSquareClick when disabled', async () => {
    const user = userEvent.setup();
    const onSquareClick = jest.fn();
    render(
      <Board
        squares={makeSquares()}
        onSquareClick={onSquareClick}
        winningLine={null}
        disabled={true}
      />
    );
    const first = screen.getAllByRole('button')[0];
    expect(first).toBeDisabled();
    await user.click(first);
    expect(onSquareClick).not.toHaveBeenCalled();
  });

  test('highlights winning line', () => {
    const winningLine = [0, 1, 2];
    const squares = ['X', 'X', 'X', null, null, null, null, null, null];
    render(
      <Board
        squares={squares}
        onSquareClick={jest.fn()}
        winningLine={winningLine}
        disabled={true}
      />
    );
    const buttons = screen.getAllByRole('button');
    winningLine.forEach((idx) => {
      expect(buttons[idx]).toHaveClass('win');
    });
  });
});
