const express = require('express');
const router = express.Router();
const sql = require('mysql');
const db = require('../../Config/connection');

//retrieve data from user
router.get('/retrieve', function (req, res) {

    db.query('SELECT csrc_id, csrc_name, csrc_img  FROM csrc', function (error, rows, fields) {
        if (error) {
            res.send({
                data: error,
                status: 400,
                message: 'error occur'
            });
        }
        else {
            res.send({
                data: rows,
                status: 400,
                message: 'true'
            });
        }


    });
});

router.post('/saved', function (request, response) {

    var save = {
        "csrc_id": request.body.csrc_id,
        "csrc_name": request.body.csrc_name,
        "csrc_img": request.body.csrc_img

    }
    db.query('INSERT INTO  csrc SET ?', save, function (error, results) {
        if (error) {
            res.send({
                data: error,
                status: 400,
                message: 'error ocurred'
            });
        } else {
            response.send({
                data: results,
                status: 200,
                message: " csrc candidate registered sucessfully"
            });
        }
    });

})

//delete
router.delete('/csrc/:csrc_id', function (req, res) {
    var csrc = req.params.csrc_id;

    db.query('DELETE FROM csrc WHERE csrc_id =' + csrc, function (error, result) {
        if (error) {
            res.send({
                data: error,
                status: 400,
                message: 'error'
            });
        } else {
            res.send({
                data:result,
                status: 200,
                message: 'delete success'
            });
        }
    })
});

router.put('/upda', (req, res) => {
    var sql = 'UPDATE csrc SET csrc_name= ?, csrc_name = ? WHERE csrc_id = ?';
    db.query(sql, [req.body.csrc_name, req.body.csrc_name, req.body.csrc_id], (err, results, rows, fields) => {
        if (err) {
            res.send({
                data: err,
                status: 400,
                message: 'error'
            });
        }
        else {
            res.send({
                data: results,
                status: 200,
                message: 'Updated Successfully'
            });
        }
    });
});


module.exports = router;

