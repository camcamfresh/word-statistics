import { render, screen } from '@testing-library/react';
import Frequency from './Frequency';

function renderWithList(list) {
	render(<Frequency wordList={list} />);
}

describe('rendering', () => {
	it('displays frequency label', () => {
		renderWithList([]);

		const element = screen.queryByText('Word Frequency');
		expect(element).toBeInTheDocument();
	});

	it('displays each word in list', () => {
		renderWithList(['unique', 'wordaplauza']);

		const element1 = screen.queryByText('unique', { exact: false });
		expect(element1).toBeInTheDocument();

		const element2 = screen.queryByText('wordaplauza', { exact: false });
		expect(element2).toBeInTheDocument();
	});

	it('displays each word with frequency', () => {
		renderWithList(['a', 'b', 'b']);

		const element1 = screen.queryByText('1 - a');
		expect(element1).toBeInTheDocument();

		const element2 = screen.queryByText('2 - b');
		expect(element2).toBeInTheDocument();
	});

    it('displays words based on most frequent', () => {
			renderWithList(['a', 'a', 'a', 'b', 'b', 'c']);

			const elements = screen.queryAllByTestId('word-frequency');
			expect(elements[0].innerHTML).toEqual('3 - a');
			expect(elements[1].innerHTML).toEqual('2 - b');
			expect(elements[2].innerHTML).toEqual('1 - c');
		});
});
