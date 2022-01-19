import { useState, useEffect } from 'react';
import rawPersonsFromJson from '../data/persons.json';

// TODO: focus search box
const PagePersons = () => {
	const [searchText, setSearchText] = useState('');
	const [initialPersons, setInitialPersons] = useState([]);
	const [filteredPersons, setFilteredPersons] = useState([]);

	useEffect(() => {
		const initialPersons = rawPersonsFromJson.map(m => {
			m.bulkSearchText = `${m.firstName}|${m.lastName}|${m.title}|${m.notes}`;
			return m;
		});
		setInitialPersons(initialPersons);
		setFilteredPersons(initialPersons); // API
	}, []);

	const displaySearchResults = (e) => {
		const searchText = e.target.value;
		setSearchText(e.target.value);

		const searchWords = searchText.split(' ');

		const filteredPersons = [];
		initialPersons.forEach(person => {
			let personMatched = true;

			searchWords.forEach(searchWord => {
				if (!person.bulkSearchText.toUpperCase().includes(searchWord.toUpperCase())) {
					personMatched = false;
				}
			});
			if(personMatched) filteredPersons.push(person);
		});
		setFilteredPersons([...filteredPersons]);

		// setFilteredPersons([...initialPersons.filter(m => m.searchText.toUpperCase().includes(searchText.toUpperCase()))]);
	}

	return (
		<div className="pagePersons">
			{filteredPersons.length} Persons
			<div className="searchArea">
				<input type="text" onChange={displaySearchResults} />
			</div>
			<div className="personsArea">
				{filteredPersons.map((p, i) => {
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