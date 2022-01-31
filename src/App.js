import './styles/App.scss';
import { Routes, Route } from 'react-router-dom';
import PageWelcome from './pages/PageHome';
import PageEmployees from './pages/PageEmployees';
import _PageCustomers from './pages/PageCustomers';
import _PageProducts from './pages/PageProducts';
import Menu from './components/Nav';
import {itemPageManager} from './managers/itemPageManager';

const PageCustomers = itemPageManager(_PageCustomers);
const PageProducts = itemPageManager(_PageProducts);


function App() {
	return (
		<div className="App">
			<Menu/>
			<Routes>
				<Route path="/" element={<PageWelcome />} />
				<Route path="employees" element={<PageEmployees />} />
				<Route path="customers" element={<PageCustomers />} />
				<Route path="products" element={<PageProducts />} />
			</Routes>
		</div>
	);
}

export default App;