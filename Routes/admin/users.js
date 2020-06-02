const express = require('express');
const router = express.Router();
const db = require('../../Config/connection');

// https://www.google.com/search?sxsrf=ACYBGNTYlMQJtaCZrBvwP3xDB9kBStN26g%3A1573310053843&ei=Zc7GXeSIM86T8gK96KPAAw&q=nodejs+file+input+image+upload&oq=nodejs+file+input+image+upload&gs_l=psy-ab.3...851437.853304..853393...0.3..0.696.2282.2-2j1j0j2......0....1..gws-wiz.......0i71.e1_ptspSEKg&ved=0ahUKEwikz4XXrN3lAhXOiVwKHT30CDgQ4dUDCAs&uact=5
// nodejs file input image upload

router.post('/imgUploadInfo', (req, res) => {

  let sfc_name = req.body.sfc_name;
  //sfc_changed
  let uploadedFile = req.files.sfc_img;
  let fileExtension = uploadedFile.mimetype.split('/')[1];
  let sfc_img = sfc_name + '.' + fileExtension;

  let usernameQuery = "SELECT * FROM sfc WHERE sfc_img = '" + sfc_img + "'";

  db.query(usernameQuery, (err, result) => {
    if (err) {
      return res.status(500).send(console.log("Error: ", err));
    } else {
      // upload the file to the /public/assets/img directory
      uploadedFile.mv('public/assets/img/' + sfc_img, (err) => {
        if (err) {
          return res.status(500).send(err);
        } else {
          if (result.length > 0) {
            res.json({
              message: "image exist replace from folder",
              data: result,
              status: 200
            })
          } else {
            // check the filetype before uploading it
            // part.filename.match(/\.(jpg|jpeg|png)$/i)
            if (uploadedFile.mimetype === 'image/png' || uploadedFile.mimetype === 'image/jpeg' || uploadedFile.mimetype === 'image/gif') {

              const post = [
                sfc_id = req.body.sfc_id,
                fac_id = req.body.fac_id,
                sfc_name = req.body.sfc_name,
                sfc_position = req.body.sfc_position,
                sfc_img = sfc_name + '.' + fileExtension
              ]

              // send the details to the database
              // let query = "INSERT INTO sfc SET ?";

                sfc_img = sfc_name + '.' + fileExtension
                db.query("INSERT INTO `sfc` (`sfc_id`, `fac_id`, `sfc_name`, `sfc_position`, `sfc_img`) VALUES ('"+sfc_id+"', '"+fac_id+"', '"+sfc_name+"', '"+sfc_position+"', '"+sfc_img+"')", function (err, result) {
                if (err) {
                  console.log(err);
                  res.send({
                    status: 400,
                    message: err
                  })
                }
                else {
                  res.send({
                    data: result,
                    status: 200,
                    message: "Registered Sucessfully"
                  })
                }
              })
            } else {
              res.send({
                status: 200,
                message: "Invalid File format: Only 'gif', 'jpeg' and 'png' images are allowed."
              })
            }
          }
        }
      })
    }
  })

})

//retrieve data from user
router.get('/student', function (req, res) {

  db.query('SELECT student_id, student_fname, student_lname, fac_id  FROM student', function (error, results, fields) {
    if (error) {
      console.log('error')
    } else {
      return res.send({ data: results });
    }

  });
});

//delete
router.delete('/student/:id', function (req, res) {
  var stud = { id: req.params.id };

  db.query('DELETE FROM student WHERE student_id = ' + req.params.id, stud, function (error, result) {
    if (error) {
      console.log('error')
    } else {
      res.send({ message: 'delete success' });
    }
  })
});

module.exports = router;