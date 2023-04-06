const express = require('express');
const debug = require('debug')('app:main');
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const {Config} = require('./src/config/index.js');
const {UsersApi} = require("./src/users/index.js");

const app = express();

//middlewares 
app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:false}));
app.use(session({
    secret:'pedrofaino',
    resave:false,
    saveUninitialized: false,
}))
app.use(passport.initialize);
app.use(passport.session());
app.use(flash());

UsersApi(app);

//routes
require('./app/routes'(app,passport))

app.listen(Config.port, ()=>{
    debug(`Servidor escuchando en el puerto ${Config.port}`)
})

