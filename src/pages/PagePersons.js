import { useState } from 'react';
import persons from '../data/persons.json';

const PagePersons = () => {
	const [searchText, setSearchText] = useState('');

	const displaySearchResults = (e) => {
		const searchText = e.target.value;
		setSearchText(searchText);

		// if (searchText === '') {
		// 	setItemsByIdCode('newestFirst');
		// } else {
		// 	const items = getItems({ idCode: '', searchText, id: 0 });
		// 	setHowtos([...items]);
		// }
	}

	return (
		<div className="pagePersons">
			[{searchText}]
			{persons.length} Persons
			<div className="searchArea">
				<input type="text" onChange={displaySearchResults} />
			</div>
			<div className="personsArea">
				{persons.map((p, i) => {
					return (
						<div className="personCard">
							<div className="fullName">{p.firstName} {p.lastName}</div>
							<div className="title">{p.title}</div>
							<img src={`images/persons/${p.image}`} alt="" className="photo" />
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default PagePersons;