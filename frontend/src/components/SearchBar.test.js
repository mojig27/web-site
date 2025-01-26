import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import SearchBar from './SearchBar';

// Mocking axios module
jest.mock('axios');

test('renders search bar and performs search', async () => {
  const handleSearch = jest.fn();
  const mockResponse = { data: [{ _id: '1', name: 'Test Product' }] };

  // Mocking the get method of axios to return a resolved promise with mockResponse
  axios.get.mockResolvedValueOnce(mockResponse);

  render(<SearchBar onSearch={handleSearch} />);

  const input = screen.getByPlaceholderText('Search for products');
  const button = screen.getByText('Search');

  fireEvent.change(input, { target: { value: 'test' } });
  expect(input.value).toBe('test');

  fireEvent.submit(button);

  // انتظار برای فراخوانی تابع handleSearch
  await waitFor(() => expect(handleSearch).toHaveBeenCalledWith(mockResponse.data));
});