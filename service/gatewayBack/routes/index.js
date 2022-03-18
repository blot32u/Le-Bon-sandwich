var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/signin', function(req, res, next) {
  if(req.query.username != null && req.query.password != null){
    var request = require('request')
    var username = req.query.username
    var password = req.query.password
    var options = {
        url: 'http://localhost:3331/connex',
        auth: {
          user: username,
          password: password
        }
    }
    request(options, function (err, res, body) {
      if (err) {
        console.dir(err)
        return
      }
      console.dir('headers', res.headers)
      console.dir('status code', res.statusCode)
      console.dir(body)
    })
  }
});

module.exports = router;
