import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App, { listWords, setSelectedText } from './App';

describe('rendering', () => {
	it('displays title', () => {
		render(<App />);

		const element = screen.queryByText('Word Statistics');
		expect(element).toBeInTheDocument();
	});

	it('displays text area', () => {
		render(<App />);

		const element = screen.queryByTestId('text-input');
		expect(element).toBeInTheDocument();
	});

	it('displays frequency label', () => {
		render(<App />);

		const element = screen.queryByText('Word Frequency');
		expect(element).toBeInTheDocument();
	});
});

describe('keyboard input', () => {
	function bootstrapApp() {
		render(<App />);
		return screen.queryByTestId('text-input');
	}

	it('updates textarea', () => {
		const textarea = bootstrapApp();

		userEvent.type(textarea, 'Hello World');
		expect(textarea.value).toEqual('Hello World');
	});

	it('inserts tabs in textarea', () => {
		const textarea = bootstrapApp();

		userEvent.type(textarea, 'Hey Hey Hey');
		userEvent.tab(textarea);
		userEvent.type(textarea, 'Goodbye');

		expect(textarea.value).toEqual('Hey Hey Hey\tGoodbye');
	});

	it('retains cursor position after tab', () => {
		const textarea = bootstrapApp();

		userEvent.type(textarea, 'DaveyJones');
		textarea.setSelectionRange(5, 5);
		userEvent.tab(textarea);

		expect(textarea.value).toEqual('Davey\tJones');
	});

	it('replaces selected text on tab', () => {
		const textarea = bootstrapApp();

		userEvent.type(textarea, 'Hello World');
		textarea.setSelectionRange(5, 6);
		userEvent.tab(textarea);

		expect(textarea.value).toEqual('Hello\tWorld');
	});

	it('does not respond to shift-tab', () => {
		const textarea = bootstrapApp();

		userEvent.type(textarea, 'I pressed shift ');
		userEvent.keyboard('{Shift}{Tab}');
		userEvent.type(textarea, 'tab.');

		expect(textarea.value).toEqual('I pressed shift tab.');
	});
});

describe('select word', () => {
	it('set text selection on callback', () => {
		let recievedStart;
		let recievedEnd;
		let focusCalled = false;

		const textArea = {
			current: {
				focus: () => {
					focusCalled = true;
				},
				setSelectionRange: (start, end) => {
					recievedStart = start;
					recievedEnd = end;
				},
				scrollTop: 0,
				scrollHeight: 100,
				value: 'This is text in the textarea',
			},
		};

		setSelectedText(textArea, 5, 10);

		expect(textArea.current.scrollTop).toEqual(100);
		expect(recievedStart).toEqual(5);
		expect(recievedEnd).toEqual(10);
		expect(focusCalled).toBeTruthy();
	});

	it('highlight selected test', () => {
		const text = 'This is an example sentence.';
		const search = 'example';

		render(<App />);

		const textarea = screen.queryByTestId('text-input');
		userEvent.type(textarea, text);

		const findInput = screen.queryByTestId('find-input');
		userEvent.type(findInput, search);

		const findButton = screen.queryByText('Find Next');
		userEvent.click(findButton);

		const expectedStart = text.indexOf(search);
		const expectedEnd = expectedStart + search.length;
		expect(textarea.selectionStart).toEqual(expectedStart);
		expect(textarea.selectionEnd).toEqual(expectedEnd);
	});
});

describe('replace word', () => {
	it('replaces the first word after the cursor position', () => {
		const text = 'This example is an example sentence with many examples.';
		const search = 'example';
		const replace = 'wat';

		render(<App />);

		const textarea = screen.queryByTestId('text-input');
		userEvent.type(textarea, text);

		// Selection Range is not updated without typing from userEvent
		textarea.setSelectionRange(15, 15);
		userEvent.type(textarea, '{space}{backspace}');

		const findInput = screen.queryByTestId('find-input');
		userEvent.type(findInput, search);

		const replaceInput = screen.queryByTestId('replace-input');
		userEvent.type(replaceInput, replace);

		const replaceButton = screen.queryByText('Replace');
		userEvent.click(replaceButton);

		console.log(textarea.value);
		expect(textarea.value.startsWith('This example is an wat')).toBeTruthy();
	});
});

describe('listWords', () => {
	it('returns an empty with no input', () => {
		expect(listWords('')).toEqual([]);
	});

	it('returns an empty with whitespaces', () => {
		expect(listWords('  \t\t \t \t  \t\t')).toEqual([]);
	});

	it('returns input as words', () => {
		const wordList = listWords('hot bannana');
		expect(wordList).toEqual(['hot', 'bannana']);
	});

	it('does not return empty strings', () => {
		const wordList = listWords('cold \t ice   cream');
		expect(wordList).toEqual(['cold', 'ice', 'cream']);
	});

	it('removes most punctionation', () => {
		const wordList = listWords('hot, fudge!?!? count me in!!!!.');
		expect(wordList).toEqual(['hot', 'fudge', 'count', 'me', 'in']);
	});

	it('converts characters to lowercase', () => {
		const wordList = listWords('CAN YOU HEAR ME');
		expect(wordList).toEqual(['can', 'you', 'hear', 'me']);
	});

	it('retains apostrhpe punctiation mark', () => {
		const wordList = listWords("would've could've should've");
		expect(wordList).toEqual(["would've", "could've", "should've"]);
	});
});
