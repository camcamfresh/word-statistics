import './App.css';
import { useState } from 'react';
import Frequency from './Frequency';

function App() {
	const [textInput, setTextInput] = useState('');

	return (
		<div className='d-flex flex-column h-100'>
			<h1>Word Statistics</h1>
			<div className='d-flex flex-row flex-fill overflow-auto'>
				<textarea
					className='flex-grow-1 mx-2 mb-2'
					data-testid='text-input'
					onInput={(event) => setTextInput(event.target.value)}
					onKeyDown={(event) => handleTabEvent(event, textInput, setTextInput)}
					placeholder='Enter text to analyze'
					value={textInput}
				></textarea>
				<Frequency wordList={listWords(textInput)} />
			</div>
		</div>
	);
}

function handleTabEvent(event, textInput, setTextInput) {
	if (event.key === 'Tab' && event.shiftKey === false) {
		event.preventDefault();

		const start = event.target.selectionStart;
		const end = event.target.selectionEnd;

		const textWithTab = textInput.slice(0, start) + '\t' + textInput.slice(end);
		setTextInput(textWithTab);

		event.target.value = textWithTab;
		event.target.selectionStart = start + 1;
		event.target.selectionEnd = start + 1;
	}
}

export function listWords(textInput) {
	return textInput
		.split(/\n|\t| /)
		.filter((word) => word !== '')
		.map((word) => word.trim().toLowerCase().replace(/[,.!?;:~"`()[\]{}]/g, ''))
		.filter((word) => !word.match(/[\n|\t| |]/));
}

// .replace(/[,.!?;:"#$()*+<=>@[\]/\\^_`{}|~]/, '')

export default App;
