import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Replace, {
	getSearchRegex,
	getStartWordRegex,
	getWordRegex,
	getRegexFlags,
} from './Replace';

describe('rendering', () => {
	it("displays 'Find & Replace' label", () => {
		render(<Replace />);

		const element = screen.queryByText('Find & Replace Words');
		expect(element).toBeInTheDocument();
	});

	it('display input labels for both find & replace', () => {
		render(<Replace />);

		const element1 = screen.queryByText('Find what:');
		const element2 = screen.queryByText('Replace with:');

		expect(element1).toBeInTheDocument();
		expect(element2).toBeInTheDocument();
	});

	it('displays find input', () => {
		render(<Replace />);

		const element1 = screen.getByTestId('find-input');
		const element2 = screen.getByTestId('replace-input');

		expect(element1).toBeInTheDocument();
		expect(element2).toBeInTheDocument();
	});

	it('displays buttons', () => {
		render(<Replace />);

		const buttons = screen.queryAllByRole('button');

		expect(buttons[0].innerHTML).toEqual('Find Next');
		expect(buttons[1].innerHTML).toEqual('grepline');
		expect(buttons[2].innerHTML).toEqual('Replace');
		expect(buttons[3].innerHTML).toEqual('Replace All');
	});

	it('disables buttons when there is no text', () => {
		render(<Replace />);

		const buttons = screen.queryAllByRole('button');

		buttons.forEach((button) => {
			expect(button.disabled).toBeTruthy();
		});
	});

	it('enables Find buttons when text & search words are present', () => {
		render(<Replace text='This is example text.' />);

		const findInput = screen.getByTestId('find-input');
		userEvent.type(findInput, 'a');

		const findButton = screen.queryByText('Find Next');
		expect(findButton.disabled).toBeFalsy();

		const findAllButton = screen.queryByText('grepline');
		expect(findAllButton.disabled).toBeFalsy();
	});

	it('enables "Replace" & "Replace All" buttons when text, search, & replace words are present', () => {
		render(<Replace text='This is example text.' />);

		const findInput = screen.getByTestId('find-input');
		userEvent.type(findInput, 'a');

		const replaceInput = screen.getByTestId('replace-input');
		userEvent.type(replaceInput, 'a');

		const buttons = screen.queryAllByRole('button');
		buttons.forEach((button) => {
			expect(button.disabled).toBeFalsy();
		});
	});

	it('disables all buttons if search contains separator', () => {
		render(<Replace text='This is example text.' />);

		const findInput = screen.getByTestId('find-input');
		userEvent.type(findInput, ' ');

		const buttons = screen.queryAllByRole('button');
		buttons.forEach((button) => {
			expect(button.disabled).toBeTruthy();
		});
	});

	it('disables replace buttons if contains separator', () => {
		render(<Replace text='This is example text.' />);

		const findInput = screen.getByTestId('find-input');
		userEvent.type(findInput, 'a');

		const replaceInput = screen.getByTestId('replace-input');
		userEvent.type(replaceInput, ' ');

		const buttons = screen.queryAllByRole('button');
		expect(buttons[0].disabled).toBeFalsy();
		expect(buttons[1].disabled).toBeFalsy();
		expect(buttons[2].disabled).toBeTruthy();
		expect(buttons[3].disabled).toBeTruthy();
	});
});

describe('action', () => {
	it('sets no result when word not found on Find Next', () => {
		render(<Replace text='a' />);

		const findInput = screen.getByTestId('find-input');
		userEvent.type(findInput, 'b');

		const findButton = screen.queryByText('Find Next');
		findButton.click();

		const resultText = screen.queryByTestId('result-text');
		expect(resultText.innerHTML.endsWith('No results found.')).toBeTruthy();
	});

	it('sets no result when word not found on Find All', () => {
		render(<Replace text='a' />);

		const findInput = screen.getByTestId('find-input');
		userEvent.type(findInput, 'b');

		const findButton = screen.queryByText('grepline');
		findButton.click();

		const resultText = screen.queryByTestId('result-text');
		expect(resultText.innerHTML.endsWith('No results found.')).toBeTruthy();
	});

	it('sets not result when word not found on replace', () => {
		render(<Replace text='a' selection={{}} setSelection={() => {}} />);

		const findInput = screen.getByTestId('find-input');
		userEvent.type(findInput, 'b');

		const replaceInput = screen.getByTestId('replace-input');
		userEvent.type(replaceInput, 'c');

		const replaceButton = screen.queryByText('Replace');
		replaceButton.click();

		const resultText = screen.queryByTestId('result-text');
		expect(resultText.innerHTML.endsWith('No results found.')).toBeTruthy();
	});

	it('sets not result when word not found on replace all', () => {
		render(<Replace text='a' />);

		const findInput = screen.getByTestId('find-input');
		userEvent.type(findInput, 'b');

		const replaceInput = screen.getByTestId('replace-input');
		userEvent.type(replaceInput, 'c');

		const replaceAllButton = screen.queryByText('Replace All');
		replaceAllButton.click();

		const resultText = screen.queryByTestId('result-text');
		expect(resultText.innerHTML.endsWith('No results found.')).toBeTruthy();
	});

	it('sets no result when replaces last word', () => {
		let myText = 'a';
		const setMyText = (text) => {
			myText = text;
		};

		render(<Replace text={myText} setText={setMyText} selection={{}} />);

		const findInput = screen.getByTestId('find-input');
		userEvent.type(findInput, 'c');

		const replaceInput = screen.getByTestId('replace-input');
		userEvent.type(replaceInput, 'b');

		const replaceButton = screen.queryByText('Replace');
		replaceButton.click();

		const resultText = screen.queryByTestId('result-text');
		expect(resultText.innerHTML.endsWith('No results found.')).toBeTruthy();
	});

	it('sets result replaced on replace', () => {
		var myText = 'a a';
		const setMyText = (text) => {
			myText = text;
		};

		render(
			<Replace
				text={myText}
				setText={setMyText}
				selection={{
					start: 0,
					end: 0,
				}}
				setSelection={() => {}}
			/>
		);

		const findInput = screen.getByTestId('find-input');
		userEvent.type(findInput, 'a');

		const replaceInput = screen.getByTestId('replace-input');
		userEvent.type(replaceInput, 'b');

		const replaceButton = screen.queryByText('Replace');
		replaceButton.click();

		const resultText = screen.queryByTestId('result-text');
		expect(resultText.innerHTML.endsWith('Word replaced.')).toBeTruthy();
		expect(myText).toEqual('b a');
	});

	it('sets last result replaced on replace', () => {
		var myText = 'a';
		const setMyText = (text) => {
			myText = text;
		};

		render(
			<Replace
				text={myText}
				setText={setMyText}
				selection={{
					start: 0,
					end: 0,
				}}
				setSelection={() => {}}
			/>
		);

		const findInput = screen.getByTestId('find-input');
		userEvent.type(findInput, 'a');

		const replaceInput = screen.getByTestId('replace-input');
		userEvent.type(replaceInput, 'c');

		const replaceButton = screen.queryByText('Replace');
		replaceButton.click();

		const resultText = screen.queryByTestId('result-text');
		expect(resultText.innerHTML.endsWith('Last word replaced.')).toBeTruthy();

		expect(myText).toEqual('c');
	});
});

describe('getSearchRegex', () => {
	it('matches searches at beginning', () => {
		const searchRegex = getSearchRegex('matcher');

		expect('matcher example'.match(searchRegex)).toBeTruthy();
	});

	it('matches searches at end', () => {
		const searchRegex = getSearchRegex('matcher');

		expect('example matcher'.match(searchRegex)).toBeTruthy();
	});

	it('matches searches without leading or trailing punctuation', () => {
		const searchRegex = getSearchRegex('matcher');

		expect('matcher!'.match(searchRegex)).toBeTruthy();
		expect('?matcher'.match(searchRegex)).toBeTruthy();
		expect('matcher.'.match(searchRegex)).toBeTruthy();
	});

	it('matches searches within braces or brackets', () => {
		const searchRegex = getSearchRegex('matcher');

		expect('(matcher)'.match(searchRegex)).toBeTruthy();
		expect('[matcher]'.match(searchRegex)).toBeTruthy();
		expect('{matcher}'.match(searchRegex)).toBeTruthy();
	});

	it('does not match words with apostrophes', () => {
		const searchRegex = getSearchRegex('matcher');

		expect("matcher'".match(searchRegex)).toBeFalsy();
		expect("matcher's".match(searchRegex)).toBeFalsy();
	});
});

describe('getStartWordRegex', () => {
	it('matches starting words', () => {
		const searchRegex = getStartWordRegex('must');

		expect('must'.match(searchRegex)).toBeTruthy();
	});

	it('does not match non-starting words', () => {
		const searchRegex = getStartWordRegex('must');

		expect(' must'.match(searchRegex)).toBeFalsy();
	});
});

describe('getWordRegex', () => {
	it('matches starting words', () => {
		const searchRegex = getWordRegex('must');

		expect('must'.match(searchRegex)).toBeTruthy();
	});

	it('match middle words', () => {
		const searchRegex = getWordRegex('must');

		expect('one must eat'.match(searchRegex)).toBeTruthy();
	});
});

describe('getRegexFlags', () => {
	it('return ignore case by default', () => {
		expect(getRegexFlags()).toEqual('i');
	});

	it('returns empty string when case sensitive', () => {
		expect(getRegexFlags(true)).toEqual('');
	});

	it('returns non global by default', () => {
		expect(getRegexFlags(false)).toEqual('i');
	});

	it('returns global when global true', () => {
		expect(getRegexFlags(false, true)).toEqual('ig');
		expect(getRegexFlags(true, true)).toEqual('g');
	});
});
