
const express = require('express')
const app = express()
const User = require('./models/user')

const path = require('path')

const port = process.env.PORT || 3000

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const mongo = process.env.MONGODB || 'mongodb://localhost/noticias'

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(express.static('public'))

app.get('/', (req, res) => res.render('index'))

/*
mongoose
    .connect(mongo, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        app.listen(port, ()=> console.log('listening...'))
    })
    .catch( e => console.log(e))

    const bcrypt = require('bcrypt')
    bcrypt.genSalt((err, salt) => console.log(salt))
*/

mongoose
    .connect('mongodb+srv://noticias:noticias@cluster0.khxse.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        app.listen(port, ()=> console.log('listening...'))
    })
    .catch( e => console.log(e))

/*
    const user = new User({
        username: 'renatoDomingues',
        password: 'abc123'
    })
    user.save(() => console.log('Salvo!!'))
*/
