const express = require('express');
const router = express.Router();
const sql = require('mysql');
const db = require('../../Config/connection');



//retrieve data from user
router.get('/getfaculty', function (req, res) {

    db.query('SELECT fac_id, fac_name  FROM faculty', function (error, rows, fields) {
        if (error) {
            console.log(error);
        }
        else {

            return res.send({
                display: 'faculty results',
                data: rows
            });
        }


    });
});

router.get('/dropdown/:fac_id', function (req, res) {

    let fac_id = req.params.fac_id;
    db.query('SELECT * FROM sfc WHERE fac_id="' + fac_id + '"', function (error, rows, fields) {
        if (error) {
            res.send({
                message: "Error: " + error,
                status: 400
            })
        } if (rows.length > 0) {
            res.send({
                data: rows,
                message: "Got all Faculty at: " + fac_id,
                status: 200
            })
        } else {
            res.send({
                status: 400,
                data: error,
                message: "No faculty member found on"
            })
        }
    })
});


module.exports = router;