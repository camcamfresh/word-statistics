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
		<div className='d-flex flex-column'>
			<label>Word Frequency</label>
			<div className='d-flex flex-column overflow-auto mb-2 pr-4 pb-4 h-75'>
				{wordFrequencies}
			</div>
		</div>
	);
}

export default Frequency;
