'use strict';

class Accounts {

    constructor() {

    }

    // to create a new account in blockchain
    createAccount(recordObj, res, callback) {
            var resData = {};
            //	Logger.info("privateWeb3.personal",privateWeb3.personal.newAccount);
            Logger.info("In CreateAccount  controller");

            privateWeb3.personal.newAccount(recordObj.ethPassword, function(error, result) {
                if (!error) {
                    domain.User.query().insert({
                        email: recordObj.email,
                        ethPassword: recordObj.ethPassword,
                        accountAddress: result
                    }).then(function(data) {
                        console.log("Inserted data: ", data);
                        var databaseReturn = data;
                        resData.address = result;
                        resData.message = "Successfully account created"
                        callback(null, resData);
                    });
                    privateWeb3.eth.sendTransaction({
                        from: privateWeb3.eth.coinbase,
                        to: result,
                        value: privateWeb3.toWei(40, 'ether') 
                    }, (tx_error, tx_result) => {
                        if (!tx_error) {
                          Logger.info("Payment of 30 ether to other account",result,"  ",tx_result);
                          //  resData.transactionResult = tx_result;
                            //    this.storeRequestConfirmation(requestid,tx_result);
                        //    callback(null, resData);
                        } else {
                          Logger.info("Payment of 30 ether to other account for account",result);
                        //    callback(tx_error);
                        }
                    });
                    // var resData = {};
                    // resData.key = "password";
                    // resData.address = result;
                    // callback(null, resData);
                } else {
                    console.log("error", error);
                    resData = new Error(configurationHolder.errorMessage.blockchainIssue);
                    resData.status = 500;
                    callback(resData, null);
                }
            });
        }
        // to create a new account in blockchain
    createimportAccount(recordObj, res, callback) {
        var resData = {};
        var http = require('http');
        //	Logger.info("privateWeb3.personal",privateWeb3.personal.newAccount);
        Logger.info("In CreateAccount  controller");
        var crypto = require('crypto')
        var privateKey;
        require('crypto').randomBytes(32, function(err, buffer) {
            privateKey = buffer.toString('hex');

            //  var privateKey = crypto.randomBytes(32)
            var headers = {

                'Content-Type': 'application/json'
            }

            var options = {
                url: "http://localhost:8000",
                method: 'POST',
                headers: headers
            }

            var req = http.request(options, function(res) {
                console.log('Status: ' + res.statusCode);
                console.log('Headers: ' + JSON.stringify(res.headers));
                res.setEncoding('utf8');
                res.on('data', function(body) {
                    console.log('Body: ' + body);
                    let response =JSON.parse(body);
                    domain.User.query().insert({
                        email: recordObj.email,
                        ethPassword: recordObj.ethPassword,
                        accountAddress: response.result,
                        privateKey: privateKey
                    }).then(function(data) {
                        console.log("Inserted data: ", data);
                        var databaseReturn = data;
                        resData.address = body;
                        resData.message = "Successfully account created"
                        callback(null, resData);
                    });
                });
            });
            req.on('error', function(e) {
                callback(e, null);
                console.log('problem with request: ' + e.message);
            });
            // write data to request body
            let writeData = '{"jsonrpc": "2.0","method": "personal_importRawKey",  "params": ["' + privateKey + '","' + recordObj.ethPassword + '"],"id": 1  }';
            console.log(privateKey + " " + writeData)
            req.write(writeData);
            req.end();
        });
    }


        //  send ether to other account
    privateSendether(req, res, callback) {
        var reqData = req.body;
        var requestid = req.params.requestid;
        var fromAddress = reqData.fromAddress;
        var toAddress = reqData.toAddress;
        var password = reqData.password;
        var amount = reqData.amount;
        var data = reqData.data;
        var duration = 30;
        var resData = {};
        Logger.info("gas needed");
        Logger.info("Amount sent-->", privateWeb3.toWei(1, 'ether'));

        privateWeb3.eth.sendTransaction({
            from: fromAddress,
            to: toAddress,
            value: privateWeb3.toWei(amount, 'ether')
        }, (tx_error, tx_result) => {
            if (!tx_error) {
                resData.transactionResult = tx_result;
                //    this.storeRequestConfirmation(requestid,tx_result);
                callback(null, resData);
            } else {
                callback(tx_error);
            }
        });

        //     } else {
        //         callback(error);
        //     }
        // });
    }

}
module.exports = new Accounts();
