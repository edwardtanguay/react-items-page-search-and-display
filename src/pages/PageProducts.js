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
		m.notes = 'PRODUCT INFORMATION';
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
					{filteredItems.map((filteredItem, i) => {
						return (
							<div className="itemCard" key={i}>
								<div className="name" onClick={() => showSingleItem(filteredItem)}>{filteredItem.name}</div>
							</div>
						)
					})}
				</div>
			)}

			{/* SINGLE ITEM */}
			{filteredItem !== null && (
				<div className="singleItemCard">
					<div className="innerArea">
						<img src={`images/products/product_${filteredItem.productID.toLowerCase()}.jpg`} alt="" className="photo" onClick={() => showSingleItem(filteredItem)} />
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