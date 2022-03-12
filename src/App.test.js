import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

beforeEach(() => {
	render(<App />);
});

describe('rendering', () => {
	it('displays title', () => {
		const element = screen.queryByText('Word Statistics');
		expect(element).toBeInTheDocument();
	});

	it('displays text area', () => {
		const element = screen.queryByPlaceholderText('Enter text to analyze');
		expect(element).toBeInTheDocument();
	});

	it('displays frequency label', () => {
		const element = screen.queryByText('Word Frequency');
		expect(element).toBeInTheDocument();
	});
});

describe('input', () => {
	let textarea;

	beforeEach(
		() => (textarea = screen.queryByPlaceholderText('Enter text to analyze'))
	);

	it('updates textarea', () => {
		userEvent.type(textarea, 'Hello World');
		expect(textarea.value).toEqual('Hello World');
	});

	it('inserts tabs in textarea', () => {
		userEvent.type(textarea, 'Hey Hey Hey');
		userEvent.tab(textarea);
		userEvent.type(textarea, 'Goodbye');

		expect(textarea.value).toEqual('Hey Hey Hey\tGoodbye');
	});

  it('retains cursor position after tab', () => {
		userEvent.type(textarea, 'DaveyJones');
		textarea.setSelectionRange(5, 5);
		userEvent.tab(textarea);

		expect(textarea.value).toEqual('Davey\tJones');
	});

  it('replaces selected text on tab', () => {
		userEvent.type(textarea, 'Hello World');
		textarea.setSelectionRange(5, 6);
		userEvent.tab(textarea);

		expect(textarea.value).toEqual('Hello\tWorld');
	});

	it('does not respond to shift-tab', () => {
		userEvent.type(textarea, 'I pressed shift ');
		userEvent.keyboard('{Shift}{Tab}');
		userEvent.type(textarea, 'tab.');

		expect(textarea.value).toEqual('I pressed shift tab.');
	});
});
