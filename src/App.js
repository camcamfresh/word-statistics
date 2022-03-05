import './App.css';

function App() {
	return (
		<div className='d-flex flex-column h-100'>
			<h1>Word Statistics</h1>
			<div className='d-flex flex-row h-100'>
				<textarea
					className='flex-fill flex-grow-1 mx-2 mb-2'
					placeholder='Enter text to analyze'
				></textarea>
				<div className='mx-4'>
					<label>Word Frequency</label>
				</div>
			</div>
		</div>
	);
}

export default App;
