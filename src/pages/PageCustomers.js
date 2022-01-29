/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import '../styles/pageItems.scss';
import '../styles/pageCustomers.scss';
import { FaSpinner } from 'react-icons/fa';

const pageConfig = {
	itemNamePlural: 'Customers',
	apiUrl: 'https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/json/customers.json',
	decorateItems: m => {
		m.bulkSearchText = `${m.companyName}|${m.contactName}|${m.contactTitle}|${m.notes}`;
		m.notes = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima nisi delectus, quisquam enim pariatur mollitia cum et ipsam illo! Animi nulla alias officiis deleniti minima numquam? Porro beatae placeat exercitationem! Earum architecto quaerat, eum, placeat deserunt quod voluptate officia culpa autem reiciendis quidem animi? Eius, at neque aliquid dolores atque corrupti dolorem ex commodi mollitia sunt repudiandae? Impedit, magni! Asperiores? Earum at ducimus et vel repellat error maiores sint debitis illum? Deserunt voluptas nostrum, ratione maiores ducimus voluptatibus repellendus, delectus cumque voluptates rem dolorum ea molestiae necessitatibus sed, nesciunt porro?';
		return m;
	}
};

const PageCustomers = ({ updateUrlBase, updateUrlWithId, updateUrlWithSearchText, searchAllItems, pageLoader, hocDisplaySearchResults }) => {
	const [searchText, setSearchText] = useState('');
	const [initialItems, setInitialItems] = useState([]);
	const [filteredItems, setFilteredItems] = useState([]);
	const [filteredItem, setFilteredItem] = useState(null);
	const inputSearchText = useRef(null);

	const isSmartphone = useMediaQuery({
		query: '(max-width: 577px)'
	});

	useEffect(async () => {
		pageLoader(pageConfig,setSearchText, setInitialItems, setFilteredItems, setFilteredItem, isSmartphone, inputSearchText);
	}, []);

	const displaySearchResults = (e) => {
		hocDisplaySearchResults(e, filteredItems, setSearchText, initialItems, setFilteredItems, setFilteredItem);
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
						{filteredItems.length} of <span className="allItemsLink" onClick={showAllItems}>{initialItems.length} {pageConfig.itemNamePlural}</span>
					</div>
				)}

				{filteredItems.length === 1 && (
					<div>
						1 of <span className="allItemsLink" onClick={showAllItems}>{initialItems.length} {pageConfig.itemNamePlural}</span>
					</div>
				)}

				{filteredItems.length === initialItems.length && filteredItems.length !== 0 && (
					<div>
						<div>{initialItems.length} {pageConfig.itemNamePlural}</div>
					</div>
				)}

				{filteredItems.length === 0 && (
					<div className="pageLoadingArea">
						<div>Loading {pageConfig.itemNamePlural.toLowerCase()}... <FaSpinner className="spinner" /> </div>
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