/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useRef, useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import '../styles/pageItems.scss';
import '../styles/pageProducts.scss';
import { ItemPageHeader } from '../components/ItemPageHeader';

const pageConfig = {
	itemSingularTitle: 'Product',
	itemPluralTitle: 'Products',
	itemSingularText: 'product',
	itemPluralText: 'products',
	itemIdFieldName: 'productID',
	apiUrl: 'https://raw.githubusercontent.com/graphql-compose/graphql-compose-examples/master/examples/northwind/data/json/products.json',
	decorateItems: m => {
		m.bulkSearchText = `${m.quantityPerUnit}|${m.name}`;
		m.notes = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Minima nisi delectus, quisquam enim pariatur mollitia cum et ipsam illo! Animi nulla alias officiis deleniti minima numquam? Porro beatae placeat exercitationem! Earum architecto quaerat, eum, placeat deserunt quod voluptate officia culpa autem reiciendis quidem animi? Eius, at neque aliquid dolores atque corrupti dolorem ex commodi mollitia sunt repudiandae? Impedit, magni! Asperiores?';
		return m;
	}
};

const PageProducts = ({ pageLoader, hocDisplaySearchResults, hocShowAllItems, hocShowSingleItem }) => {
	const [searchText, setSearchText] = useState('');
	const [initialItems, setInitialItems] = useState([]);
	const [filteredItems, setFilteredItems] = useState([]);
	const [filteredItem, setFilteredItem] = useState(null);
	const inputSearchText = useRef(null);

	const isSmartphone = useMediaQuery({
		query: '(max-width: 577px)'
	});

	useEffect(async () => {
		pageLoader(pageConfig, setSearchText, setInitialItems, setFilteredItems, setFilteredItem, isSmartphone, inputSearchText);
	}, []);

	const displaySearchResults = (e) => {
		hocDisplaySearchResults(pageConfig, e, filteredItems, setSearchText, initialItems, setFilteredItems, setFilteredItem);
	}

	const showSingleItem = (item) => {
		hocShowSingleItem(pageConfig, item, setFilteredItems, setFilteredItem);
	}


	const showAllItems = () => {
		hocShowAllItems(pageConfig, setInitialItems, initialItems, setFilteredItems, setFilteredItem, setSearchText, isSmartphone, inputSearchText);
	}

	return (
		<div className="pageItems pageProducts">

			<ItemPageHeader filteredItems={filteredItems} initialItems={initialItems} showAllItems={showAllItems} pageConfig={pageConfig} inputSearchText={inputSearchText} searchText={searchText} displaySearchResults={displaySearchResults} />

			{/* MULTIPLE ITEMS */}
			{filteredItems.length > 1 && (
				<div className="itemsArea">
					<ul className="itemList">
						{filteredItems.map((filteredItem, i) => {
							return (
								<li className="item" key={i}>
									<div className="name" onClick={() => showSingleItem(filteredItem)}>{filteredItem.name}</div>
								</li>
							)
						})}
					</ul>
				</div>
			)}

			{/* SINGLE ITEM */}
			{filteredItem !== null && (
				<div className="singleItemCard">
					<div className="innerArea">
						<div className="info">
							<div className="name">{filteredItem.name}</div>
							<div className="quantityInfo">{filteredItem.quantityPerUnit}</div>
							<div className="notes">{filteredItem.notes}</div>
						</div>
					</div>
					<div className="clear"></div>
				</div>
			)}

		</div>
	)
}

export default PageProducts;