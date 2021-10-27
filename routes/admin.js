

const express = require('express')
const router = express.Router()
const Noticia = require('../models/noticia') 

//use
router.use((req, res, next) => {
    //console.log('Opa')
    if(req.isAuthenticated()){
        if(req.user.roles.indexOf('admin') >=0){
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
    res.send('admin')
})

router.get('/noticias', async(req, res) => {
    const noticias = await Noticia.find({ })
    res.render('noticias/admin', { noticias })
})

module.exports = router