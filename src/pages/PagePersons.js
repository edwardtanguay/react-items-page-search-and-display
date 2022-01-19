import persons from '../data/persons.json';

const PagePersons = () => {
	return (
		<>
			{persons.length} Persons
			<hr />
			<ul>
				{persons.map((person, i) => {
					return (
						<li key={i}>{person.firstName}</li>
					)
				})}
			</ul>
		</>
	)
}

export default PagePersons;