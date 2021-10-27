
const express = require('express')
const router = express.Router()
const Noticia = require('../models/noticia') 

//use
router.use((req, res, next) => {
    //console.log('Opa')
    if(req.isAuthenticated()){
        if(req.user.roles.indexOf('restrito') >=0){
            return next()
        }else{
            res.redirect('/')
        }
    }
    //res.send('Precisa logar')
    res.redirect('/login')
})

//get
router.get('/', (req, res) => {
    res.send('restrito')
})

router.get('/noticias', async(req, res) => {
    const noticias = await Noticia.find({ category: 'private' })
    res.render('noticias/restrito', { noticias })
})

module.exports = router