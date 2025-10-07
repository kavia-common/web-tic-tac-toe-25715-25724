# Testing

This project uses Jest with React Testing Library via Create React App.

- Unit tests: src/components/__tests__/test_Square.jsx, test_Board.jsx, test_Scoreboard.jsx
- Integration tests: src/App.test.js

Run the tests in CI mode:
CI=true npm test -- --watchAll=false

Run locally (interactive):
npm test

Note: If your environment lacks @testing-library/user-event, install it as a dev dependency:
npm i -D @testing-library/user-event
