import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

test('renders button and fires click', () => {
  const onClick = jest.fn();
  render(<Button value="Click" onClick={onClick} />);
  const btn = screen.getByRole('button', { name: 'Click' });
  fireEvent.click(btn);
  expect(onClick).toHaveBeenCalledTimes(1);
});


