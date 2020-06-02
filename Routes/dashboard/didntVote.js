const express = require('express');
const router = express.Router();
const sql = require('mysql');
const db = require('../../Config/connection');


//poll display
router.get('/winner', function(req,res){
    
    //number of voters registered
    db.query("SELECT COUNT(student_id) as 'users' FROM student",function(error,rows,fields){
        if(error){
            console.log(error);
        }else{
            numU = rows[0].users;
            //number of votes
            db.query("SELECT COUNT(student_id) as 'votes' FROM votes",function(error,rows,fields){
                if(error){
                    console.log(error);
                }else{
                    numV = rows[0].votes;
                    n = Math.round((numU -numV)/numU*100);
                    res.send({
                        data: n+'%'
                    })
                }
            });
        }
    });
    //End Code

});


module.exports = router;