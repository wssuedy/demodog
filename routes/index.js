var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.locals.user = req.session.user || "";
  console.log(req.session.user);
  console.log("主页");
  res.render('index');
});

module.exports = router;
