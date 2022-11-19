const puppeteer = require('puppeteer');
const Course = require('../../models/course');
require('../db/mongoose');

// used to get course details and store it in database
const BASE_URL = "https://publiceservices.smu.edu.sg/psc/ps/EMPLOYEE/HRMS/c/SIS_CR.SIS_CLASS_SEARCH.GBL"
const getISCourses = async () => {
	const browser = await puppeteer.launch({headless:false});
	const page = await browser.newPage();
	const alpha_page = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split("")

	for (const alpha of alpha_page) {
		await page.goto(BASE_URL, { waitUntil: 'networkidle2' })
		await page.click(`#SSR_CLSRCH_WRK2_SSR_ALPHANUM_${alpha}`)
		await waitFor(3000)
		let bodyHandle = await page.$('body');
		
		let indexes = await page.evaluate((body => {
			result = []
			for (let a of body.querySelectorAll('a')) {
				if (a.textContent.includes('View Class Sections')) {
					result.push(a.id.split('$')[1])
				}
			}
			return result
		}), bodyHandle)
		console.log('indexes: ', indexes)
		for (const index of indexes) {
			await page.goto(BASE_URL, { waitUntil: 'networkidle2' })
			await page.waitForSelector(`#SSR_CLSRCH_WRK2_SSR_ALPHANUM_${alpha}`)
			await page.click(`#SSR_CLSRCH_WRK2_SSR_ALPHANUM_${alpha}`)
			await waitFor(3000)
			const courseTitleId = 'DERIVED_CLSRCH_COURSE_TITLE_LONG$'+ index
			const courseName = await page.evaluate((courseTitleId) => {
				let el = document.getElementById(courseTitleId)
				return el ? el.innerText : ""
			}, courseTitleId)
			console.log('course title retrieved', courseName)

			if (courseName) {
				const viewSectionsId = `#DERIVED_CLSRCH_SSR_SELECT\\$${index}`
				console.log(viewSectionsId)
				await page.waitForSelector(viewSectionsId)
				await waitFor(2000)
				await page.evaluate((id) => {
					console.log("id: ", id)
					document.querySelector(id).click()
				}, viewSectionsId)
				console.log('page clicked supposedly')
				await page.waitForSelector('#CLASS_SECTION\\$0')
				console.log('course loaded')
				await page.click("#CLASS_SECTION\\$0")
				await waitFor(3000)
				await page.waitForFunction(
					'document.querySelector("#DERIVED_CLSRCH_DESCR200")'
				)
				console.log('section loaded')
				let fullName = await page.$eval("#DERIVED_CLSRCH_DESCR200", el => el.innerText)
				let [id, cName] = getId_cName(fullName)
				let preReqs = await page.$eval("#SSR_CLS_DTL_WRK_SSR_REQUISITE_LONG", el => el.innerText).catch(()=>"None")
				let description = await page.$eval("#DERIVED_CLSRCH_DESCRLONG", el=> el.innerText)
				console.log('id==================', id) 
				console.log('cName=============', cName)
				const query = {id}
				const update = { 
								id, 
								cName,
								preReqs,
								description
								}	
				const options = { upsert: true, new: true, setDefaultsOnInsert: true }
				// inserts a new document if id not found, else updates the document
				Course.findOneAndUpdate(query, update, options, function(err, result) {
					if (err) {
						return
					}
				})
			}
		}

	}
	await page.close()
	await browser.close()
	return
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
			console.log(id, cName, preReqs, description)
			// let course = new Course({
			// 					id,
			// 					cName,
			// 					preReqs,
			// 					description
			// 					})
			// await course.save();
			} 
		else{
			continue
		}
	}
	await page.close()
	await browser.close()
}

function getId_cName (fullName) {
	const id_groupName = fullName.split('-')
	let courseId, courseName
	if (id_groupName.length == 4) {
		courseId = id_groupName.slice(0,2).join('-').split(/\s+/).join("")
		courseName = id_groupName.slice(2).join('-').split(/\s+/).slice(1).join(" ")
	} else if (id_groupName.length == 3) {
		if (id_groupName[0] == 'COR') {
			courseId = id_groupName.slice(0, 2).join('-').split(/\s+/).join("")
			courseName = id_groupName[2].split(/\s+/).slice(2).join(' ')
		} else {
			courseId = id_groupName[0].split(/\s+/).join("")
			courseName = id_groupName.slice(1).join('-').split(/\s+/).slice(2).join(" ")
		}
	} else {
		courseId = id_groupName[0].split(/\s+/).join("")
		courseName = id_groupName[1].split(/\s+/).slice(2).join(" ")
	}
	courseId = courseId.split('.').join("")
	return [
		courseId,
		courseName
	]
}

function waitFor(delay) {
    return new Promise(resolve => setTimeout(resolve, delay));
}

getISCourses()

function getAllCourses() {
	Course.find({}).then((result) => {
		for (const course of result) {
			console.log(course.id, course.cName)
		}
	})
}


async function editCourse(wrongId, newId, newName)  {
	let doc = await Course.findOneAndUpdate({id: wrongId}, {id:newId, cName:newName}, {new:true})
	console.log(doc.id)
	console.log(doc.cName)
}

