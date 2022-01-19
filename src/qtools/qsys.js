export const changeBrowserState = (doc, page, variable, value, title) => {
	if (variable.trim() === '') {
		window.history.replaceState('', '', page);
	} else {
		window.history.replaceState('', '', `${page}?${variable}=${value}`);
	}
	doc.title = title;
};