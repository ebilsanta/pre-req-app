const puppeteer = require('puppeteer');
const Course = require('../../models/course');
require('../../db/mongoose');

// used to get course details and store it in database
const getISCourses = async () => {
	const browser = await puppeteer.launch({headless:false});
	const page = await browser.newPage();

	for (let i = 51; i <= 165; i++){
		await page.goto("https://publiceservices.smu.edu.sg/psc/ps/EMPLOYEE/HRMS/c/SIS_CR.SIS_CLASS_SEARCH.GBL")
		await page.click("#SSR_CLSRCH_WRK2_SSR_ALPHANUM_I")
		await page.waitForFunction(
			'document.querySelector("body").innerText.includes("Introduction to Programming")'
		);

		const courseTitleId = 'DERIVED_CLSRCH_COURSE_TITLE_LONG$'+i
		let courseName = await page.evaluate((courseTitleId) => {
			let el = document.getElementById(courseTitleId)
			return el ? el.innerText : ""
		}, courseTitleId)

		if (courseName){
			const viewSectionsId = "#DERIVED_CLSRCH_SSR_SELECT\\$"+i
			await page.click(viewSectionsId);
			await page.waitForFunction(
				'document.querySelector("#DERIVED_SAA_CRS_DESCR200")'
			)
			await page.click("#CLASS_SECTION\\$0")
			await page.waitForFunction(
				'document.querySelector("#DERIVED_CLSRCH_DESCR200")'
			)
			let fullName = await page.$eval("#DERIVED_CLSRCH_DESCR200", el => el.innerText)
			let [id, cName] = getId_cName(fullName)
			let preReqs = await page.$eval("#SSR_CLS_DTL_WRK_SSR_REQUISITE_LONG", el => el.innerText).catch(()=>"None")
			let description = await page.$eval("#DERIVED_CLSRCH_DESCRLONG", el=> el.innerText)
			let course = new Course({
								id,
								cName,
								preReqs,
								description
								})
			await course.save();
			} 
		else{
			continue
		}
	}
	await page.close()
	await browser.close()
}

function getId_cName (fullName) {
	let regex = /\d{3}/
	return [
		fullName.match(regex)[0],
		fullName.split(/-(.*)/s)[1].slice(5).trim()
	]
}

getISCourses()