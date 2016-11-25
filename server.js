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
var AuthRouter = require('./src/routes/AuthRouter')(dbAddress);
var PollRouter = require('./src/routes/PollRouter')(dbAddress);

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
    res.render('index');
});

app.use('/auth',AuthRouter);
app.use('/polls',PollRouter);
app.listen(serverPort,function(){
   console.log(`Server started on port ${serverPort}!`); 
});