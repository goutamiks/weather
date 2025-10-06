import { render, screen, fireEvent } from '@testing-library/react';
import { WeatherProvider } from './Weather';
import Input from './Input';

test('allows typing and disables submit when empty', () => {
  render(
    <WeatherProvider>
      <Input />
    </WeatherProvider>
  );
  const input = screen.getByPlaceholderText('Search any city...');
  const button = screen.getByTitle('Get Weather');
  expect(button).toBeDisabled();
  fireEvent.change(input, { target: { value: 'Paris' } });
  expect(button).not.toBeDisabled();
});


