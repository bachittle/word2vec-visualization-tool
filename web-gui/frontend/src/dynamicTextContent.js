/**
 * Dynamic Text Content: adds/removes html data dynamically as children to the div with id textContent
 */

// get textContent, append children to it depending on results
const textContent = document.getElementById('textContent');

// get the button that will expand the content when clicked
const arrowButton = document.getElementById('arrowButton');

// form that will be visible on arrow button press
const wordSearchForm = document.getElementById('wordSearchForm');

// current amount of items stored for simplicity
let amountOfWords = 1;

export const getWordFormData = () => {
	return `
	<div id="item${amountOfWords}">
		<input type="text" name="word[]" placeholder="Enter a Word">
		<input type="checkbox" class="checkbox">
	</div>
	`;
}

arrowButton.onclick = () => {
	if (wordSearchForm.style.display === "none") {
		wordSearchForm.style.display = "block";
		arrowButton.innerHTML = '/\\';
	} else {
		wordSearchForm.style.display = "none";
		arrowButton.innerHTML = '\\/';
	}
}

wordSearchForm.onsubmit = (e) => {
	e.preventDefault();
	const data = new FormData(wordSearchForm);
	const words = data.getAll('word[]');
	console.log(words);
}

// plus and minus button will add form elements
const plusButton = document.getElementById('plusButton');
const minusButton = document.getElementById('minusButton');

plusButton.onclick = () => {
	console.log('test');
	wordSearchForm.innerHTML += getWordFormData();
	amountOfWords += 1;
};

export default {};