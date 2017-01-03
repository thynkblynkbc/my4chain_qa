/*
 * @author Himanshu sharma
 * This program includes all the function which are required to  initialize before the application start
 */

//call all the function which are required to perform the require initialization before server will start
'use strict';
var Person = require('../application/models/PersonDetail');
var initApp = function() {
    Logger.info("config" + configurationHolder.config.accessLevels["anonymous"]);
    startWeb3Ethereum();
    startPrivateWeb3Ethereum();
    // createContractAbi();
    createPerson();
    bootApplication();
}

function createContractAbi() {
    fs.readFile('./solidity/binaryContract.sol', 'utf8', function(err, solidityCode) {
        if (err) {
            console.log("error in reading file: ", err);
            return;
        } else {
            Logger.info("File Path: ", './solidity/binaryContract.sol');
            Logger.info(new Date());
            Logger.info("-----compling solidity code ----------");
            Logger.info(new Date());
            // var compiled = solc.compile(solidityCode, 1).contracts.DieselPrice;
            try {
                var compiled = solc.compile(solidityCode, 1).contracts.documentAccessMapping;
                global.solAbi = JSON.parse(compiled.interface);
                global.solBytecode = compiled.bytecode;
                Logger.info("-----complile complete ----------");
                Logger.info(new Date());
                fs.writeFile('./solidity/abi.json', compiled.interface, (err) => {
                    //Logger.info("err", err);
                    if (err) {
                        console.log("err", err);
                    }

                    if (!err) {
                        fs.writeFile('./solidity/bytecode.txt', solBytecode, (err) => {
                            if (err) {
                                console.log("err", err);
                            } else {
                                bootApplication();
                            }
                        });
                    }
                });
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
    global.privateWeb3 = {};
    //  if (typeof web3 !== 'undefined') {
    //      web3 = new Web3(web3.currentProvider);
    //
    //      // set own provider
    //  } else {
    privateWeb3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8000"));
    // }
    if (!privateWeb3.isConnected()) {
        Logger.info("ethereum private network not connected");
        // show some dialog to ask the user to start a node

    } else {
        Logger.info("ethereum private network connected");
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
// code to start the server
function bootApplication() {
    app.listen(configurationHolder.config.port, function() {
        Logger.info("Express server listening on port %d in %s mode", configurationHolder.config.port, app.settings.env);
    });
}

module.exports.initApp = initApp
