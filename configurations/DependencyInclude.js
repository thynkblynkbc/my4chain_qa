global.express = require('express');
global.errorHandler = require('errorhandler')
global.bodyParser = require('body-parser')
global.cron = require('node-cron');
global.moment = require('moment');
var ipfsAPI = require('ipfs-api')
global.validater = require('express-validation')
global.validationFile = require('../application-utilities/Validater')
global.abiData = null;
global.data1 = null;
global.counterAccount = 2;
global.async = require('async')
global.crypto = require('crypto')
global.uuid = require('node-uuid');
global.winston = require('winston');
global.ifAsync = require('if-async')
global.dbConnection = require('./PgDatasource.js').getDbConnection()
var multipart = require('connect-multiparty');
global.multipartMiddleware = multipart();
global.objection = require('objection');
global.Model = objection.Model;
global.fs = require('fs');
global.solc = require('solc');
var knexReq = require('knex');
var host;
if (process.env.NODE_ENV == 'development') {
    host = '10.0.0.4'
} else if (process.env.NODE_ENV == 'production') {
    host = '10.0.0.4'
} else if (process.env.NODE_ENV == 'qa') {
    host = '10.0.0.4'
} else if (process.env.NODE_ENV == 'local') {
    host = 'localhost'
} else {
    console.log('No match of given NODE_ENV');
}
if (process.env.NODE_ENV == 'production') {
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
}else if (process.env.NODE_ENV == 'qa') {
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
} else if (process.env.NODE_ENV == 'development') {
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
}else {
    global.knex = knexReq({
        client: 'pg',
        useNullAsDefault: true,
        connection: {
            host: host,
            port: "5432",
            user: 'neeraj',
            password: '123456',
            database: 'my4chain'
        }
    });
}
var redis = require('redis');
var port = 6379;
var host = "127.0.0.1";
global.redisClient = null;
Model.knex(knex);
global.domain = require('../configurations/DomainInclude.js');
global.dbConnection = require('./PgDatasource.js')
global.configurationHolder = {}
configurationHolder.config = require('./Conf.js').configVariables()
configurationHolder.Bootstrap = require('./Bootstrap.js')
configurationHolder.security = require('../application-middlewares/AuthorizationMiddleware').AuthorizationMiddleware
configurationHolder.EmailUtil = require('../application-utilities/EmailUtility')
configurationHolder.errorMessage = require('./ApplicationMessages').appErrorMessages
configurationHolder.successMessage = require('./ApplicationMessages').appSuccessMessage
global.Logger = require('../application-utilities/LoggerUtility').logger
global.errLogger = require('../application-utilities/LoggerUtility').errlogger
global.azureQueue = require('../application-utilities/MessageQueue');
global.createUsers = require('../application-utilities/CreateUsers');
global.broadcastTransactions = require('../application-utilities/BroadcastTransactions.js');

function createServicebus() {
    if (process.env.NODE_ENV == 'production') {
        azureQueue.createTopicAndSubs('account-create-prod', 'UsersProd');
        azureQueue.createTopicAndSubs('account-result-prod', 'AccountResultProd');
        azureQueue.createTopicAndSubs('transaction-request-queue-prod', 'TransactionsProd');
        azureQueue.createTopicAndSubs('transaction-retry-queue-prod', 'RetrytransactionsProd');
        azureQueue.createTopicAndSubs('transaction-result-queue-prod', 'TransactionsResultProd');
    } else if (process.env.NODE_ENV == 'development') {
        azureQueue.createTopicAndSubs('account-create-dev', 'UsersDev');
        azureQueue.createTopicAndSubs('account-result-dev', 'AccountResultDev');
        azureQueue.createTopicAndSubs('account-result-dev1', 'AccountResultDev1');
        azureQueue.createTopicAndSubs('transaction-request-queue-dev', 'TransactionsDev');
        azureQueue.createTopicAndSubs('transaction-retry-queue-dev', 'RetrytransactionsDev');
        azureQueue.createTopicAndSubs('transaction-result-queue-dev', 'TransactionsResultDev');
    } else if (process.env.NODE_ENV == 'qa') {
        azureQueue.createTopicAndSubs('account-create-qa', 'UsersQA');
        azureQueue.createTopicAndSubs('account-result-qa', 'AccountResultQA');
        azureQueue.createTopicAndSubs('transaction-request-queue-qa', 'TransactionsQA');
        azureQueue.createTopicAndSubs('transaction-retry-queue-qa', 'RetrytransactionsQA');
        azureQueue.createTopicAndSubs('transaction-result-queue-qa', 'TransactionsResultQA');
    } else if (process.env.NODE_ENV == 'local') {
        azureQueue.createTopicAndSubs('account-create-local', 'UsersLocal');
        azureQueue.createTopicAndSubs('account-result-local', 'AccountResultLocal');
        azureQueue.createTopicAndSubs('transaction-request-queue-local', 'TransactionsLocal');
        azureQueue.createTopicAndSubs('transaction-retry-queue-local', 'RetrytransactionsLocal');
        azureQueue.createTopicAndSubs('transaction-result-queue-local', 'TransactionsResultLocal');
    }
}
createServicebus();
azureQueue.createTopicAndSubs('account-result-test', 'AccountResultTest');
module.exports = configurationHolder
