import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

beforeEach(() => {
  render(<App />);
})

it('renders Word Statistics title', () => {
  const headingElement = screen.getByText('Word Statistics');
  expect(headingElement).toBeInTheDocument();
});

it('renders text area', () => {
  const textareaElement = screen.getByPlaceholderText('Enter text to analyze');
  expect(textareaElement).toBeInTheDocument();
});

it('renders word freqency area', () => {
  const wordFreqencyElement = screen.getByText('Word Frequency');
	expect(wordFreqencyElement).toBeInTheDocument();
});

it('updates textarea based on input', () => {
  const textareaElement = screen.getByPlaceholderText('Enter text to analyze');
  userEvent.click(textareaElement);
  userEvent.type(textareaElement, 'Hello World');
	expect(textareaElement.value).toEqual('Hello World');
})