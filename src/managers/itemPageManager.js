/* eslint-disable react-hooks/rules-of-hooks */
import * as qsys from '../qtools/qsys';

export const itemPageManager = Component => {

	const updateUrlBase = (pageConfig) => {
		qsys.changeBrowserState(document, pageConfig.itemPluralText, '', '', `All ${pageConfig.itemPluralTitle}`);
	}

	const updateUrlWithId = (item, pageConfig) => {
		qsys.changeBrowserState(document, pageConfig.itemPluralText, 'id', item[pageConfig.itemIdFieldName], `${pageConfig.itemSingularTitle}: ${item.contactName}`);
	};

	const updateUrlWithSearchText = (searchText, pageConfig) => {
		if (searchText.trim() === '') {
			updateUrlBase(pageConfig);
		} else {
			qsys.changeBrowserState(document, pageConfig.itemPluralText, 'searchText', searchText, `${pageConfig.itemSingularTitle} Search: "${searchText}"`);
		}
	};

	const pageLoader = async (pageConfig, setSearchText, setInitialItems, setFilteredItems, setFilteredItem, isSmartphone, inputSearchText) => {
		const response = await fetch(pageConfig.apiUrl);
		const rawItemsFromJson = await response.json();
		const _initialItems = rawItemsFromJson.map(pageConfig.decorateItems);
		let _filteredItems = [..._initialItems];

		const urlId = qsys.getParameterValueFromUrl('id');
		const strUrlId = String(urlId);
		console.log(strUrlId);
		if (String(strUrlId) !== '') {
			_filteredItems = _initialItems.filter(m => String(m[pageConfig.itemIdFieldName]) === strUrlId.toUpperCase());
			console.log(_filteredItems);
			updateUrlWithId(_filteredItems[0], pageConfig);
		}

		const urlSearchText = qsys.getParameterValueFromUrl('searchText');
		if (urlSearchText !== '') {
			_filteredItems = searchAllItems(_initialItems, urlSearchText);
			setSearchText(urlSearchText);
			updateUrlWithSearchText(urlSearchText, pageConfig);
		}

		setInitialItems(_initialItems);
		setFilteredItems(_filteredItems);
		const _filteredItem = _filteredItems[0];
		if (_filteredItems.length === 1) {
			setFilteredItem(_filteredItem);
		} else {
			setFilteredItem(null);
		}

		if (!isSmartphone && strUrlId === '') {
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

	const hocDisplaySearchResults = (pageConfig, e, filteredItems, setSearchText, initialItems, setFilteredItems, setFilteredItem) => {
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
			updateUrlWithSearchText(searchText, pageConfig);
		}
	}

	const hocShowSingleItem = (pageConfig, item, setFilteredItems, setFilteredItem) => {
		setFilteredItems([item]);
		setFilteredItem(item);
		updateUrlWithId(item, pageConfig);
	}

	const hocShowAllItems = (pageConfig, setInitialItems, initialItems, setFilteredItems, setFilteredItem, setSearchText, isSmartphone, inputSearchText) => {
		setInitialItems(initialItems);
		setFilteredItems(initialItems);
		if (initialItems.length === 1) {
			setFilteredItem(initialItems[0]);
		}
		setSearchText('');
		updateUrlBase(pageConfig);
		setTimeout(() => {
			if (!isSmartphone) {
				inputSearchText.current.focus();
			}
		}, 100);
	}

	return (props) => {
		return <Component {...props} updateUrlWithId={updateUrlWithId} updateUrlWithSearchText={updateUrlWithSearchText} searchAllItems={searchAllItems} pageLoader={pageLoader} hocDisplaySearchResults={hocDisplaySearchResults} hocShowSingleItem={hocShowSingleItem} hocShowAllItems={hocShowAllItems} />
	}
}