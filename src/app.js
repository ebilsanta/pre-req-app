const path = require('path');
const express = require('express');
require('../db/mongoose');
const hbs = require('hbs');
const Course = require('../models/course');

const app = express();
const port = process.env.PORT || 3000;

const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publicDirectoryPath));

// retrieve all course names from database to display in drop down menu
app.get('', (req, res) => {
    Course.find({}).then((result) => {
		let courseList = []
		for (const course of result){
			courseList.push(course.cName)
		}
		courseList.sort();
		res.render('index', {
			title: 'IS Courses Info',
			name: 'Thaddeus', 
			courseList
		});
    }).catch((e) => {
        res.status(500).send()
    })
})

// queries for course based on name or id, sends back error or result
app.get('/course', async (req,res) => {
	if (!req.query.id && !req.query.cname){
		res.send({error: "Please select a course or enter course code"})

	} else if (req.query.id){
		await Course.findOne({id: req.query.id})
		.then((course)=>{
			res.send({id: course.id,
				cName: course.cName,
				preReqs: course.preReqs,
				description: course.description
				})
		}) 
		.catch(() => {
			res.status(404).send({error: "No such course code found"})
		})
	}
	 else {
			await Course.findOne({cName: req.query.cname})
			.then((course)=>{
				res.send({id: course.id,
					cName: course.cName,
					preReqs: course.preReqs,
					description: course.description
					})
			})
	}	
})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Thaddeus'
    })
})


app.get('*', (req, res) =>{
	res.render('404', {
		message: "Page not found",
		title: "Error 404"
	})
})

app.listen(port, () =>{
	console.log("Listening to port 3000");
})