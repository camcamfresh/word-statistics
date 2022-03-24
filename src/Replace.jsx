import { useState } from 'react';

function Replace({ text, setText, selection, setSelection }) {
	const [search, setSearch] = useState('');
	const [replace, setReplace] = useState('');
	const [result, setResult] = useState('');

	const isInvalidSearch = text === '' || search === '';
	const isInvalidReplace = isInvalidSearch || replace === '';

	return (
		<div>
			<label className='align-self-center'>Find &amp; Replace Words</label>
			<div className='d-flex flex-column overflow-auto mb-2 p-4'>
				<div className='d-flex justify-content-between mb-2'>
					<label className='pr-1'>Find what:</label>
					<input
						id='find-input'
						data-testid='find-input'
						onInput={(event) => setSearch(event.target.value)}
						value={search}
					></input>
				</div>
				<div className='d-flex justify-content-between mb-4'>
					<label className='pr-1'>Replace with:</label>
					<input
						id='replace-input'
						data-testid='replace-input'
						onInput={(event) => setReplace(event.target.value)}
						value={replace}
					></input>
				</div>
				<button
					className='align-self-center mb-2 w-50'
					disabled={isInvalidSearch}
					onClick={() =>
						onFindNext(search, text, selection, setSelection, setResult)
					}
				>
					Find Next
				</button>
				<button
					className='align-self-center mb-2 w-50'
					disabled={isInvalidSearch || isInvalidReplace}
					onClick={() =>
						onReplace(
							search,
							replace,
							text,
							setText,
							selection,
							setSelection,
							setResult
						)
					}
				>
					Replace
				</button>
				<button
					className='align-self-center mb-2 w-50'
					disabled={isInvalidSearch || isInvalidReplace}
					onClick={() =>
						onReplaceAll(
							search,
							replace,
							text,
							setText,
							setSelection,
							setResult
						)
					}
				>
					Replace All
				</button>
				<div className='align-self-center pt-1'>
					<span disabled>&nbsp;</span>
					{result}
				</div>
			</div>
		</div>
	);
}

export function onFindNext(search, text, selection, setSelection, setResult) {
	const next = findNext(search, text, selection);

	if (next?.length === 2) {
		setSelection(next[0], next[1]);
		setResult('Word found!');
	} else {
		setResult('No results found.');
	}
}

export function findNext(search, text, selection) {
	let cursorEnd = selection?.end || 0;
	if (cursorEnd > text.length) {
		cursorEnd = text.length;
	}

	const searchRegex = getSearchRegex(search);
	const wordRegex = getStartWordRegex(search);

	const nextString = text.slice(cursorEnd);
	const nextMatch = nextString.match(searchRegex);
	if (nextMatch) {
		const extraChar = nextMatch[0].match(wordRegex) ? 0 : 1;
		const position = cursorEnd + nextMatch.index + extraChar;
		return [position, position + search.length];
	}

	const anyMatch = text.match(searchRegex);
	if (anyMatch) {
		const extraChar = anyMatch[0].match(wordRegex) ? 0 : 1;
		const position = anyMatch.index + extraChar;
		return [position, position + search.length];
	}
}

export function onReplace(
	search,
	replace,
	text,
	setText,
	selection,
	setSelection,
	setResult
) {
	const selected = text.slice(selection.start, selection.end);
	let cursorStart = selection.start;

	if (!selected.match(getStartWordRegex(search))) {
		const next = findNext(search, text, selection);

		if (next?.length !== 2) {
			setResult('No results found.');
			return;
		}
		cursorStart = next[0];
	}

	const searchRegex = getSearchRegex(search);
	const replaceRegex = getWordRegex(search);
	const onReplace = (match) => match.replace(replaceRegex, replace);

	const newText =
		text.slice(0, cursorStart) +
		text.slice(cursorStart).replace(searchRegex, onReplace);

	const next = findNext(search, newText, {
		start: cursorStart,
		end: cursorStart,
	});

	setText(newText);
	if (next?.length === 2) {
		setSelection(next[0], next[1]);
		setResult('Word replaced.');
	} else {
		setResult('Last word replaced.');
	}
}

function onReplaceAll(search, replace, text, setText, setSelection, setResult) {
	const searchRegex = getSearchRegex(search, false, true);
	if (!text.match(searchRegex)) {
		setResult('No results found.');
		return;
	}

	const replaceRegex = getWordRegex(search, false, true);
	const onReplace = (match) => match.replace(replaceRegex, replace);
	const newText = text.replace(searchRegex, onReplace);

	setText(newText);
	setSelection(0, 0);
	setResult('All words replaced.');
}

export function getSearchRegex(
	search,
	isCaseSensitive = false,
	isGlobal = false
) {
	return new RegExp(
		'(?:^|[\t\n ,.!?;:~"`(){}\\[\\]])' +
			search +
			'(?=$|[\t\n ,.!?;:~"`(){}\\[\\]])',
		getRegexFlags(isCaseSensitive, isGlobal)
	);
}

export function getStartWordRegex(
	search,
	isCaseSensitive = false,
	isGlobal = false
) {
	return new RegExp('^' + search, getRegexFlags(isCaseSensitive, isGlobal));
}

export function getWordRegex(
	search,
	isCaseSensitive = false,
	isGlobal = false
) {
	return new RegExp(search, getRegexFlags(isCaseSensitive, isGlobal));
}

export function getRegexFlags(isCaseSensitive = false, isGlobal = false) {
	const flags = [];
	if (!isCaseSensitive) flags.push('i');
	if (isGlobal) flags.push('g');
	return flags.join('');
}

export default Replace;
