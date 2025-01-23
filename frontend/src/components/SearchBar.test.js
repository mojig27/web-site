import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SearchBar from './SearchBar';

test('renders search bar and performs search', () => {
  const handleSearch = jest.fn();
  render(<SearchBar onSearch={handleSearch} />);

  const input = screen.getByPlaceholderText('Search for products');
  const button = screen.getByText('Search');

  fireEvent.change(input, { target: { value: 'test' } });
  expect(input.value).toBe('test');

  fireEvent.click(button);
  expect(handleSearch).toHaveBeenCalled();
});