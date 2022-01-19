import { useState, useEffect } from 'react';
import rawPersonsFromJson from '../data/persons.json';

const PagePersons = () => {
	const [searchText, setSearchText] = useState('');
	const [initialPersons, setInitialPersons] = useState([]);
	const [filteredPersons, setFilteredPersons] = useState([]);

	useEffect(() => {
		const initialPersons = rawPersonsFromJson.map(m => {
			m.searchText = `${m.firstName}|${m.lastName}|${m.title}|${m.notes}`;
			return m;
		});
		setInitialPersons(initialPersons);
		setFilteredPersons(initialPersons); // API
	}, []);

	const displaySearchResults = (e) => {
		const searchText = e.target.value;
		setSearchText(searchText);

		setFilteredPersons([...initialPersons.filter(m => m.searchText.toUpperCase().includes(searchText.toUpperCase()))]);
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