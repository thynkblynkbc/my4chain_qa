/**
 * Module dependencies.
 */

var mongoosemask = require('mongoosemask');
global.configurationHolder = require('./configurations/DependencyInclude.js');
global.app = module.exports = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json({
    limit: '52428800',
    type: 'application/json'
}));
app.use(bodyParser.urlencoded({
    limit: '52428800',
    extended: true,
    parameterLimit: 52428800
}));
app.use(bodyParser());
app.use(errorHandler());
global.router = express.Router();
global.publicdir = __dirname;
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/upload'));
app.use(mongoosemask(function(result, mask, done) {
    var masked = mask(result, []);
    if (masked.object) {}
    done(null, masked);
}));
process.on('uncaughtException', function(err) {
    console.error(err);
    Logger.info("error uncaughtException", err);
});
app.get("/", function(req, res) {
    res.send("server working.");
});
Layers = require('./application-utilities/layers').Express;
var wiring = require('./configurations/UrlMapping');
new Layers(app, router, __dirname + '/application/controller-service-layer', wiring);
app.use(function(err, req, res, next) {
    var errorObject = {};
    Logger.error("Error in express ", err.stack)
    var errorString = JSON.stringify(err);
    console.log(errorString.length, errorString)
    if (errorString.length < 5) {
        errorObject.message = "Error in request api";
        errorObject.error = true;
        errorObject.object = null;
        errorObject.timeStamp = new Date().getTime();
        res.status(500).json(errorObject);
    } else {
        err.object = err.errors;
        err.error = true;
        err.timeStamp = new Date().getTime();
        delete err.errors;
        res.status(400).json(err);
    }
});
configurationHolder.Bootstrap.initApp();
