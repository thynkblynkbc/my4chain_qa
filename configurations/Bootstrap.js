/*
 * @author Himanshu sharma
 * This program includes all the function which are required to  initialize before the application start
 */

//call all the function which are required to perform the require initialization before server will start
'use strict';
var Person = require('../application/models/PersonDetail');
var ConfirmationOfRequest = require('../application-utilities/cron/ConfirmationOfRequest');
var getContractAddress = require('../application-utilities/cron/GetContractAddress');
var publishData = require('../application-utilities/cron/PromisePublishContractData');
var createUnlockAccount = require('../application-utilities/cron/CreateUnlockAccount');
//  publishData=Promise.promisify(publishData);
var initApp = function() {

    Logger.info("config" + configurationHolder.config.accessLevels["anonymous"]);
    //  startWeb3Ethereum();
    startPrivateWeb3Ethereum();
    createContractAbi();
    createPerson();
    createUnlockAccount.excuteFunction(); 

    //   bootApplication();
    //  confirmRequestCRON.

}

function confirmRequest() {

    var cron = require('node-cron');
    console.log("Cron function call")
        //  publishData.callFunction();
            cron.schedule('*/40 * * * * *', function(){
        //  ConfirmationOfRequest.confirmRequestCRON();
        //  //publishData.callFunction();
        // console.log('running every second to 10');
        // // console.log(new Date());
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
            // var compiled = solc.compile(solidityCode, 1).contracts.DieselPrice;
            try {
                var compiled = solc.compile(solidityCode, 1);
	
//         console.log(compiled.contracts["documentAccessMapping"])
                global.solAbi = JSON.parse(compiled.contracts["documentAccessMapping"].interface);
                global.solBytecode = compiled.contracts["documentAccessMapping"].bytecode;
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
    //  if (typeof web3 !== 'undefined') {
    //      web3 = new Web3(web3.currentProvider);
    //
    //      // set own provider
    //  } else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
    // }
    if (!web3.isConnected()) {
        Logger.info("ethereum public testnet not connected");
        // show some dialog to ask the user to start a node

    } else {
        Logger.info("ethereum public testnet connected");
        // start web3 filters, calls, etc

    }
}

function startPrivateWeb3Ethereum() {
    var Web3 = require('web3');
    var privateWeb3Con = {};
    global.privateWeb3 = {};
    //  if (typeof web3 !== 'undefined') {
    //      web3 = new Web3(web3.currentProvider);
    //
    //      // set own provider
    //  } else {

    var con = new Web3.providers.HttpProvider(configurationHolder.config.blockchainIp);

    privateWeb3Con = new Web3(con);
    // }
    if (!privateWeb3Con.isConnected()) {
        Logger.info("ethereum private network not connected");
        // show some dialog to ask the user to start a node

    } else {
        //  confirmRequest();

        if (typeof privateWeb3Con !== 'undefined') {

            privateWeb3 = new Web3(privateWeb3Con.currentProvider);
                Logger.info("ethereum private network connected1",privateWeb3Con.currentProvider);
        } else {
            // set the provider you want from Web3.providers
            privateWeb3 = new Web3(new Web3.providers.HttpProvider(configurationHolder.config.blockchainIp));
                Logger.info("ethereum private network connected2");
        }
        confirmRequest();
        // start web3 filters, calls, etc

    }
}

function createPerson() {

    //let coinbase = web3.
    //domain.Person.query().insert({firstName: 'Sylvester',lastName:"himasnhu"}).then(function (data) {Logger.info("data",data);});
    // domain.Person
    //     .query()
    //   //  .insertAndFetch()
    //     .then(function (person) {})
    //  .catch(next);
}

function bootApplication() {
    app.listen(configurationHolder.config.port, function() {
        Logger.info("Express server listening on port %d in %s mode", configurationHolder.config.port, app.settings.env);
    });
}

module.exports.initApp = initApp
