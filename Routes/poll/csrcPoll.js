const express = require('express');
const router = express.Router();
const sql = require('mysql');
const db = require('../../Config/connection');


//poll display
router.get('/csrc', function(req,res){


    db.query('SELECT c.csrc_id, c.csrc_name, c.csrc_img , COUNT(v.csrc_id) res FROM csrc c, votes v WHERE v.csrc_id = c.csrc_id GROUP BY v.csrc_id ORDER BY COUNT(v.csrc_id) DESC',function(err,rows,fields){
        if (err) {
            // console.log('Cannot get ', err);
            res.send({
                data: err,
                code: 400,
                message: "error"
            });
            
        } else {
            count = 0;
            if(rows.length > 0){
                for (let x = 0; x < rows.length; x++) {
                    count = count + rows[x].res;
                }
                count = "Total Votes = " + count;
            }else{
                count = "No one voted yet!";
            }
            return res.send({
                data: rows,
                count: count
            });
        }
    });
});


module.exports = router;