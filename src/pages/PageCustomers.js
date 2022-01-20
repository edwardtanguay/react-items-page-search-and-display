/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from 'react';
import * as qsys from '../qtools/qsys';
import { useMediaQuery } from 'react-responsive';
import '../styles/pageItems.scss';
import '../styles/pageCustomers.scss';
import { FaSpinner } from 'react-icons/fa';

// TODO: test bad urls e.g. customers?id=undefined

const itemNamePlural = 'Customers';

const PageCustomers = () => {
	const [searchText, setSearchText] = useState('');
	const [initialItems, setInitialItems] = useState([]);
	const [filteredItems, setFilteredItems] = useState([]);
	const [filteredItem, setFilteredItem] = useState(null);
	const inputSearchText = useRef(null);

	const isSmartphone = useMediaQuery({
		query: '(max-width: 577px)'
	});

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

	useEffect(() => {

		setTimeout(async () => {

			const response = await fetch('https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/json/customers.json');
			const rawItemsFromJson = await response.json();

			const _initialItems = rawItemsFromJson.map(m => {
				m.bulkSearchText = `${m.companyName}|${m.contactName}|${m.contactTitle}|${m.notes}`;
				m.notes = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima nisi delectus, quisquam enim pariatur mollitia cum et ipsam illo! Animi nulla alias officiis deleniti minima numquam? Porro beatae placeat exercitationem! Earum architecto quaerat, eum, placeat deserunt quod voluptate officia culpa autem reiciendis quidem animi? Eius, at neque aliquid dolores atque corrupti dolorem ex commodi mollitia sunt repudiandae? Impedit, magni! Asperiores? Earum at ducimus et vel repellat error maiores sint debitis illum? Deserunt voluptas nostrum, ratione maiores ducimus voluptatibus repellendus, delectus cumque voluptates rem dolorum ea molestiae necessitatibus sed, nesciunt porro?';
				return m;
			});
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
			}

			if (!isSmartphone && urlId === '') {
				setTimeout(() => {
					inputSearchText.current.focus();
				}, 200);
			}
		}, 1000);

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
		<div className="pageItems pageCustomers">

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

				{filteredItems.length === initialItems.length && filteredItems.length !== 0 && (
					<div>
						<div>{initialItems.length} {itemNamePlural}</div>
					</div>
				)}

				{filteredItems.length === 0 && (
					<div className="pageLoadingArea">
						<div>Loading {itemNamePlural.toLowerCase()}... <FaSpinner className="spinner" /> </div>
					</div>
				)}
			</div>


			<div className="searchArea">
				<input type="text" ref={inputSearchText} placeholder="SEARCH" value={searchText} onFocus={displaySearchResults} onChange={displaySearchResults} />
			</div>

			{/* MULTIPLE ITEMS */}
			{filteredItems.length > 1 && (
				<div className="itemsArea">
					{filteredItems.map((filteredItem, i) => {
						return (
							<div className="itemCard" key={i}>
								<div className="fullName">{filteredItem.contactName}</div>
								<div className="title">{filteredItem.contactTitle}</div>
								<div className="companyName">{filteredItem.companyName}</div>
								<img src={`images/customers/customer_${filteredItem.customerID.toLowerCase()}.jpg`} alt="" className="photo" onClick={() => showSingleItem(filteredItem)} />
							</div>
						)
					})}
				</div>
			)}

			{/* SINGLE ITEM */}
			{filteredItem !== null && (
				<div className="singleItemCard">
					<div className="innerArea">
						<img src={`images/customers/customer_${filteredItem.customerID.toLowerCase()}.jpg`} alt="" className="photo" onClick={() => showSingleItem(filteredItem)} />
						<div className="info">
							<div className="fullName">{filteredItem.contactName}</div>
							<div className="title">{filteredItem.contactTitle}</div>
							<div className="companyName">{filteredItem.companyName}</div>
							<div className="address">
								<div className="street">{filteredItem.address.street}</div>
								<div className="cityLine">{filteredItem.address.city} {filteredItem.postalCode} {filteredItem.address.country}</div>
								<div className="phone">{filteredItem.address.phone}</div>
							</div>
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