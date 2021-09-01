/**
 * Dynamic Text Content: adds/removes html data dynamically as children to the div with id textContent
 */

// get textContent, append children to it depending on results
const textContent = document.getElementById('textContent');

// get the button that will expand the content when clicked
const arrowButton = document.getElementById('arrowButton');

// form that will be visible on arrow button press
export const wordSearchForm = document.getElementById('wordSearchForm');

const wordSearchSettings = document.getElementById('settings');

// current amount of items stored for simplicity
let amountOfWords = 1;

export const results = [];

export const getWordFormData = () => {
	return `
	<div id="item${amountOfWords}" class="items">
		<input type="text" name="word[]" placeholder="Enter a Word">
		<input type="checkbox" class="checkbox">
	</div>
	`;
}

arrowButton.onclick = () => {
	if (wordSearchForm.style.display === "none") {
		wordSearchForm.style.display = "block";
		wordSearchSettings.style.display = "block";
		arrowButton.innerHTML = '/\\';
	} else {
		wordSearchForm.style.display = "none";
		wordSearchSettings.style.display = "none";
		arrowButton.innerHTML = '\\/';
	}
}

wordSearchForm.onsubmit = (e) => {
	e.preventDefault();
	const data = new FormData(wordSearchForm);
	const words = data.getAll('word[]');
	console.log(words);
	results = words;
}

// plus and minus button will add form elements
const plusButton = document.getElementById('plusButton');
const minusButton = document.getElementById('minusButton');

plusButton.onclick = () => {
	if (amountOfWords < 10) {
		wordSearchForm.innerHTML += getWordFormData();
		amountOfWords++;
	}
};

minusButton.onclick = () => {
	if (amountOfWords > 1) {
		amountOfWords--;
		const lastElem = document.getElementById(`item${amountOfWords}`)
		lastElem.remove();
	}
}