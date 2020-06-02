const express = require('express');
const router = express.Router();
const sql = require('mysql');
const db = require('../../Config/connection');


//poll display
router.get('/totals', function(req,res){


    //number of voters registered
    db.query("SELECT COUNT(isrc_id) as 'users' FROM iscrc",function(error,rows,fields){
        if(error){
            console.log(error);
        }else{
            isrc_votes = rows[0].users;
            //number of votes
            db.query("SELECT COUNT(csrc_id) as 'csrc' FROM csrc",function(error,rows,fields){
                if(error){
                    console.log(error);
                }else{
                    csrc_votes = rows[0].csrc;
                    db.query("SELECT COUNT(sfc_id) as 'sfc' FROM sfc",function(error,rows,fields){
                        if(error){
                            console.log(error);
                        }else{
                            sfc_votes = rows[0].sfc;
                            res.send({
                                isrc_votes: isrc_votes,
                                csrc_votes: csrc_votes,
                                sfc_votes: sfc_votes
                            })
                        }
                    });
                }
            });
        }
    });
    //End
});


router.get('/sfcTot', function(req,res){


    db.query('SELECT COUNT(*)res FROM sfc c',function(err,rows,fields){
        if (err) {
            console.log('Cannot get ', err);
            res.send({
                data: err,
                code: 400,
                message: "error"
            });
            
        } else {
            console.log(rows);
            res.send({
                data : rows,
                //code: 200,
                message: "sfc votes"
            });
        }
    });
});

module.exports = router;