import '../styles/pageHome.scss';
// TODO: highlight words that were searched
const PageHome = () => {
	return (
		<div className="pageHome">
			<h1>React Item Page Demonstration</h1>
			<ul>
				<li>This site demonstrates how to display multiple items on a page with <strong>search feature</strong> and a <strong>click-to-see-more-details feature</strong>.</li>
				<li>Note that the <strong>URL</strong> and the <strong>tab title</strong> change appropriately.</li>
				<li>Note also that there are examples of two data sources: <strong>a local JSON file</strong> and <strong>APIs</strong>.</li>
			</ul>

			<h2>Page: Employees</h2>
			<ul>
				<li>loads from JSON file</li>
				<li>variables are named specifically, i.e. with the word <code>employee</code> instead of <code>item</code></li>
				<li>all functions are self-contained on the page</li>
			</ul>

			<h2>Page: Customers</h2>
			<ul>
				<li>loads from API</li>
				<li>variables are named generically with the word <code>item</code></li>
				<li>functionality for this page is imported from itemPageManager and shared with the products page</li>
			</ul>

			<h2>Page: Products</h2>
			<ul>
				<li>loads from API</li>
				<li>variables are named generically with the word <code>item</code></li>
				<li>functionality for this page is imported from itemPageManager and shared with the customers page</li>
			</ul>

		</div>
	)
}

export default PageHome;