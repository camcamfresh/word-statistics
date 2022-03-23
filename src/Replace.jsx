import { useState } from 'react';

function Replace({ text, setText }) {
	const [search, setSearch] = useState('');
	const [replace, setReplace] = useState('');

	const isInvalidSearch = text === '' || search === '';
	const isInvalidReplace = isInvalidSearch || replace === '';

	return (
		<>
			<label className='align-self-center'>Find &amp; Replace</label>
			<div className='d-flex flex-column overflow-auto mb-2 p-4 h-25'>
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
				>
					Find Next
				</button>
				<button
					className='align-self-center mb-2 w-50'
					disabled={isInvalidSearch || isInvalidReplace}
				>
					Replace
				</button>
				<button
					className='align-self-center mb-2 w-50'
					disabled={isInvalidSearch || isInvalidReplace}
				>
					Replace All
				</button>
			</div>
		</>
	);
}

export default Replace;
