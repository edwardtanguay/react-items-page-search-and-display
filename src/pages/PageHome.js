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
			<h2>Page: Customers</h2>
			<h2>Page: Suppliers</h2>
		</div>
	)
}

export default PageHome;