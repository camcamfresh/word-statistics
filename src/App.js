import './App.css';

function App() {
	return (
		<div className='d-flex flex-column h-100'>
			<h1>Word Statistics</h1>
			<textarea
				className='flex-fill flex-grow-1 mx-2 mb-2'
				placeholder='Enter text to analyze'
			></textarea>
		</div>
	);
}

export default App;
