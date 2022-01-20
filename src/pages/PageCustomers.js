/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from 'react';
import rawItemsFromJson from '../data/customers.json';
import * as qsys from '../qtools/qsys';
import { useMediaQuery } from 'react-responsive';
import '../styles/pageItems.scss';
import '../styles/pageCustomers.scss';

const itemNamePlural = 'Customers';
// https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/json/customers.json

const PageCustomers = () => {
	const [searchText, setSearchText] = useState('');
	const [initialItems, setInitialItems] = useState([]);
	const [filteredItems, setFilteredItems] = useState([]);
	const [filteredItem, setFilteredItem] = useState({});
	const inputSearchText = useRef(null);

	const isSmartphone = useMediaQuery({
		query: '(max-width: 577px)'
	});

	const updateUrlBase = () => {
		qsys.changeBrowserState(document, 'customers', '', '', `All Customers`);
	}

	const updateUrlWithId = (item) => {
		qsys.changeBrowserState(document, 'customers', 'id', item.itemID, `Customer: ${item.contactName}`);
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

	useEffect(() => {
		const _initialItems = rawItemsFromJson.map(m => {
			m.bulkSearchText = `${m.companyName}|${m.contactName}|${m.contactTitle}|${m.notes}`;
			return m;
		});
		let _filteredItems = [..._initialItems];

		const urlId = Number(qsys.getParameterValueFromUrl('id'));
		if (urlId !== 0) {
			_filteredItems = _initialItems.filter(m => m.itemID === urlId);
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
		if (_filteredItems.length === 1) {
			setFilteredItem(_filteredItems[0]);
		}

		if (!isSmartphone) {
			inputSearchText.current.focus();
		}

	}, []);

	const displaySearchResults = (e) => {
		const searchText = e.target.value;
		if (searchText.trim() !== '' || filteredItems.length > 0) {
			setSearchText(e.target.value);

			const filteredItems = searchAllItems([...initialItems], searchText);
			setFilteredItems([...filteredItems]);
			if (filteredItems.length === 1) {
				setFilteredItem(filteredItems[0]);
			}
			updateUrlWithSearchText(searchText);
		}
	}

	const showSingleItem = (item) => {
		setFilteredItems([item]);
		setFilteredItem(item);
		updateUrlWithId(item);
	}

	const showAllItems = () => {
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

	return (
		<div className="pageItems">

			<div className="totalHeader">
				{filteredItems.length > 1 && filteredItems.length < initialItems.length && (
					<div>
						{filteredItems.length} of <span className="allItemsLink" onClick={showAllItems}>{initialItems.length} {itemNamePlural}</span>
					</div>
				)}

				{filteredItems.length === 1 && (
					<div>
						1 of <span className="allItemsLink" onClick={showAllItems}>{initialItems.length} {itemNamePlural}</span>
					</div>
				)}

				{filteredItems.length === initialItems.length && (
					<div>
						<div>{initialItems.length} {itemNamePlural}</div>
					</div>
				)}
			</div>

			<div className="searchArea">
				<input type="text" ref={inputSearchText} placeholder="SEARCH" value={searchText} onFocus={displaySearchResults} onChange={displaySearchResults} />
			</div>

			{/* MULTIPLE EMPLOYEES */}
			{filteredItems.length > 1 && (
				<div className="itemsArea">
					{filteredItems.map((p, i) => {
						return (
							<div className="itemCard" key={i}>
								<div className="fullName">{p.contactName}</div>
								<div className="title">{p.contactTitle}</div>
								<div className="companyName">{p.companyName}</div>
								<img src={`images/customers/customer_test.jpg`} alt="" className="photo" onClick={() => showSingleItem(p)} />
							</div>
						)
					})}
				</div>
			)}

			{/* SINGLE EMPLOYEE */}
			{filteredItems.length === 1 && (
				<div className="singleItemCard">
					<div className="innerArea">
						<img src={`images/items/item_${filteredItem.itemID}.jpg`} alt="item" className="photo" />
						<div className="info">
							<div className="fullName">{filteredItem.firstName} {filteredItem.lastName}</div>
							<div className="title">{filteredItem.title}</div>
							<div className="notes">{filteredItem.notes}</div>
						</div>
					</div>
					<div className="clear"></div>
				</div>
			)}

		</div>
	)
}

export default PageCustomers;