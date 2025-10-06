import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { WeatherProvider } from './Weather';
import Input from './Input';
import Card from './Card';

const mockGeocode = {
  results: [
    { latitude: 12.97, longitude: 77.59, name: 'Bengaluru', admin1: 'Karnataka', country: 'India' }
  ]
};

const mockForecast = {
  current_weather: { temperature: 24.2, weathercode: 3, windspeed: 1.8, winddirection: 37, time: '2025-10-06T12:00' },
  daily: {
    time: ['2025-10-06','2025-10-07','2025-10-08','2025-10-09','2025-10-10'],
    weathercode: [3,2,80,80,61],
    temperature_2m_max: [28,28,28,28,28],
    temperature_2m_min: [20,19,20,20,20]
  }
};

function mockFetchOnce(data, ok = true) {
  return Promise.resolve({ ok, json: () => Promise.resolve(data) });
}

beforeEach(() => {
  jest.spyOn(global, 'fetch').mockImplementation((url) => {
    if (String(url).includes('geocoding-api.open-meteo.com')) {
      return mockFetchOnce(mockGeocode);
    }
    if (String(url).includes('api.open-meteo.com')) {
      return mockFetchOnce(mockForecast);
    }
    return mockFetchOnce({}, false);
  });
});

afterEach(() => {
  jest.restoreAllMocks();
  try { localStorage.clear(); } catch (_) {}
});

test('integration: search then shows current weather and forecast', async () => {
  render(
    <WeatherProvider>
      <Input />
      <Card />
    </WeatherProvider>
  );

  const input = screen.getByPlaceholderText('Search any city...');
  const button = screen.getByTitle('Get Weather');

  fireEvent.change(input, { target: { value: 'Bengaluru' } });
  fireEvent.click(button);

  await waitFor(() => expect(screen.getByText(/Overcast/i)).toBeInTheDocument());

  // Forecast grid should appear
  expect(screen.getByText('Next 5 Days')).toBeInTheDocument();
});


