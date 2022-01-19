import './App.scss';
import { Routes, Route } from 'react-router-dom';
import PageWelcome from './pages/PageWelcome';
import PagePersons from './pages/PagePersons';

function App() {
	return (
		<div className="App">
			<Routes>
				<Route path="/" element={<PageWelcome />} />
				<Route path="persons" element={<PagePersons />} />
			</Routes>
		</div>
	);
}

export default App;