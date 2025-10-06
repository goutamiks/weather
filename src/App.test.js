import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app title and search UI', () => {
  render(<App />);
  expect(screen.getByText('WeatherNow')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Search any city...')).toBeInTheDocument();
  expect(screen.getByTitle('Get Weather')).toBeInTheDocument();
});
