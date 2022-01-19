import { NavLink } from 'react-router-dom';

const Nav = () => {
	return (
		<nav>
			<ul>
				<li><NavLink to="/">Home</NavLink></li>
				<li><NavLink to="persons">Employees</NavLink></li>
				<li><NavLink to="persons">Customers</NavLink></li>
				<li><NavLink to="persons">Suppliers</NavLink></li>
			</ul>
		</nav>
	)
}

export default Nav;