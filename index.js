var restify = require('restify');
var solrnode = require('solr-node');
var jwt = require('jwt-simple');
var helloRouter = require('./hello.router');
var testRouter = require('./test.router');

var client = new solrnode({
  host: 'localhost',
  port: '8983',
  core: 'tutorialspoint.emp',
  protocol: 'http'
});

function gettoken(headers) {
  if (headers && headers.authorization) {
    return headers.authorization;
  }

  return null;
}

function main(req, res, next) {
  res.json({ success: 1, msg: 'main' });
}

function verifytoken(req, res, next) {
  var token = gettoken(req.headers);
  if (token) {
    var decoded = jwt.decode(token, 'restifyapp');
    if (decoded === 'wfsiew') {
      next();
    }

    else {
      res.send(403, { success: 0, msg: 'Unauthorized' });
    }
  }

  else {
    res.send(403, { success: 0, msg: 'No token provided' });
  }
}

function load(req, res, next) {
  var q = client.query().q('emp_id: 1 OR emp_id: 3');
  client.search(q, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Response:', result.response);
    res.json(result.response);
  });
}

function update(req, res, next) {
  var o = { 
    emp_id: 4,
    emp_city: 'kuala lumpur',
    emp_phone: '9848022387',
    emp_name: 'ben',
    emp_sal: '20000'
  };
  client.update(o, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Update response', result.responseHeader);
    res.json(result.responseHeader);
  })
}

function remove(req, res, next) {
  var q = 'emp_id: (1 OR 2 OR 3 OR 4)';
  client.delete(q, function (err, result) {
    if (err) {
      console.log(err);
      return;
    }

    console.log('Delete response', result.responseHeader);
    res.send(result.responseHeader);
  })
}

function authenticate(req, res, next) {
  var o = {
    name: req.body.name,
    psw: req.body.psw
  };
  if (o.name === 'wfsiew') {
    var token = jwt.encode(o.name, 'restifyapp');
    res.json({ success: 1, token: token});
  }

  else {
    res.json({ success: 0, msg: 'Authentication failed' });
  }
}

var server = restify.createServer();
server.use(restify.bodyParser());
helloRouter.use(verifytoken);
testRouter.use(verifytoken);
helloRouter.applyRoutes(server);
testRouter.applyRoutes(server);

server.get('/main', verifytoken, main);
server.get('/load', load);
server.get('/update', update);
server.get('/delete', remove);
server.post('/auth', authenticate);

server.listen(5000, function () {
  console.log('%s listening at %s', server.name, server.url);
});