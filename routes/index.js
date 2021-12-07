import express from "express"
var router = express.Router();

router.get('/api', function(res) {
  res.send("Hello World!")
});

module.exports = router;
