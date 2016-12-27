/*
 * @author himasnhu
 * Requirement - include all the global variables and module required by the application
 */

global.express = require('express');
global.errorHandler = require('errorhandler')
global.bodyParser = require('body-parser')
    //   global.ipfs = require('ipfs');
var ipfsAPI = require('ipfs-api')
global.validater = require('express-validation')
global.validationFile = require('../application-utilities/Validater')

// connect to ipfs daemon API server
// global.ipfs = ipfsAPI('localhost', '5001', {
//     protocol: 'http'
// })
global.Promise = require('node-promise').Promise
global.async = require('async')
global.crypto = require('crypto')
global.uuid = require('node-uuid');
global.winston = require('winston');
global.ifAsync = require('if-async')
global.dbConnection = require('./PgDatasource.js').getDbConnection()
    // Database dependencies and Connection setting
global.mongoose = require('mongoose');
global.Promise = require("bluebird");
var multipart = require('connect-multiparty');

global.multipartMiddleware = multipart();
global.mongooseSchema = mongoose.Schema;
global.objection = require('objection');
global.Model = objection.Model;
global.fs = require('fs');
global.solc = require('solc');
var knexReq = require('knex');
// Initialize knex connection.
global.knex = knexReq({
    client: 'pg',
    useNullAsDefault: true,
    connection: {
        host: '127.0.0.1',
        port: "5432",
        user: 'oodles',
        password: 'oodles',
        database: 'my4chain'
    }
});
var redis = require('redis');
var port = 6379;
var host = "127.0.0.1";
global.redisClient = null;
redisClient = redis.createClient(port, host);
redisClient.on('connect', function(err, reply) {
    if (err) {
        Logger.info("Error with connection with redis");

    } else {
        Logger.info("connected with redis");
    }
});
//global.knex = Promise.promisifyAll(global.knex);

// Give the connection to objection.
Model.knex(knex);
//global.dbConnection = require('./Datasource.js').getDbConnection()

global.dbConnection = require('./PgDatasource.js')
    //Ethereum_Web3 Library dependency
global.web3_extended = require('web3_ipc');

//global variable to hold all the environment specific configuration
global.configurationHolder = {}

// Application specific configuration details
configurationHolder.config = require('./Conf.js').configVariables()

//Application specific intial program to execute when server starts
configurationHolder.Bootstrap = require('./Bootstrap.js')

// Application specific security authorization middleware
configurationHolder.security = require('../application-middlewares/AuthorizationMiddleware').AuthorizationMiddleware

//UTILITY CLASSES
configurationHolder.EmailUtil = require('../application-utilities/EmailUtility')
configurationHolder.errorMessage = require('./ApplicationMessages').appErrorMessages
global.Logger = require('../application-utilities/LoggerUtility').logger

module.exports = configurationHolder
