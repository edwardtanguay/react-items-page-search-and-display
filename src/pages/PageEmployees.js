/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from 'react';
import rawEmployeesFromJson from '../data/employees.json';
import * as qsys from '../qtools/qsys';
import { useMediaQuery } from 'react-responsive';
import '../styles/pageEmployees.scss';

const PageEmployees = () => {
	const [searchText, setSearchText] = useState('');
	const [initialEmployees, setInitialEmployees] = useState([]);
	const [filteredEmployees, setFilteredEmployees] = useState([]);
	const [filteredEmployee, setFilteredEmployee] = useState({});
	const inputSearchText = useRef(null);

	const isSmartphone = useMediaQuery({
		query: '(max-width: 577px)'
	});

	const updateUrlBase = () => {
		qsys.changeBrowserState(document, 'employees', '', '', `All Employees`);
	}

	const updateUrlWithId = (employee) => {
		qsys.changeBrowserState(document, 'employees', 'id', employee.employeeID, `Employee: ${employee.firstName} ${employee.lastName}`);
	};

	const updateUrlWithSearchText = (searchText) => {
		if (searchText.trim() === '') {
			updateUrlBase();
		} else {
			qsys.changeBrowserState(document, 'employees', 'searchText', searchText, `Employee Search: "${searchText}"`);
		}
	};

	const searchAllEmployees = (_employees, searchText) => {
		const foundEmployees = [];
		_employees.forEach(employee => {
			let employeeMatched = true;
			const searchWords = searchText.split(' ');
			searchWords.forEach(searchWord => {
				if (!employee.bulkSearchText.toUpperCase().includes(searchWord.toUpperCase())) {
					employeeMatched = false;
				}
			});
			if (employeeMatched) foundEmployees.push(employee);
		});
		return foundEmployees;
	}

	useEffect(() => {
		const _initialEmployees = rawEmployeesFromJson.map(m => {
			m.bulkSearchText = `${m.firstName}|${m.lastName}|${m.title}|${m.notes}`;
			return m;
		});
		let _filteredEmployees = [..._initialEmployees];

		const urlId = Number(qsys.getParameterValueFromUrl('id'));
		if (urlId !== 0) {
			_filteredEmployees = _initialEmployees.filter(m => m.employeeID === urlId);
			updateUrlWithId(_filteredEmployees[0]);
		}

		const urlSearchText = qsys.getParameterValueFromUrl('searchText');
		if (urlSearchText !== '') {
			_filteredEmployees = searchAllEmployees(_initialEmployees, urlSearchText);
			setSearchText(urlSearchText);
			updateUrlWithSearchText(urlSearchText);
		}

		setInitialEmployees(_initialEmployees);
		setFilteredEmployees(_filteredEmployees); // API
		if (_filteredEmployees.length === 1) {
			setFilteredEmployee(_filteredEmployees[0]);
		}

		if (!isSmartphone) {
			inputSearchText.current.focus();
		}

	}, []);

	const displaySearchResults = (e) => {
		const searchText = e.target.value;
		if (searchText.trim() !== '' || filteredEmployees.length > 0) {
			setSearchText(e.target.value);

			const filteredEmployees = searchAllEmployees([...initialEmployees], searchText);
			setFilteredEmployees([...filteredEmployees]);
			if (filteredEmployees.length === 1) {
				setFilteredEmployee(filteredEmployees[0]);
			}
			updateUrlWithSearchText(searchText);
		}
	}

	const showSingleEmployee = (employee) => {
		setFilteredEmployees([employee]);
		setFilteredEmployee(employee);
		updateUrlWithId(employee);
	}

	const showAllEmployees = () => {
		setInitialEmployees(initialEmployees);
		setFilteredEmployees(initialEmployees);
		if (initialEmployees.length === 1) {
			setFilteredEmployee(initialEmployees[0]);
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
		<div className="pageEmployees">

			<div className="totalHeader">
				{filteredEmployees.length > 1 && filteredEmployees.length < initialEmployees.length && (
					<div>
						{filteredEmployees.length} of <span className="allEmployeesLink" onClick={showAllEmployees}>{initialEmployees.length} Employees</span>
					</div>
				)}

				{filteredEmployees.length === 1 && (
					<div>
						1 of <span className="allEmployeesLink" onClick={showAllEmployees}>{initialEmployees.length} Employees</span>
					</div>
				)}

				{filteredEmployees.length === initialEmployees.length && (
					<div>
						<div>{initialEmployees.length} Employees</div>
					</div>
				)}
			</div>

			<div className="searchArea">
				<input type="text" ref={inputSearchText} placeholder="SEARCH" value={searchText} onFocus={displaySearchResults} onChange={displaySearchResults} />
			</div>

			{/* MULTIPLE EMPLOYEES */}
			{filteredEmployees.length > 1 && (
				<div className="employeesArea">
					{filteredEmployees.map((p, i) => {
						return (
							<div className="employeeCard" key={i}>
								<div className="fullName">{p.firstName} {p.lastName}</div>
								<div className="title">{p.title}</div>
								<img src={`images/employees/employee_${p.employeeID}.jpg`} alt="" className="photo" onClick={() => showSingleEmployee(p)} />
							</div>
						)
					})}
				</div>
			)}

			{/* SINGLE EMPLOYEE */}
			{filteredEmployees.length === 1 && (
				<div className="singleEmployeeCard">
					<div className="innerArea">
						<img src={`images/employees/employee_${filteredEmployee.employeeID}.jpg`} alt="employee" className="photo" />
						<div className="info">
							<div className="fullName">{filteredEmployee.firstName} {filteredEmployee.lastName}</div>
							<div className="title">{filteredEmployee.title}</div>
							<div className="notes">{filteredEmployee.notes}</div>
						</div>
					</div>
					<div className="clear"></div>
				</div>
			)}

		</div>
	)
}

export default PageEmployees;