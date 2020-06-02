const db = require('../Config/connection');
var express = require('express');
var session = require('express-session');
const router = express.Router();
var jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const secretOrKey = 'secretKey';
const nodemailer = require('nodemailer');
const randomstring = require('randomstring');
router.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

router.post('/sendEmailOTP/:student_id', function (req, res) {

	let student_id = req.params.student_id;

	if (student_id) {
		//Sending an email
		var myQuery = "SELECT * FROM student WHERE student_id ='" + student_id + "'";

		db.query(myQuery, function (err, results) {

			if (err) {
				res.send({
					message: err,
					status: 400
				})
			} else {
				if (results.length > 0) {
					//generating a number
					var OTPSent = randomstring.generate({
						length: 4,
						charset: 'numeric'
					});

					var transporter = nodemailer.createTransport({
						service: 'Outlook',
						auth: {
							user: 'e-Voting@outlook.com',
							pass: '@eVoting2019'
						}
					});

					var mailOptions = {
						from: 'e-Voting@outlook.com',
						to: student_id + '@tut4life.ac.za',
						subject: 'OTP',
						text: 'Confirmation OTP: ' + OTPSent + '\n\n\n\n\n Regards eVoting'
					};

					transporter.sendMail(mailOptions, function (err, res, info) {
						if (err) {
							res.send({
								message: err,
								status: 400
							})
						} else {
							res.json({
								status: 200,
								message: "A pin has been sent to your TUT4LIFE account."
							})
						}
					})

					var myQuery2 = "UPDATE student SET otp = '" + OTPSent + "' WHERE student_id = '" + student_id + "'";
					db.query(myQuery2, (err, results => {
						if (err) {
							// console.log(err);
							res.json({
								message: err,
								status: 400
							});
						} else {
							// console.log(results);
							res.json({
								message: "Otp Updated",
								status: 200
							});
						}
					}))

				} else {
					res.send({
						message: "The student number doesn't exists"
					})
				}
			}
		});
	}
});

router.post('/login', function (req, res) {

	var OTP = req.body.OTP;
	var student_id = req.body.student_id;
	var student_password = req.body.student_password;

	var myOTPQuery = "SELECT otp from student WHERE student_id = '" + student_id + "' AND otp = '" + OTP + "'";

	db.query(myOTPQuery, function (err, results) {

		if (err) {
			res.json({
				message: err,
				status: 400
			});
		} else {
			if (results.length > 0) {
				var myQuery = 'SELECT * FROM student WHERE student_id = ? AND student_password = ?';

				db.query(myQuery, [student_id, student_password, OTP], function (error, results, fields) {

					if (error) {
						res.json({
							message: error,
							status: 400
						});
					} else {

						var payload = {
							id: results[0].student_id,
							name: results[0].student_fname,
							lastName: results[0].student_lname
						};
						var token = jwt.sign(payload, secretOrKey, { expiresIn: 60 * 5 }); //made it that the tokken expires in 5 minuts

						res.json({
							data: [results[0].student_fname + " " + results[0].student_lname],
							message: "LoggedIn Successfully",
							status: 200,
							token: token
						});
					}
				});
			} else {
				res.send({
					status: 401,
					message: "Incorrect OTP"
				})
			}
		}
	})

});

router.post('/loginAdmin', function (req, res) {

	var admin = req.body.admin_id;
	var password = req.body.admin_password;

	if (admin && password) {
		
		var query = 'SELECT * FROM admin WHERE admin_id = ? AND admin_password = ?';

		db.query(query, [admin, password], function (error, results) {

			if (error) {
				// console.log(error);
				res.json({
					message: error,
					status: 400
				})
			} else {
				if (results.length > 0) {
					var payload = {
						id: results[0].admin_id,
						name: results[0].admin_name,
						lastName: results[0].admin_lname
					};
					var token = jwt.sign(payload, secretOrKey, { expiresIn: 60 * 5 }); //token expires in 5 minutes

					res.json({
						data: [results[0].admin_name + " " + results[0].admin_lname],
						message: "Admin LoggedIn Successfully",
						status: 200,
						token: token
					});
				} else {
					res.json({
						status: 401,
						message: "Incorect student number or password!"
					})
				}
			}
		});
	}

});

module.exports = router;
