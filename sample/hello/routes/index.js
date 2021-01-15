var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) 
{
  res.render('index', {title: 'The Nobel Prize in Physics 2013',  people: ['François Englert ', 'Peter W. Higgs']});
});

module.exports = router;
