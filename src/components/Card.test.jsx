import { render, screen } from '@testing-library/react';
import { WeatherProvider } from './Weather';
import Card from './Card';

test('shows placeholder before any search', () => {
  render(
    <WeatherProvider>
      <Card />
    </WeatherProvider>
  );
  expect(screen.getByText('Welcome to Weather Now!')).toBeInTheDocument();
});


