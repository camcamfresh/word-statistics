import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Replace from './Replace';

describe('rendering', () => {
	it("displays 'Find & Replace' label", () => {
		render(<Replace />);

		const element = screen.queryByText('Find & Replace');
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
		expect(buttons[1].innerHTML).toEqual('Replace');
		expect(buttons[2].innerHTML).toEqual('Replace All');
	});

	it('disables buttons when there is no text', () => {
		render(<Replace />);

		const buttons = screen.queryAllByRole('button');

		buttons.forEach(button => {
			expect(button.disabled).toBeTruthy();
		});
	});

	it('enables "Find Next" button when text & search words are present', () => {
		render(<Replace text="This is example text." />);

		const findInput = screen.getByTestId('find-input');
		userEvent.type(findInput, "a");

		const findButton = screen.queryByText('Find Next');
		expect(findButton.disabled).toBeFalsy();
	});

	it('enables "Replace" & "Replace All" buttons when text, search, & replace words are present', () => {
		render(<Replace text='This is example text.' />);

		const findInput = screen.getByTestId('find-input');
		userEvent.type(findInput, 'a');

		const replaceInput = screen.getByTestId('replace-input');
		userEvent.type(replaceInput, 'a');

		const buttons = screen.queryAllByRole('button');
		buttons.forEach(button => {
			expect(button.disabled).toBeFalsy();
		});
	});

});
