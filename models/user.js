
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    }
})

UserSchema.pre('save', function(next){
    const user = this

    if(!user.isModified('password')){
        return next()
    }

    bcrypt.genSalt((err, salt) => {
        //console.log(salt)
        bcrypt.hash(user.password, salt, (err, hash) => {
            //console.log(hash)
            user.password = hash
            next()
        })
    })
})

const User = mongoose.model('User', UserSchema)

module.exports = User