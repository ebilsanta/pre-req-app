const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
	id: {
		type: String,
		default: 0,
	},
	cName: {
		type: String,
		required: true,
		trim: true
	},
	preReqs: {
		type: String,
		required: true,
		trim: true,
	}, 
	description: {
		type: String,
		trim: true, 
		required: true
	}
});

const Course = mongoose.model('Course', courseSchema)
module.exports = Course

// userSchema.statics.findByCredentials = async (email, password) => {
// 	const user = await User.findOne({ email })
// 	if(!user){
// 		throw new Error("User not found");
// 	}
// 	const isMatch = await bcrypt.compare(password, user.password);
// 	if(!isMatch){
// 		throw new Error("Wrong password");
// 	}
// 	return user
// }

// userSchema.methods.generateAuthToken = async function() {
// 	const user = this
// 	const token = jwt.sign({_id: user._id.toString()}, 'thisismynewcourse')
// 	user.tokens = user.tokens.concat({ token })
// 	await user.save();
// 	return token
// }
// userSchema.methods.toJSON = function() {
// 	const user = this
// 	const userObject = user.toObject()
// 	delete userObject.password
// 	delete userObject.tokens

// 	return userObject
// }

// userSchema.virtual('tasks', {
// 	ref: 'Task',
// 	localField: '_id',
// 	foreignField: 'author'
// })

// Hash password by4saving
// userSchema.pre('save', async function (next) {
// 	const user = this

// 	if (user.isModified('password')) {
// 		user.password = await bcrypt.hash(user.password, 8)
// 	}
// 	next()
// })

// userSchema.pre('remove', async function(next) {
// 	const user = this
// 	await Task.deleteMany({author: user._id})
// 	next()
// })


