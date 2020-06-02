const express = require('express');
const router = express.Router();
const sql = require('mysql');
const db = require('../../Config/connection');


//display
router.get('/sfcWin/:fac_id', function(req,res){

    var fac_id = req.params.fac_id;
    console.log(fac_id);

    db.query('SELECT MAX(v.sfc_id) as ID, s.sfc_img, s.sfc_name, s.sfc_position, s.fac_id, COUNT(v.sfc_id) as "total votes" FROM votes v, sfc s WHERE v.sfc_id = s.sfc_id AND s.fac_id ="' + fac_id + '" GROUP BY s.sfc_position LIMIT 7',function(err,rows,fields){
        if (err) {
            // console.log('Cannot get ', err);
            res.send({
                data: err,
                code: 400,
                message: "error"
            });
            
        } else {
            console.log(rows);
            res.send({
                
                data : rows,
                code: 200,
                message: "successful"
            });
        }
    });
});


module.exports = router;