/**
 * Module dependencies.
 */

var mongoosemask = require('mongoosemask');
global.configurationHolder = require('./configurations/DependencyInclude.js')

global.app = module.exports = express();
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(errorHandler());


global.router = express.Router();
app.use(express.static(__dirname + '/public'));
//global.route = require('./configurations/routes');
global.domain = require('./configurations/DomainInclude.js');

//removing fields from the response
app.use(mongoosemask(function (result, mask, done) {
	var masked = mask(result, []);
	if (masked.object) {
//		masked.object = mask(result.object, ['__v', 'salt', 'password']);
	}
	done(null, masked);
}));

process.on('uncaughtException', function (err) {
  console.error(err);
	Logger.info("error uncaughtException",err);

});

app.get("/",function(req,res){
res.send("server working.");
});

Layers = require('./application-utilities/layers').Express;
var wiring = require('./configurations/UrlMapping');
new Layers(app, router, __dirname + '/application/controller-service-layer', wiring);

//app.use('/',router)

configurationHolder.Bootstrap.initApp()
