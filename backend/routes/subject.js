var express = require('express');
var router = express.Router();

/* GET subject/:id page. */
router.get('/api', function(req, res) {
  res.render('subject', { 
    id: req.params.id,
  });
});

module.exports = router;
