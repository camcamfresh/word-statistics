import { render, screen } from '@testing-library/react';
import App from './App';

beforeEach(() => {
  render(<App />);
})

test('renders Word Statistics title', () => {
  const headingElement = screen.getByText('Word Statistics');
  expect(headingElement).toBeInTheDocument();
});

test('renders text area', () => {
  const textareaElement = screen.getByPlaceholderText('Enter text to analyze');
  expect(textareaElement).toBeInTheDocument();
});

test('renders word freqency area', () => {
  const wordFreqencyElement = screen.getByText('Word Frequency');
	expect(wordFreqencyElement).toBeInTheDocument();
});