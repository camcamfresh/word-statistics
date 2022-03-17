function Frequency(props) {
	const wordMap = new Map();

	props.wordList.forEach((word) => {
		let count = wordMap.get(word) || 0;
		wordMap.set(word, count + 1);
	});

	const wordCount = Array.from(wordMap);
	wordCount.sort((a, b) => b[1] - a[1]);

	const wordFrequencies = wordCount.map((wordFrequency) => (
		<div data-testid='word-frequency' key={wordFrequency[0]}>
			{wordFrequency[1]} - {wordFrequency[0]}
		</div>
	));

	return (
		<>
			<label className="align-self-center">Word Frequency</label>
			<div className='d-flex flex-column overflow-auto mb-2 p-4 h-75 border-bottom'>
				{wordFrequencies}
			</div>
		</>
	);
}

export default Frequency;
