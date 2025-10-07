import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Square from '../Square';

describe('Square component', () => {
  test('renders empty square with appropriate aria-label and role', () => {
    render(<Square value={null} onClick={jest.fn()} highlight={false} disabled={false} />);
    const btn = screen.getByRole('button', { name: /square empty/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveAttribute('aria-label', 'Square empty');
    expect(btn).not.toBeDisabled();
  });

  test('renders X value with classes and label', () => {
    render(<Square value="X" onClick={jest.fn()} highlight={false} disabled={false} />);
    const btn = screen.getByRole('button', { name: /square x/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('square');
    expect(btn).toHaveClass('x');
    expect(btn).not.toHaveClass('o');
    expect(screen.getByText('X')).toBeInTheDocument();
  });

  test('renders O value with classes and label', () => {
    render(<Square value="O" onClick={jest.fn()} highlight={false} disabled={false} />);
    const btn = screen.getByRole('button', { name: /square o/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toHaveClass('square');
    expect(btn).toHaveClass('o');
    expect(btn).not.toHaveClass('x');
    expect(screen.getByText('O')).toBeInTheDocument();
  });

  test('applies highlight class when highlight is true', () => {
    render(<Square value="X" onClick={jest.fn()} highlight={true} disabled={false} />);
    const btn = screen.getByRole('button', { name: /square x/i });
    expect(btn).toHaveClass('win');
  });

  test('respects disabled prop', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Square value={null} onClick={onClick} highlight={false} disabled={true} />);
    const btn = screen.getByRole('button', { name: /square empty/i });
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('calls onClick when enabled', async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Square value={null} onClick={onClick} highlight={false} disabled={false} />);
    const btn = screen.getByRole('button', { name: /square empty/i });
    await user.click(btn);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
