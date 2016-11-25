var express = require('express');
var path = require('path');
var app = express();
var serverPort = 8080 || process.env.PORT;
var dbAddress = 'mongodb://localhost:27017/voting-app'; 
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var passport = require('passport');
var session = require('express-session');
var config = {
   partials: {
       register: '../partials/register-partial.ejs',
       mainPage: '../partials/main.ejs',
       polls: '../partials/polls-partial.ejs',
       login: '../partials/login-partial.ejs',
       profile: '../partials/profile-partial.ejs',
       settings: '../partials/settings-partial.ejs',
       singlePoll: '../partials/single-poll-partial.ejs'
   },
   pageSettings: { 
       main: {
           title: 'Welcome to my homepage!',
           h2: 'Custom polls with live results'
       },
       register: {
           title: 'Register',
           h2: 'Register for creating polls'
       },
       polls: {
           title: 'Polls',
           h2: 'List of all polls'
       },
       login: {
           title: 'Login',
           h2: 'Login to create poll'
       },
       profile: {
           title: 'Hi, User!',
           h2: 'Start Creating Polls and Share Them'
       },
       settings: {
           title: 'Hi, User!',
           h2: 'Change your password or your account name'
       },
       singlePoll:{
           title: 'Vote now',
           h2: 'Vote now and pick how you want to see the data'
       },
       nav: {
           loggedOut:{links:[
               {
                   href: '/polls',
                   name: 'Polls'
               },
               {
                   href: '/auth/register',
                   name: 'Register'
               },
               {
                   href: '/auth/login',
                   name: 'Login'
               }]
           },
           loggedIn:{links:[
               {
                   href: '/polls',
                   name: 'Polls'
               },
               {
                   href: '/auth/profile',
                   name: 'Profile'
               },
               {
                   href: '/auth/profile/settings',
                   name: 'Settings'
               },
               {
                   href: '/auth/logout',
                   name: 'Logout'
               }]
           }
       }
   }
};
var AuthRouter = require('./src/routes/AuthRouter')(dbAddress,config);
var PollRouter = require('./src/routes/PollRouter')(dbAddress,config);


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
    secret: 'localApp',
    resave: true,
    saveUninialized: true
}));
app.use(cookieParser('secret'));
app.use(flash());
require('./src/config/passport')(app);
app.use(express.static(path.join(__dirname,'public')));
app.set('views',path.join(__dirname,'src/views/pages'));
app.set('view engine', 'ejs')

app.get('/',function(req,res){
    console.log(req.session.userLogged)
    res.render('index',{
        partial: config.partials.mainPage, 
        title: config.pageSettings.main.title,
        h2: config.pageSettings.main.h2,
        nav: config.pageSettings.nav,
        isLoggedIn: req.session.userLogged
    });
});

app.use('/auth',AuthRouter);
app.use('/polls',PollRouter);
app.listen(serverPort,function(){
   console.log(`Server started on port ${serverPort}!`); 
});