/*
 * @author himasnhu
 * Requirement - include all the global variables and module required by the application
 */

global.express = require('express');
global.errorHandler = require('errorhandler')
global.bodyParser = require('body-parser')
global.cron = require('node-cron');
global.moment = require('moment');
//   global.ipfs = require('ipfs');
var ipfsAPI = require('ipfs-api')
global.validater = require('express-validation')
global.validationFile = require('../application-utilities/Validater')
global.abiData = null;
global.data1 = null;
global.counterAccount = 2;

// connect to ipfs daemon API server
// global.ipfs = ipfsAPI('localhost', '5001', {
//     protocol: 'http'
// })
//global.Promise = require('node-promise').Promise

global.async = require('async')
global.crypto = require('crypto')
global.uuid = require('node-uuid');
global.winston = require('winston');
global.ifAsync = require('if-async')
global.dbConnection = require('./PgDatasource.js').getDbConnection()
    // Database dependencies and Connection setting
global.mongoose = require('mongoose');
//global.Promise = require("bluebird");
var multipart = require('connect-multiparty');

global.multipartMiddleware = multipart();
global.mongooseSchema = mongoose.Schema;
global.objection = require('objection');
global.Model = objection.Model;
global.fs = require('fs');
global.solc = require('solc');
var knexReq = require('knex');
// Initialize knex connection.
var host;
if(process.env.NODE_ENV == 'development')
{
  host = '10.0.0.4'
} else if (process.env.NODE_ENV == 'production'){
  host = '10.0.0.4'
} else if (process.env.NODE_ENV == 'qa'){
   host = '10.0.0.4'
} else if (process.env.NODE_ENV == 'local'){
   host = 'localhost'
} else {
  console.log('No match of given NODE_ENV');
}

if(process.env.NODE_ENV == 'qa')
{
global.knex = knexReq({
    client: 'pg',
    useNullAsDefault: true,
    connection: {
        host: host,
        port: "5432",
        user: 'oodles',
        password: 'oodles',
        database: 'my4chainqa'
    }
});
} else
{
  global.knex = knexReq({
      client: 'pg',
      useNullAsDefault: true,
      connection: {
          host: host,
          port: "5432",
          user: 'oodles',
          password: 'oodles',
          database: 'my4chain'
      }
  });
}

var redis = require('redis');
var port = 6379;
var host = "127.0.0.1";
global.redisClient = null;
// redisClient = redis.createClient(port, host);
// redisClient.on('connect', function(err, reply) {
//     if (err) {
//         Logger.info("Error with connection with redis");
//
//     } else {
//         Logger.info("connected with redis");
//     }
// });
//global.knex = Promise.promisifyAll(global.knex);

// Give the connection to objection.
Model.knex(knex);
//global.dbConnection = require('./Datasource.js').getDbConnection()
global.domain = require('../configurations/DomainInclude.js');
global.dbConnection = require('./PgDatasource.js')
    //Ethereum_Web3 Library dependency
//global.web3_extended = require('web3_ipc');

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
configurationHolder.successMessage = require('./ApplicationMessages').appSuccessMessage
global.Logger = require('../application-utilities/LoggerUtility').logger
global.errLogger = require('../application-utilities/LoggerUtility').errlogger

global.azureQueue = require('../application-utilities/MessageQueue');
global.createUsers = require('../application-utilities/CreateUsers');
global.broadcastTransactions = require('../application-utilities/BroadcastTransactions.js');
//global.MessageProducer = require('../application-utilities/MessageProducer.js');

//azureQueue.createTopic();

function createServicebus()
{
  if(process.env.NODE_ENV == 'production') {
    azureQueue.createTopicAndSubs('account-create-prod','UsersProd');
    azureQueue.createTopicAndSubs('account-result-prod','AccountResultProd');
    azureQueue.createTopicAndSubs('transaction-request-queue-prod','TransactionsProd');
    azureQueue.createTopicAndSubs('transaction-retry-queue-prod','RetrytransactionsProd');
    azureQueue.createTopicAndSubs('transaction-result-queue-prod','TransactionsResultProd');
  } else if (process.env.NODE_ENV == 'development')
  {
    azureQueue.createTopicAndSubs('account-create-dev','UsersDev');
    azureQueue.createTopicAndSubs('account-result-dev','AccountResultDev');
    azureQueue.createTopicAndSubs('account-result-dev1','AccountResultDev1');
    azureQueue.createTopicAndSubs('transaction-request-queue-dev','TransactionsDev');
    azureQueue.createTopicAndSubs('transaction-retry-queue-dev','RetrytransactionsDev');
    azureQueue.createTopicAndSubs('transaction-result-queue-dev','TransactionsResultDev');
  } else if(process.env.NODE_ENV == 'qa')
  {
    azureQueue.createTopicAndSubs('account-create-qa','UsersQA');
    azureQueue.createTopicAndSubs('account-result-qa','AccountResultQA');
    azureQueue.createTopicAndSubs('transaction-request-queue-qa','TransactionsQA');
    azureQueue.createTopicAndSubs('transaction-retry-queue-qa','RetrytransactionsQA');
    azureQueue.createTopicAndSubs('transaction-result-queue-qa','TransactionsResultQA');
  } else if (process.env.NODE_ENV == 'local')
  {
    azureQueue.createTopicAndSubs('account-result-dev1','AccountResultDev1');
    azureQueue.createTopicAndSubs('account-create-dev','UsersDev');
    azureQueue.createTopicAndSubs('account-result-dev','AccountResultDev');
    azureQueue.createTopicAndSubs('transaction-request-queue-dev','TransactionsDev');
    azureQueue.createTopicAndSubs('transaction-retry-queue-dev','RetrytransactionsDev');
    azureQueue.createTopicAndSubs('transaction-result-queue-dev','TransactionsResultDev');
  }
  }

createServicebus();


//azureQueue.deleteTopic('account-create-prod');
//azureQueue.deleteTopic('account-result-prod');
//azureQueue.deleteTopic('transaction-request-queue-prod');
//azureQueue.deleteTopic('transaction-retry-queue-prod');
//azureQueue.deleteTopic('transaction-result-queue-prod');
//azureQueue.deleteTopic('transaction-request-test-queue');
azureQueue.createTopicAndSubs('account-result-test','AccountResultTest');
//global.processTxs = require('../application-utilities/processTransactions');

module.exports = configurationHolder
