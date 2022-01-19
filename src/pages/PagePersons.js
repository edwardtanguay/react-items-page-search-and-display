/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from 'react';
import rawPersonsFromJson from '../data/persons.json';
import * as qsys from '../qtools/qsys';
import { useMediaQuery } from 'react-responsive';

const PagePersons = () => {
	const [searchText, setSearchText] = useState('');
	const [initialPersons, setInitialPersons] = useState([]);
	const [filteredPersons, setFilteredPersons] = useState([]);
	const [filteredPerson, setFilteredPerson] = useState({});
	const inputSearchText = useRef(null);

	const isSmartphone = useMediaQuery({
		query: '(max-width: 577px)'
	});

	const updateUrlBase = () => {
		qsys.changeBrowserState(document, 'persons', '', '', `All Persons`);
	}

	const updateUrlWithId = (person) => {
		qsys.changeBrowserState(document, 'persons', 'id', person.employeeID, `Person: ${person.firstName} ${person.lastName}`);
	};

	const updateUrlWithSearchText = (searchText) => {
		if (searchText.trim() === '') {
			updateUrlBase();
		} else {
			qsys.changeBrowserState(document, 'persons', 'searchText', searchText, `Person Search: "${searchText}"`);
		}
	};

	const searchAllPersons = (_persons, searchText) => {
		const foundPersons = [];
		_persons.forEach(person => {
			let personMatched = true;
			const searchWords = searchText.split(' ');
			searchWords.forEach(searchWord => {
				if (!person.bulkSearchText.toUpperCase().includes(searchWord.toUpperCase())) {
					personMatched = false;
				}
			});
			if (personMatched) foundPersons.push(person);
		});
		return foundPersons;
	}

	useEffect(() => {
		const _initialPersons = rawPersonsFromJson.map(m => {
			m.bulkSearchText = `${m.firstName}|${m.lastName}|${m.title}|${m.notes}`;
			return m;
		});
		let _filteredPersons = [..._initialPersons];

		const urlId = Number(qsys.getParameterValueFromUrl('id'));
		if (urlId !== 0) {
			_filteredPersons = _initialPersons.filter(m => m.employeeID === urlId);
			updateUrlWithId(_filteredPersons[0]);
		}

		const urlSearchText = qsys.getParameterValueFromUrl('searchText');
		if (urlSearchText !== '') {
			_filteredPersons = searchAllPersons(_initialPersons, urlSearchText);
			setSearchText(urlSearchText);
			updateUrlWithSearchText(urlSearchText);
		}

		setInitialPersons(_initialPersons);
		setFilteredPersons(_filteredPersons); // API
		if (_filteredPersons.length === 1) {
			setFilteredPerson(_filteredPersons[0]);
		}

		if (!isSmartphone) {
			inputSearchText.current.focus();
		}

	}, []);

	const displaySearchResults = (e) => {
		const searchText = e.target.value;
		if (searchText.trim() !== '' || filteredPersons.length > 0) {
			setSearchText(e.target.value);

			const filteredPersons = searchAllPersons([...initialPersons], searchText);
			setFilteredPersons([...filteredPersons]);
			if (filteredPersons.length === 1) {
				setFilteredPerson(filteredPersons[0]);
			}
			updateUrlWithSearchText(searchText);
		}
	}

	const showSinglePerson = (person) => {
		setFilteredPersons([person]);
		setFilteredPerson(person);
		updateUrlWithId(person);
	}

	const showAllPersons = () => {
		setInitialPersons(initialPersons);
		setFilteredPersons(initialPersons);
		if (initialPersons.length === 1) {
			setFilteredPerson(initialPersons[0]);
		}
		setSearchText('');
		updateUrlBase();
		setTimeout(() => {
		if (!isSmartphone) {
			inputSearchText.current.focus();
		}
		}, 100);
	}

	return (
		<div className="pagePersons">

			<div className="totalHeader">
				{filteredPersons.length > 1 && filteredPersons.length < initialPersons.length && (
					<div>
						{filteredPersons.length} of <span className="allPersonsLink" onClick={showAllPersons}>{initialPersons.length} Persons</span>
					</div>
				)}

				{filteredPersons.length === 1 && (
					<div>
						1 of <span className="allPersonsLink" onClick={showAllPersons}>{initialPersons.length} Persons</span>
					</div>
				)}

				{filteredPersons.length === initialPersons.length && (
					<div>
						<div>{initialPersons.length} Persons</div>
					</div>
				)}
			</div>

			<div className="searchArea">
				<input type="text" ref={inputSearchText} placeholder="SEARCH" value={searchText} onFocus={displaySearchResults} onChange={displaySearchResults} />
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
						<img src={`images/persons/${filteredPerson.image}`} alt="person" className="photo" />
						<div className="info">
							<div className="fullName">{filteredPerson.firstName} {filteredPerson.lastName}</div>
							<div className="title">{filteredPerson.title}</div>
							<div className="notes">{filteredPerson.notes}</div>
						</div>
					</div>
					<div className="clear"></div>
				</div>
			)}

		</div>
	)
}

export default PagePersons;