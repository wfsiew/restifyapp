var Router = require('restify-router').Router;
var router = new Router();

function respond(req, res, next) {
  res.send('test');
  next();
}

router.get('/test', respond);

module.exports = router;