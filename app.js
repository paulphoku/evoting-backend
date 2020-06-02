const express = require('express');
const cors = require('cors');
// const mysql = require('mysql');
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const db = require('./Config/connection');
const path = require('path');
// const bcrypt = require('bcrypt')

//jwt tokens
var _ = require("lodash");
// var jwt = require('jsonwebtoken');

var passport = require("passport");
var passportJWT = require("passport-jwt");

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'secretKey';

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
    console.log('payload received', jwt_payload);
    // usually this would be a database call:

    db.query('select * from user where user_id=?', [jwt_payload.id], function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0)
            next(null, result[0]);
        else
            next(null, false);
    })
});

passport.use(strategy);

const app = express();
//Adding middleware
app.use(cors());
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());

//Accessible in all res.render calls
app.use(function(req, res, next){
    res.locals.user = req.user;
    next();
});


app.get('/test',passport.authenticate('jwt', { session: false }), function (req, res) {
    let id = 215123456
    db.query('select * from user where user_id=?', [id], function (err, result, fields) {
        if (err) throw err;
        if (result.length > 0)
            res.json(result)
        else
            res.send('empty')
    })
})

//Importing routes

//routes
app.use('/', require('./Routes/login'));
app.post('/insert', require('./Routes/register'));
app.post('/imageRe', require('./Routes/imgRegistration'));
app.post('/admin', require('./Routes/adminReg'));
app.post('/select', require('./Routes/display/sfcInfo'));
app.post('/Re', require('./Routes/registerAdmin'));
app.get('/selectInfo', require('./Routes/selectFac'));
app.get('/selectInfo', require('./Routes/selectFac'));
app.use('/update', require('./Routes/update'));
app.use('/voted', require('./Routes/voted'));
//Ballot
app.use('/', require('./Routes/ballot/votes'));
app.use('/', require('./Routes/ballot/sfc'));
app.use('/', require('./Routes/ballot/iscrc'));
app.use('/', require('./Routes/ballot/csrc'));
// admin
app.use('/', require('./Routes/admin/users'));
app.post('/saveStd', require('./Routes/admin/users'));
app.use('/', require('./Routes/admin/users'));
app.use('/imgUploadInfo', require('./Routes/admin/users'));
//Dispaly
app.use('/', require('./Routes/display/sfcInfo'));
app.use('/', require('./Routes/display/isrcInfo'));
app.use('/', require('./Routes/display/csrcInfo'));
//Poll
app.use('/', require('./Routes/poll/sfcPoll'));
app.use('/', require('./Routes/poll/isrcPoll'));
app.use('/', require('./Routes/poll/csrcPoll'));
//Dashboard
app.use('/', require('./Routes/dashboard/iscrc'));
app.use('/', require('./Routes/dashboard/sfc'));
app.use('/', require('./Routes/dashboard/faculty'));
app.use('/', require('./Routes/dashboard/csrc'));
app.use('/', require('./Routes/dashboard/voterNum'));
app.use('/', require('./Routes/dashboard/didntVote'));
app.use('/', require('./Routes/dashboard/totalVotes'));
app.use('/', require('./Routes/dashboard/winners'));
app.put('/upd', require('./Routes/dashboard/csrc'));

const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 7000;
const server = app.listen(port, function () {
                          console.log('Server listening on port ' + port);
                             });