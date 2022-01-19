import { NavLink } from 'react-router-dom';

const Nav = () => {
	return (
		<nav>
			<ul>
				<li><NavLink to="/">Welcome</NavLink></li>
				<li><NavLink to="persons">Persons</NavLink></li>
			</ul>
		</nav>
	)
}

export default Nav;