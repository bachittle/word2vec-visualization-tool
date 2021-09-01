/**
 * Dynamic Text Content: adds/removes html data dynamically as children to the div with id textContent
 */

import * as htmlData from './htmlData';

// get textContent, append children to it depending on results
const textContent = document.getElementById('textContent');

// get the button that will expand the content when clicked
const arrowButton = document.getElementById('arrowButton');

// form that will be visible on arrow button press
const wordSearchForm = document.getElementById('wordSearchForm');


arrowButton.onclick = () => {
	if (wordSearchForm.style.display === "none") {
		wordSearchForm.style.display = "block";
		arrowButton.innerHTML = '/\\';
	} else {
		wordSearchForm.style.display = "none";
		arrowButton.innerHTML = '\\/';
	}
}

export default {};