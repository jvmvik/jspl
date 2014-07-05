var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) 
{
  res.render('index', {title: 'Hello World', people:['Mike', 'Bob', 'Henry']});
});

module.exports = router;
