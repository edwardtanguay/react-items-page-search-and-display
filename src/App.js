import './App.scss';
import { Routes, Route } from 'react-router-dom';
import PageWelcome from './pages/PageHome';
import PagePersons from './pages/PagePersons';
import PageCustomers from './pages/PageCustomers';
import PageSuppliers from './pages/PageSuppliers';
import Menu from './components/Nav';

function App() {
	return (
		<div className="App">
			<Menu/>
			<Routes>
				<Route path="/" element={<PageWelcome />} />
				<Route path="persons" element={<PagePersons />} />
				<Route path="customers" element={<PageCustomers />} />
				<Route path="suppliers" element={<PageSuppliers />} />
			</Routes>
		</div>
	);
}

export default App;