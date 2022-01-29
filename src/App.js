import './styles/App.scss';
import { Routes, Route } from 'react-router-dom';
import PageWelcome from './pages/PageHome';
import PageEmployees from './pages/PageEmployees';
import _PageCustomers from './pages/PageCustomers';
import PageSuppliers from './pages/PageSuppliers';
import Menu from './components/Nav';
import {itemPageManager} from './managers/itemPageManager';

const PageCustomers = itemPageManager(_PageCustomers);


function App() {
	return (
		<div className="App">
			<Menu/>
			<Routes>
				<Route path="/" element={<PageWelcome />} />
				<Route path="employees" element={<PageEmployees />} />
				<Route path="customers" element={<PageCustomers />} />
				<Route path="suppliers" element={<PageSuppliers />} />
			</Routes>
		</div>
	);
}

export default App;