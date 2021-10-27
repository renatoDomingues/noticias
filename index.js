
const express = require('express')
const app = express()
const User = require('./models/user')
const noticias = require('./routes/noticias')
const restrito = require('./routes/restrito')
const session = require('express-session')
const bodyParser = require('body-parser')
const auth = require('./routes/auth')
const pages = require('./routes/pages')
const Noticia = require('./models/noticia')
const admin = require('./routes/admin')

const path = require('path')

const port = process.env.PORT || 3000

const mongoose = require('mongoose')
mongoose.Promise = global.Promise
const mongo = process.env.MONGODB || 'mongodb://localhost/noticias'

//set
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//use
app.use(session({ secret: 'fullstack-master' }))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use('/', auth)
app.use('/', pages)
app.use('/restrito', restrito)
app.use('/noticias', noticias)
app.use('/admin', admin)

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

const createinitialUser = async() => {
    const total = await User.count({ })

    if(total ===0){
        const user = new User({
            username: 'user1',
            password: '1234',
            roles: ['restrito', 'admin']
        })
        await user.save()

        const user2 = new User({
            username: 'user2',
            password: '1234',
            roles: ['restrito']
        })
        await user2.save()

        console.log('user created ... Salvo!!')
    }else{
        console.log('user created ... Skipped!!')
    }

    
    const noticia = new Noticia({
        title: 'Notícia Pública'+new Date().getTime(),
        content: 'content',
        category: 'public'
    })
    await noticia.save()

    const noticia2 = new Noticia({
        title: 'Notícia Privada'+new Date().getTime(),
        content: 'content',
        category: 'private'
    })
    await noticia2.save()
}


mongoose
    .connect('mongodb+srv://noticias:noticias@cluster0.khxse.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        createinitialUser()
        app.listen(port, ()=> console.log('listening...'))
    })
    .catch( e => console.log(e))
