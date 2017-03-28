var Router = require('restify-router').Router;
var router = new Router();

function respond(req, res, next) {
  res.send('hello ' + req.params.name);
  next();
}

router.get('/hello/:name', respond);

module.exports = router;