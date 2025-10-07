import React from 'react';
import { render, screen } from '@testing-library/react';
import Scoreboard from '../Scoreboard';

describe('Scoreboard component', () => {
  test('renders X, Draws, and O with values', () => {
    render(<Scoreboard scores={{ X: 2, O: 1, draws: 3 }} currentPlayer={'X'} />);
    expect(screen.getByText('X')).toBeInTheDocument();
    expect(screen.getByText('O')).toBeInTheDocument();
    expect(screen.getByText('Draws')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('applies active class to current player X', () => {
    render(<Scoreboard scores={{ X: 0, O: 0, draws: 0 }} currentPlayer={'X'} />);
    const cards = screen.getAllByText(/X|O|Draws/).map((el) => el.closest('.card-mini'));
    // First card is X per component structure
    expect(cards[0]).toHaveClass('active');
    // Third card is O, should not be active
    expect(cards[2]).not.toHaveClass('active');
  });

  test('applies active class to current player O', () => {
    render(<Scoreboard scores={{ X: 0, O: 0, draws: 0 }} currentPlayer={'O'} />);
    const cards = screen.getAllByText(/X|O|Draws/).map((el) => el.closest('.card-mini'));
    expect(cards[2]).toHaveClass('active');
    expect(cards[0]).not.toHaveClass('active');
  });

  test('no active card when currentPlayer is null', () => {
    render(<Scoreboard scores={{ X: 1, O: 2, draws: 0 }} currentPlayer={null} />);
    const elements = screen.getAllByRole('heading', { hidden: true });
    // Snapshot alternative: ensure neither X nor O card has active
    const labels = screen.getAllByText(/X|O|Draws/);
    const cards = labels.map((l) => l.closest('.card-mini'));
    cards.forEach((card) => expect(card).not.toHaveClass('active'));
  });
});
