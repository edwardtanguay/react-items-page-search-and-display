/* eslint-disable react-hooks/rules-of-hooks */
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

	const pageLoader = async (pageConfig, setSearchText, setInitialItems, setFilteredItems, setFilteredItem, isSmartphone, inputSearchText) => {
		const response = await fetch(pageConfig.apiUrl);
		const rawItemsFromJson = await response.json();
		const _initialItems = rawItemsFromJson.map(pageConfig.decorateItems);
		let _filteredItems = [..._initialItems];

		const urlId = qsys.getParameterValueFromUrl('id');
		if (urlId !== '') {
			_filteredItems = _initialItems.filter(m => m.customerID === urlId.toUpperCase());
			updateUrlWithId(_filteredItems[0]);
		}

		const urlSearchText = qsys.getParameterValueFromUrl('searchText');
		if (urlSearchText !== '') {
			_filteredItems = searchAllItems(_initialItems, urlSearchText);
			setSearchText(urlSearchText);
			updateUrlWithSearchText(urlSearchText);
		}

		setInitialItems(_initialItems);
		setFilteredItems(_filteredItems);
		const _filteredItem = _filteredItems[0];
		if (_filteredItems.length === 1) {
			setFilteredItem(_filteredItem);
		} else {
			setFilteredItem(null);
		}

		if (!isSmartphone && urlId === '') {
			setTimeout(() => {
				if (inputSearchText.current !== null) {
					inputSearchText.current.focus();
				}
			}, 200);
		}
	}

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

	const hocDisplaySearchResults = (e, filteredItems, setSearchText, initialItems, setFilteredItems, setFilteredItem) => {
		const searchText = e.target.value;
		if (searchText.trim() !== '' || filteredItems.length > 0) {
			setSearchText(e.target.value);

			const filteredItems = searchAllItems([...initialItems], searchText);
			setFilteredItems([...filteredItems]);
			if (filteredItems.length === 1) {
				setFilteredItem(filteredItems[0]);
			} else {
				setFilteredItem(null);
			}
			updateUrlWithSearchText(searchText);
		}
	}

	const hocShowSingleItem = (item, setFilteredItems, setFilteredItem) => {
		setFilteredItems([item]);
		setFilteredItem(item);
		updateUrlWithId(item);
	}

	const hocShowAllItems = (setInitialItems, initialItems, setFilteredItems, setFilteredItem, setSearchText, isSmartphone, inputSearchText) => {
		setInitialItems(initialItems);
		setFilteredItems(initialItems);
		if (initialItems.length === 1) {
			setFilteredItem(initialItems[0]);
		}
		setSearchText('');
		updateUrlBase();
		setTimeout(() => {
			if (!isSmartphone) {
				inputSearchText.current.focus();
			}
		}, 100);
	}

	return (props) => {
		return <Component {...props} updateUrlBase={updateUrlBase} updateUrlWithId={updateUrlWithId} updateUrlWithSearchText={updateUrlWithSearchText} searchAllItems={searchAllItems} pageLoader={pageLoader} hocDisplaySearchResults={hocDisplaySearchResults} hocShowSingleItem={hocShowSingleItem} hocShowAllItems={hocShowAllItems} />
	}
}