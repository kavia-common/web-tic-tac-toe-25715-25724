import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App, { calculateWinner } from './App';

function getSquares() {
  return screen.getAllByRole('button', { name: /square/i });
}

function clickSquare(index) {
  return userEvent.click(getSquares()[index]);
}

describe('Utility calculateWinner', () => {
  test('detects row win', () => {
    const { winner, line } = calculateWinner(['X', 'X', 'X', null, null, null, null, null, null]);
    expect(winner).toBe('X');
    expect(line).toEqual([0, 1, 2]);
  });

  test('detects column win', () => {
    const { winner, line } = calculateWinner(['O', null, null, 'O', null, null, 'O', null, null]);
    expect(winner).toBe('O');
    expect(line).toEqual([0, 3, 6]);
  });

  test('detects diagonal win', () => {
    const { winner, line } = calculateWinner(['X', null, null, null, 'X', null, null, null, 'X']);
    expect(winner).toBe('X');
    expect(line).toEqual([0, 4, 8]);
  });

  test('no winner returns nulls', () => {
    const { winner, line } = calculateWinner(Array(9).fill(null));
    expect(winner).toBeNull();
    expect(line).toBeNull();
  });
});

describe('App integration tests', () => {
  test('renders title, status, scoreboard, board and controls with accessible labels', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /tic tac toe/i })).toBeInTheDocument();
    expect(screen.getByText(/current player: x/i)).toBeInTheDocument();

    // Controls
    expect(screen.getByRole('button', { name: /reset game/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /new game/i })).toBeInTheDocument();

    // Board squares with aria-labels
    const squares = getSquares();
    expect(squares).toHaveLength(9);
    squares.forEach((sq) => {
      expect(sq).toHaveAttribute('aria-label');
    });

    // Scoreboard values present
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('O')).toBeInTheDocument();
    expect(screen.getByText(/draws/i)).toBeInTheDocument();
  });

  test('turn alternates: X starts then O', async () => {
    render(<App />);
    const user = userEvent.setup();

    expect(screen.getByText(/current player: x/i)).toBeInTheDocument();

    await user.click(getSquares()[0]); // X
    expect(screen.getByText(/current player: o/i)).toBeInTheDocument();

    await user.click(getSquares()[1]); // O
    expect(screen.getByText(/current player: x/i)).toBeInTheDocument();
  });

  test('X can win, winner status displayed, board disabled, scoreboard increments X', async () => {
    render(<App />);
    const user = userEvent.setup();

    // X: 0, O: 3, X: 1, O: 4, X: 2 -> X wins on top row
    await user.click(getSquares()[0]); // X
    await user.click(getSquares()[3]); // O
    await user.click(getSquares()[1]); // X
    await user.click(getSquares()[4]); // O
    await user.click(getSquares()[2]); // X

    expect(screen.getByText(/winner: x/i)).toBeInTheDocument();

    // All squares should be disabled after win
    getSquares().forEach((sq) => {
      expect(sq).toBeDisabled();
    });

    // Scoreboard X incremented to 1
    const xCard = screen.getAllByText('X')[0].closest('.card-mini');
    expect(within(xCard).getByText('1')).toBeInTheDocument();
  });

  test('O can win and scoreboard increments O', async () => {
    render(<App />);
    const user = userEvent.setup();

    // Sequence to make O win: X:0, O:4, X:1, O:0? Can't play occupied; choose valid plan:
    // O wins on column 0: X:1, O:0, X:2, O:3, X:4, O:6
    await user.click(getSquares()[1]); // X
    await user.click(getSquares()[0]); // O
    await user.click(getSquares()[2]); // X
    await user.click(getSquares()[3]); // O
    await user.click(getSquares()[4]); // X
    await user.click(getSquares()[6]); // O wins

    expect(screen.getByText(/winner: o/i)).toBeInTheDocument();

    const oCard = screen.getAllByText('O')[0].closest('.card-mini');
    expect(within(oCard).getByText('1')).toBeInTheDocument();
  });

  test('draw detection updates status and increments draws', async () => {
    render(<App />);
    const user = userEvent.setup();

    // Fill board to a draw:
    // X:0 O:1 X:2 O:4 X:3 O:5 X:7 O:6 X:8 -> no winner
    await user.click(getSquares()[0]); // X
    await user.click(getSquares()[1]); // O
    await user.click(getSquares()[2]); // X
    await user.click(getSquares()[4]); // O
    await user.click(getSquares()[3]); // X
    await user.click(getSquares()[5]); // O
    await user.click(getSquares()[7]); // X
    await user.click(getSquares()[6]); // O
    await user.click(getSquares()[8]); // X

    expect(screen.getByText(/draw!/i)).toBeInTheDocument();

    // All squares disabled
    getSquares().forEach((sq) => {
      expect(sq).toBeDisabled();
    });

    // Draws incremented to 1
    const drawsCard = screen.getByText(/draws/i).closest('.card-mini');
    expect(within(drawsCard).getByText('1')).toBeInTheDocument();
  });

  test('Reset Game clears board, preserves scoreboard, and X starts', async () => {
    render(<App />);
    const user = userEvent.setup();

    // Make X win to update score
    await user.click(getSquares()[0]); // X
    await user.click(getSquares()[3]); // O
    await user.click(getSquares()[1]); // X
    await user.click(getSquares()[4]); // O
    await user.click(getSquares()[2]); // X wins

    const xCard = screen.getAllByText('X')[0].closest('.card-mini');
    expect(within(xCard).getByText('1')).toBeInTheDocument();

    // Reset
    await user.click(screen.getByRole('button', { name: /reset game/i }));
    // Board cleared and re-enabled
    getSquares().forEach((sq) => {
      expect(sq).toBeEnabled();
      expect(sq).toHaveAccessibleName(/square empty/i);
    });

    // Score preserved
    expect(within(xCard).getByText('1')).toBeInTheDocument();

    // X starts
    expect(screen.getByText(/current player: x/i)).toBeInTheDocument();
  });

  test('New Game clears board and resets scoreboard', async () => {
    render(<App />);
    const user = userEvent.setup();

    // Update some scoreboard state: X win then Draw
    await user.click(getSquares()[0]); // X
    await user.click(getSquares()[3]); // O
    await user.click(getSquares()[1]); // X
    await user.click(getSquares()[4]); // O
    await user.click(getSquares()[2]); // X wins

    const xCard = screen.getAllByText('X')[0].closest('.card-mini');
    expect(within(xCard).getByText('1')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /new game/i }));

    // Scores reset to 0
    const cards = screen.getAllByText(/X|O|Draws/).map((el) => el.closest('.card-mini'));
    cards.forEach((card) => {
      expect(within(card).getByText('0')).toBeInTheDocument();
    });

    // Board empty and enabled
    getSquares().forEach((sq) => {
      expect(sq).toBeEnabled();
      expect(sq).toHaveAccessibleName(/square empty/i);
    });

    // X starts
    expect(screen.getByText(/current player: x/i)).toBeInTheDocument();
  });

  test('cannot place mark on already filled square', async () => {
    render(<App />);
    const user = userEvent.setup();

    await user.click(getSquares()[0]); // X
    expect(getSquares()[0]).toHaveAccessibleName(/square x/i);

    await user.click(getSquares()[0]); // attempt overwrite
    // Should still be X and not alternate turn because Board disables filled square button
    expect(getSquares()[0]).toHaveAccessibleName(/square x/i);
  });
});
