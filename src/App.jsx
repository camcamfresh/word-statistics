import './App.css';
import { useEffect, useRef, useState } from 'react';
import Frequency from './Frequency';
import Replace from './Replace';

function App() {
	const textArea = useRef(null);
	const [text, setText] = useState('');
	const [selection, setSelection] = useState({
		start: 0,
		end: 0,
		presented: false,
	});

	useEffect(() => {
		if (!selection.presented) {
			setSelectedText(textArea, selection.start, selection.end);
			setSelection({ ...selection, presented: true });
		}
	}, [selection]);

	const listOfWords = listWords(text);

	return (
		<div className='d-flex flex-column h-100'>
			<h1>Word Statistics</h1>
			<div className='d-flex flex-row flex-fill overflow-auto'>
				<textarea
					className='flex-grow-1 ml-2 mb-2'
					data-testid='text-input'
					onInput={(event) => setText(event.target.value)}
					onKeyDown={(event) => handleTabEvent(event, text, setText)}
					onSelect={(event) => {
						setSelection({
							start: event.target.selectionStart,
							end: event.target.selectionEnd,
							presented: true,
						});
					}}
					placeholder='Enter text to analyze'
					ref={textArea}
					value={text}
				></textarea>
				<div className='d-flex flex-column'>
					<Frequency wordList={listOfWords} />
					<Replace
						text={text}
						setText={setText}
						selection={selection}
						setSelection={(start, end) =>
							setSelection({
								start: start,
								end: end,
								presented: false,
							})
						}
					/>
				</div>
			</div>
		</div>
	);
}

function handleTabEvent(event, textInput, setTextInput) {
	if (event.key === 'Tab') {
		event.preventDefault();
		if (event.shiftKey) {
			document.getElementById('find-input').focus();
		} else {
			const start = event.target.selectionStart;
			const end = event.target.selectionEnd;

			const textWithTab =
				textInput.slice(0, start) + '\t' + textInput.slice(end);
			setTextInput(textWithTab);

			event.target.value = textWithTab;
			event.target.selectionStart = start + 1;
			event.target.selectionEnd = start + 1;
		}
	}
}

export function setSelectedText(textArea, startPosition, endPosition = startPosition) {
	if (startPosition > endPosition) {
		endPosition = startPosition;
	}

	// Instead of manually setting scroll bar position in pixels, we substring
	// the text value, scroll to the end, and then restore the original text.
	const savedText = textArea.current.value;
	textArea.current.value = savedText.slice(0, endPosition);
	textArea.current.scrollTop = textArea.current.scrollHeight;
	textArea.current.value = savedText;

	textArea.current.setSelectionRange(startPosition, endPosition);
	textArea.current.focus();
}

export function listWords(textInput) {
	return textInput
		.split(/\n|\t| /)
		.filter((word) => word !== '')
		.map((word) =>
			word
				.trim()
				.toLowerCase()
				.replace(/[,.!?;:~"`()[\]{}]/g, '')
		)
		.filter((word) => !word.match(/[\n|\t| |]/));
}

// .replace(/[,.!?;:"#$()*+<=>@[\]/\\^_`{}|~]/, '')

export default App;
