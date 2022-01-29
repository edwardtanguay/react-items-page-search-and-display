/* eslint-disable react-hooks/rules-of-hooks */
import { useMediaQuery } from 'react-responsive';
import * as qsys from '../qtools/qsys';

export const itemPageManager = Component => {

	const updateUrlBase = () => {
		qsys.changeBrowserState(document, 'customers', '', '', `All Customers`);
	}

	const updateUrlWithId = (item) => {
		qsys.changeBrowserState(document, 'customers', 'id', item.customerID, `Customer: ${item.contactName}`);
	};

	const updateUrlWithSearchText = (searchText) => {
		if (searchText.trim() === '') {
			updateUrlBase();
		} else {
			qsys.changeBrowserState(document, 'customers', 'searchText', searchText, `Customer Search: "${searchText}"`);
		}
	};

	const searchAllItems = (_items, searchText) => {
		const foundItems = [];
		_items.forEach(item => {
			let itemMatched = true;
			const searchWords = searchText.split(' ');
			searchWords.forEach(searchWord => {
				if (!item.bulkSearchText.toUpperCase().includes(searchWord.toUpperCase())) {
					itemMatched = false;
				}
			});
			if (itemMatched) foundItems.push(item);
		});
		return foundItems;
	}

	return (props) => {
		return <Component {...props} updateUrlBase={updateUrlBase} updateUrlWithId={updateUrlWithId} updateUrlWithSearchText={updateUrlWithSearchText} searchAllItems={searchAllItems} />
	}
}