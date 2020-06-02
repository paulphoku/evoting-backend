const express = require('express');
const router = express.Router();
const sql = require('mysql');
const db = require('../../Config/connection');


//poll display
router.get('/isrc', function(req,res){


    db.query('SELECT c.isrc_name, COUNT(v.isrc_id) results FROM iscrc c, votes v WHERE v.isrc_id = c.isrc_id GROUP BY v.isrc_id ORDER BY COUNT(v.isrc_id) DESC',function(err,rows,fields){
        if (err) {
            // console.log('Cannot get ', err);
            res.send({
                data: err,
                code: 400,
                message: "error"
            });
            
        } else {
            count = 0;
            chartData="";
            if(rows.length > 0){
                for (let x = 0; x < rows.length; x++) {
                    count = count + rows[x].results;
                    chartData += "['" +rows[x].isrc_name + "'," + rows[x].results + "],";
                }
                chartData = chartData.substring(0, chartData.length - 1);
                count = "Total Votes = " + count;
            }else{
                count = "No one voted yet!";
            }
            return res.send({
                data: rows,
                count: count,
                chartData: chartData
            });
        }
        
    });
});


module.exports = router;