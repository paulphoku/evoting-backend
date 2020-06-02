const express = require('express');
const router = express.Router();
const sql = require('mysql');
const db = require('../../Config/connection');


//poll display
router.get('/sfc/:fac_id', function(req,res){

    var fac_id = req.params.fac_id;
    
    db.query("SELECT v.sfc_id, s.sfc_name, s.sfc_position, s.sfc_img,f.fac_name, COUNT(v.sfc_id) res FROM votes v, sfc s, faculty f WHERE year = 2019 AND s.sfc_id = v.sfc_id AND s.fac_id = f.fac_id AND s.fac_id = "+fac_id+" GROUP BY v.sfc_id ORDER BY COUNT(v.sfc_id) DESC", function(error,rows,fields){
        if(error){
            // console.log(error)
        }else{
            count = 0;
            if(rows.length > 0){
                for (let x = 0; x < rows.length; x++) {
                    count = count + rows[x].res;
                }
                count = "Total Votes = " + count;
            }else{
                count = "No one voted for this facaulty yet!";
            }
            return res.send({
                data: rows,
                count: count
            });
        } 
    });
});
module.exports = router;