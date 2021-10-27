
const express = require('express')
const router = express.Router()
const User = require('../models/user')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const FacebookStrategy = require('passport-facebook').Strategy
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

//use
router.use(passport.initialize())
router.use(passport.session())

passport.serializeUser((user, done) => {
    done(null, user)
})
passport.deserializeUser((user, done) => {
    done(null, user)
})

//"passport.use()" definindo a estratégia para login local
passport.use(new LocalStrategy(async(username, password, done) =>{
    const user = await User.findOne({ username })

    if(user){
        const isValid = await user.checkPassword(password)

        if(isValid){
            return done(null, user)
        }else{
            return done(null, false)
        }
    }else{
        return done(null, false)
    }
}))

// "passport.use()" definindo a estratégia para login FacebookStrategy
passport.use(new FacebookStrategy({
    clientID: '938482473752541',
    clientSecret: '559e0020f7b09665d073f9d7e63a566f',
    callbackURL: 'http://localhost:3000/facebook/callback',
    profileFields: ['id', 'displayName', 'email', 'photos']
}, async(accessToken, refreshToken, profile, done) => {
    const userDB = await User.findOne({ facebookId: profile.id })

    if(!userDB){
        const user = new User({
            name: profile.displayName,
            facebookId: profile.id,
            roles: ['restrito']
        })
        await user.save()
        done(null, user)
    }else{
        done(null, userDB)
    }
}))
// "passport.use()" definindo a estratégia para login GoogleStrategy
passport.use(new GoogleStrategy({
    clientID: '401873369931-3in499pjhng8t0o8jbbk5l88mmt5afi8.apps.googleusercontent.com',
    clientSecret: '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',
    callbackURL: 'http://localhost:3000/google/callback'
    
}, async(accessToken, refreshToken, err, profile, done) => {
    const userDB = await User.findOne({ googleId: profile.id })

    if(!userDB){
        const user = new User({
            name: profile.displayName,
            googleId: profile.id,
            roles: ['restrito']
        })
        await user.save()
        done(null, user)
    }else{
        done(null, userDB)
    }
}))

router.use((req, res, next) => {
    if(req.isAuthenticated()){
        res.locals.user = req.user

        if(!req.session.role){
            req.session.role = req.user.roles[0]
        }
        res.locals.role = req.session.role
    }
    next()
})

//get
router.get('/change-role/:role', (req, res) => {

    if(req.isAuthenticated()){
        if(req.user.roles.indexOf(req.params.role)>=0){
            req.session.role = req.params.role
        }
    }
    res.redirect('/')
})
router.get('/login', (req, res) => {
    res.render('login')
})
router.get('/logout', (req, res) => {
    req.session.destroy( () => {
        res.redirect('/')
    })
})

//post
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: false
}))
//get facebook
router.get('/facebook', passport.authenticate('facebook'))
router.get('/facebook/callback',
    passport.authenticate('facebook', { failureRedirect: '/' }),
    (req, res) => {
        res.redirect('/')
    }
)

//get google
router.get('/google', passport.authenticate('google', { scope: [' https://www.googleapis.com/auth/userinfo.profile '] }))
router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: '/', successRedirect: '/' })
)

module.exports = router