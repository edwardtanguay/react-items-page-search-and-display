import { useState, useRef, useEffect } from 'react';
import rawPersonsFromJson from '../data/persons.json';

// TODO: focus search box
const PagePersons = () => {
	const [searchText, setSearchText] = useState('');
	const [initialPersons, setInitialPersons] = useState([]);
	const [filteredPersons, setFilteredPersons] = useState([]);
	const [filteredPerson, setFilteredPerson] = useState({});
	const inputSearchText = useRef(null);

	useEffect(() => {
		const initialPersons = rawPersonsFromJson.map(m => {
			m.bulkSearchText = `${m.firstName}|${m.lastName}|${m.title}|${m.notes}`;
			return m;
		});

		setInitialPersons(initialPersons);
		setFilteredPersons(initialPersons); // API
		if (initialPersons.length === 1) {
			setFilteredPerson(initialPersons[0]);
		}

		inputSearchText.current.focus();

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
			if (personMatched) filteredPersons.push(person);
		});
		setFilteredPersons([...filteredPersons]);
		if (filteredPersons.length === 1) {
			setFilteredPerson(filteredPersons[0]);
		}
	}

	const showSinglePerson = (person) => {
		setFilteredPersons([person]);
		setFilteredPerson(person);
		setSearchText('');
		inputSearchText.current.focus();
	}

	const showAllPersons = () => {
		setInitialPersons(initialPersons);
		setFilteredPersons(initialPersons);
		if (initialPersons.length === 1) {
			setFilteredPerson(initialPersons[0]);
		}
		setSearchText('');
		inputSearchText.current.focus();
	}

	// TODO: make it "1 Person" and "2 Persons"
	return (
		<div className="pagePersons">
			{filteredPersons.length > 1 && (
				<>
					{filteredPersons.length} Persons
				</>
			)}

			{filteredPersons.length === 1 && (
				<>
					<div className="allPersonsLink" onClick={showAllPersons}>{initialPersons.length} Persons</div>
				</>
			)}

			<div className="searchArea">
				<input type="text" ref={inputSearchText} value={searchText} onChange={displaySearchResults} />
			</div>

			{/* MULTIPLE PERSONS */}
			{filteredPersons.length > 1 && (
				<div className="personsArea">
					{filteredPersons.map((p, i) => {
						return (
							<div className="personCard" key={i}>
								<div className="fullName">{p.firstName} {p.lastName}</div>
								<div className="title">{p.title}</div>
								<img src={`images/persons/${p.image}`} alt="" className="photo" onClick={() => showSinglePerson(p)} />
							</div>
						)
					})}
				</div>
			)}

			{/* SINGLE PERSON */}
			{filteredPersons.length === 1 && (
				<div className="singlePersonCard">
					<div className="innerArea">
						<div className="info">
							<div className="fullName">{filteredPerson.firstName} {filteredPerson.lastName}</div>
							<div className="title">{filteredPerson.title}</div>
							<div className="notes">{filteredPerson.notes}</div>
						</div>
						<img src={`images/persons/${filteredPerson.image}`} alt="person" className="photo" />
					</div>
				</div>
			)}

		</div>
	)
}

export default PagePersons;