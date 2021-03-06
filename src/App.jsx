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
		<div className='d-flex flex-row h-100 w-100'>
			<div className='d-flex flex-column flex-grow-1 h-100'>
				<h2>Word Statistics</h2>
				<div className='d-flex flex-row flex-fill overflow-auto'>
					<textarea
						className='flex-grow-1 ml-2 mb-2 overflow-scroll'
						data-testid='text-input'
						onInput={(event) => setText(event.target.value)}
						onKeyDown={(event) => handleTabEvent(event, setText)}
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
				</div>
			</div>
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
	);
}

function handleTabEvent(event, setTextInput) {
	if (event.key === 'Tab') {
		event.preventDefault();

		if (event.shiftKey) {
			document.getElementById('find-input').focus();
		} else {
			const start = event.target.selectionStart;
			const end = event.target.selectionEnd;

			const text = event.target.value;
			const textWithTab = text.slice(0, start) + '\t' + text.slice(end);
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
	textArea.current.scrollLeft = textArea.current.scrollWidth;
	textArea.current.value = savedText;

	textArea.current.setSelectionRange(startPosition, endPosition);
	textArea.current.focus();
}

export function listWords(textInput) {
	return textInput
		.split(/[\n\t ]/)
		.filter((word) => word !== '')
		.map((word) =>
			word
				.trim()
				.toLowerCase()
				.replace(/[,.!?;:~"`()[\]{}]/g, '')
		);
}

export default App;
