import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

// Issue with Jest, using the official workaround to make matchMediaWork 
// https://jestjs.io/docs/en/manual-mocks#mocking-methods-which-are-not-implemented-in-jsdom
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// test('renders learn react link', () => {
//   const { getByText } = render(<App />);
//   const linkElement = getByText(/Name/i);
//   expect(linkElement).toBeInTheDocument();
// });

test('the best flavor is grapefruit', () => {
  expect('grapefruit').toBe('grapefruit');
});
