import './App.css';
import { useState } from 'react';

function App() {
	const [textInput, setTextInput] = useState('');

	return (
		<div className='d-flex flex-column h-100'>
			<h1>Word Statistics</h1>
			<div className='d-flex flex-row flex-fill overflow-auto'>
				<textarea
					className='flex-grow-1 mx-2 mb-2'
					onInput={(event) => setTextInput(event.target.value)}
					placeholder='Enter text to analyze'
					value={textInput}
				></textarea>
				<div className='mx-4'>
					<label>Word Frequency</label>
				</div>
			</div>
		</div>
	);
}

export default App;
