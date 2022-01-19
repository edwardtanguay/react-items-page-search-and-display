import persons from '../data/persons.json';

const PagePersons = () => {
	return (
		<div className="pagePersons">
			{persons.length} Persons
			<hr />
			<div className="personsArea">
				{persons.map((p, i) => {
					return (
						<div className="personCard">
							<div className="fullName">{p.firstName} {p.lastName}</div>
							<div className="title">{p.title}</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default PagePersons;