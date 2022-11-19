const courseForm = document.querySelector('form');

var cName = document.querySelector('select');
var query = document.querySelector('#query')

const line0 = document.querySelector('#line0')
const line1 = document.querySelector('#line1');
const line2 = document.querySelector('#line2');
const line3 = document.querySelector('#line3');
const line4 = document.querySelector('#line4');
const line5 = document.querySelector('#line5');

cName.addEventListener('change', (e) => {
	e.preventDefault();
	let id = cName.value
	fetch('/course?id='+id).then((response) => {
		response.json().then((data) => {
			if (data.error){
				return line1.textContent = data.error
			} else {
				console.log(data)
			line1.textContent = data.id + ": " + data.cName;
			line2.textContent = "Requirements:"
			line3.textContent = data.preReqs
			line4.textContent = "Description:"
			line5.textContent = data.description
			}
		})
	})
})
