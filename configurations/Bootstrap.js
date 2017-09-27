'use strict';
var Person = require('../application/models/PersonDetail');
var getContractAddress = require('../application-utilities/cron/GetContractAddress');
var publishData = require('../application-utilities/cron/PromisePublishContractData');
var initApp = function() {
    Logger.info("config" + configurationHolder.config.accessLevels["anonymous"]);;
    startPrivateWeb3Ethereum();
    createContractAbi();
    createPerson();
}

function confirmRequest() {
    var cron = require('node-cron');
    console.log("Cron function call")
    cron.schedule('*/40 * * * * *', function() {
        getContractAddress.contractAddress();
    });
}

function createContractAbi() {
    fs.readFile('./solidity/NumberContract.sol', 'utf8', function(err, solidityCode) {
        if (err) {
            console.log("error in reading file: ", err);
            return;
        } else {
            Logger.info("File Path: ", './solidity/NumberContract.sol');
            Logger.info(new Date());
            Logger.info("-----compling solidity code ----------");
            Logger.info(new Date());
            try {
                var compiled = solc.compile(solidityCode, 1);
                global.solAbi = JSON.parse(compiled.contracts[":documentAccessMapping"].interface);
                global.solBytecode = compiled.contracts[":documentAccessMapping"].bytecode;
                Logger.info("-----complile complete ----------");
                Logger.info(new Date());
                bootApplication();
            } catch (e) {
                if (e) {
                    Logger.info(e);
                    console.log("error:", e);
                }
            }
        }
    });
}

function startWeb3Ethereum() {
    var Web3 = require('web3');
    global.web3 = {};
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    if (!web3.isConnected()) {
        Logger.info("ethereum public testnet not connected");
    } else {
        Logger.info("ethereum public testnet connected");
    }
}

function startPrivateWeb3Ethereum() {
    var Web3 = require('web3');
    var privateWeb3Con = {};
    global.privateWeb3 = {};
    var con = new Web3.providers.HttpProvider(configurationHolder.config.blockchainIp);
    privateWeb3Con = new Web3(con);
    if (!privateWeb3Con.isConnected()) {
        Logger.info("ethereum private network not connected");
    } else {
        if (typeof privateWeb3Con !== 'undefined') {
            privateWeb3 = new Web3(privateWeb3Con.currentProvider);
            Logger.info("ethereum private network connected1", privateWeb3Con.currentProvider);
            Logger.info('Coinbase accountAddress is : ', privateWeb3.eth.coinbase);
            privateWeb3.personal.unlockAccount(privateWeb3.eth.coinbase, "123456", 0, function(error, result) {
                if (!error) {
                    Logger.info('Coinbase Account unlocking success, will reamin unlocked till geth running ', result);
                } else {
                    Logger.info(' Account unlocking failed', error);
                }
            })
        } else {
            privateWeb3 = new Web3(new Web3.providers.HttpProvider(configurationHolder.config.blockchainIp));
            Logger.info("ethereum private network connected2");
        }
        confirmRequest();
    }
}

function createPerson() {}

function bootApplication() {
    app.listen(configurationHolder.config.port, function() {
        Logger.info("Express server listening on port %d in %s mode", configurationHolder.config.port, app.settings.env);

        var MessageProducer = require('./../application-utilities/MessageProducer.js');
        MessageProducer.init();

    });
}
module.exports.initApp = initApp
