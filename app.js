/**
 * Module dependencies.
 */

var mongoosemask = require('mongoosemask');
global.configurationHolder = require('./configurations/DependencyInclude.js')

global.app = module.exports = express();

///
var bodyParser = require('body-parser')
//app.use(express.json());

app.use(bodyParser.json({limit: '52428800',type: 'application/json'}));
app.use(bodyParser.urlencoded({limit: '52428800',extended: true,parameterLimit:52428800}));
app.use(bodyParser());
app.use(function(err,req,res,callback){
	if(err instanceof SyntaxError && err.status===400 && 'body' in err){
		console.log('Bad json');
		 configurationHolder.ResponseUtil.responseHandler(res,null,"Wrong body of json" , false, 403);
	}
});




app.use(errorHandler());

///

// var bodyParser = require('body-parser');
// app.use(bodyParser.urlencoded({ extended: false }));
//
// app.use(bodyParser.json());
//
// app.use(errorHandler());


global.router = express.Router();
global.publicdir = __dirname;
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/upload'));
//global.route = require('./configurations/routes');
global.domain = require('./configurations/DomainInclude.js');
// require('./configurations/EthereumContract.js');
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
