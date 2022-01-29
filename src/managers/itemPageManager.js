/* eslint-disable react-hooks/rules-of-hooks */
import { useMediaQuery } from 'react-responsive';
import * as qsys from '../qtools/qsys';

export const itemPageManager = Component => {

	const updateUrlBase = () => {
		qsys.changeBrowserState(document, 'customers', '', '', `All Customers`);
	}

	return (props) => {
		return <Component {...props} updateUrlBase={updateUrlBase}  />
	}
}