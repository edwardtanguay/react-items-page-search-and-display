import { FaSpinner } from 'react-icons/fa';

export const ItemPageHeader = ({ filteredItems, initialItems, showAllItems, pageConfig, inputSearchText, searchText, displaySearchResults }) => {
	return (
		<>
			<div className="totalHeader">
				{filteredItems.length > 1 && filteredItems.length < initialItems.length && (
					<div>
						{filteredItems.length} of <span className="allItemsLink" onClick={showAllItems}>{initialItems.length} {pageConfig.itemPluralTitle}</span>
					</div>
				)}

				{filteredItems.length === 1 && (
					<div>
						1 of <span className="allItemsLink" onClick={showAllItems}>{initialItems.length} {pageConfig.itemPluralTitle}</span>
					</div>
				)}

				{filteredItems.length === initialItems.length && filteredItems.length !== 0 && (
					<div>
						<div>{initialItems.length} {pageConfig.itemPluralTitle}</div>
					</div>
				)}

				{filteredItems.length === 0 && (
					<div className="pageLoadingArea">
						<div>Loading {pageConfig.itemPluralTitle.toLowerCase()}... <FaSpinner className="spinner" /> </div>
					</div>
				)}
			</div>

			<div className="searchArea">
				<input type="text" ref={inputSearchText} placeholder="SEARCH" value={searchText} onFocus={displaySearchResults} onChange={displaySearchResults} />
			</div>
		</>
	)
}