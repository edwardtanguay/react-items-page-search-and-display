import { NavLink } from 'react-router-dom';

const Nav = () => {
	return (
		<nav>
			<ul>
				<li><NavLink to="/">Home</NavLink></li>
				<li><NavLink to="employees">Employees</NavLink></li>
				<li><NavLink to="customers">Customers</NavLink></li>
				<li><NavLink to="suppliers">Suppliers</NavLink></li>
			</ul>
		</nav>
	)
}

export default Nav;