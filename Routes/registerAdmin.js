// var session = require('express-session');
var express = require('express')
// var mysql = require('mysql');
const router = express.Router();
const db = require('../Config/connection');
// const bcrypt = require('bcrypt');
// const saltRounds = 10;

router.post('/Re', function (request, response) {

  // var today = new Date();
  var post = {
    "sfc_position": request.body.sfc_name,
    "sfc_name": request.body.sfc_name,
    "sfc_id": request.body.sfc_id,
    "fac_id": request.body.fac_id
  };

  if (!post) {
    res.send({
      code: 400,
      message: "False"
    })
  }
 /* bcrypt.hash(request.body.student_password, saltRounds,function(err, hash) {
    //bcrypt.hash('student_password', 10, function(err, hash) {
      var post = {
        "sfc_position": request.body.sfc_name,
    "sfc_name": request.body.sfc_name,
    "sfc_id": request.body.sfc_id,
    "fac_id": request.body.fac_id
      };*/
    db.query('INSERT INTO sfc SET ?', [post,], function (error, results, fields) {
    if (error) {
      response.send({
        data: error,
        status: 400,
        message: "Student already exists, Please login"
      })

    } else {
      response.send({
        data: results,
        status: 200,
        message: "Registered Sucessfully"
      });

    }

    });
  });

  
//})

//  let path = require('path')
//  router.use((req, res, next)  => {
//      console.log(`${new Date().toString()} => ${req.originalUrl}`)
//      next()
//  })







module.exports = router;