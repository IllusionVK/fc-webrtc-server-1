/**
 * Express configuration
 */

'use strict';


var bodyParser = require('body-parser');
var cors = require('cors');

module.exports = function (app) {
	app.use(cors());
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(bodyParser.json({
		limit: '50mb',
		parameterLimit: 100000000 // 100,000,000
	}));

	app.use(function (req, res, next) {
		res.contentType('application/json');
		next();
	});

};