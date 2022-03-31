// Loading the library modules
require('dotenv').config();
var express = require('express');
var path = require("path");
var bodyParser = require('body-parser');
var xssFilter = require('./middleware/xss-filter');
var mustache = require('mustache-express');
var app = express();

// middlewares
// We use the express.static middleware to serve up the static files in the public/ directory
app.use('/static', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(xssFilter);

app.engine('html', mustache());
app.set('view engine', 'html');
app.set('views', path.join(__dirname, './public/views'));

// index
app.get('/', function (req, res) {
	res.sendFile('public/views/index.html', { root: __dirname });
});

// Get Pollution Data > From Location functionality (Search a location)
app.get('/fromlocation', function (req, res) {
	res.sendFile('public/views/fromlocation.html', { root: __dirname });
});

app.get('/favicon.ico', (req, res) => res.sendStatus(204));

// routers

// Mail functionality uses /mail
app.use('/mail', require('./router/mail-router'));

// Everything else (Get Pollution Data/Air Quality Map) uses /airdata
app.use('/airdata', require('./router/airdata-router'));

// comparing data from website/router/airdata-router:
app.use('/comparing', require('./router/comparing-data'));

// API functionality uses /api
app.use('/api', require('./router/api-router'));

// general error handler
app.use(function (err, req, res, next) {
	if (err) {
		console.log('internal server error', err);
		res.status(500).send(JSON.stringify({
			code: 500,
			msg: err.message
		}));
	} else {
		next();
	}
});

// not found handler
app.use(function (req, res, next) {
	console.log(req.path, 'not found');
	res.sendFile('public/views/pagenotfound.html', { root: __dirname });
});

// Port to listen to
app.listen(8081, "0.0.0.0", () => console.log(`SERVER STARTED`));
