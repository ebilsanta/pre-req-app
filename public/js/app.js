const courseForm = document.querySelector('form');

const cName = document.querySelector('select');
const id = document.querySelector('input')

const line1 = document.querySelector('#line1');
const line2 = document.querySelector('#line2');
const line3 = document.querySelector('#line3');
const line4 = document.querySelector('#line4');
const line5 = document.querySelector('#line5');

courseForm.addEventListener('submit', (e) => {
	e.preventDefault();

	fetch('/course?cname='+cName.value+'&id='+id.value).then((response) => {
		response.json().then((data) => {
			if (data.error){
				return line1.textContent = data.error
			} else {
			line1.textContent = "IS" + data.id + ": " + data.cName;
			line2.textContent = "Requirements:"
			line3.textContent = data.preReqs
			line4.textContent = "Description:"
			line5.textContent = data.description
			}
		})
	})
})