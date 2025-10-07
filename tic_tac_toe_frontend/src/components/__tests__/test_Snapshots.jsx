import React from 'react';
import { render } from '@testing-library/react';
import Square from '../Square';
import Board from '../Board';

describe('Snapshot tests (stable markup)', () => {
  test('Square empty renders consistently', () => {
    const { container } = render(<Square value={null} onClick={() => {}} highlight={false} disabled={false} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  test('Board empty renders 9 buttons consistently', () => {
    const { container } = render(
      <Board squares={Array(9).fill(null)} onSquareClick={() => {}} winningLine={null} disabled={false} />
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});
