var express = require('express');
var path = require('path');
var app = express();
var serverPort = 3000 || process.env.PORT;
var dbAddress = 'mongodb://localhost:27017/voting-app'; 
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var flash = require('connect-flash');
var passport = require('passport');
var session = require('express-session');
var config = require('./src/config/layoutConfig');
/*app.locals.scripts = '/scripts/charts.js';*/
var AuthRouter = require('./src/routes/AuthRouter')(dbAddress,config);
var PollRouter = require('./src/routes/PollRouter')(dbAddress,config);
var SettingsRouter = require('./src/routes/SettingsRouter')(dbAddress,config);
var HomePageRouter = require('./src/routes/HomePage.Router')();
/* to do redirect middleware when not logged in for settings, profile etc */
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
app.use(function(req,res,next){
    res.locals.buttons = config.pageSettings.buttons;
    res.locals.nav = config.pageSettings.nav;
    next();
});

var checkIfLogged = function (req, res, next){
    if(req.user){
        req.session.userLogged = 1;
        res.locals.isLoggedIn = req.session.userLogged;
    } else{
        res.locals.isLoggedIn = undefined;
        req.session.userLogged = undefined;
    }
    next();
};

app.use(checkIfLogged);
app.use('/',HomePageRouter);
app.use('/auth',AuthRouter);
app.use('/polls',PollRouter);
app.use('/settings',SettingsRouter);
app.all('*',function(req,res){
   res.redirect('/'); 
});
app.listen(serverPort,function(){
   console.log(`Server started on port ${serverPort}!`); 
});