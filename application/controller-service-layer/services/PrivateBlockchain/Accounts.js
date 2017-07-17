'use strict';
var byPassRequest = require('./../../../application-utilities/byPassRequest.js');

class Accounts {
    constructor() {}

    // to create a new account in blockchain
    createAccount(recordObj, res, callback) {
        var resData = {};
        Logger.info("In CreateAccount  controller");
        domain.User.query().where({
            'my4chainId': recordObj.my4chainId
        }).select().then(function(userData) {

            if (userData.length > 0) {
                resData.message = "My4chainId already exists";
                callback(resData, null);
            } else {
                var message = {
                    my4chainId: recordObj.my4chainId,
                    ethPassword: recordObj.ethPassword
                }

                console.log('create account request format before sending to account-create ' + JSON.stringify(message));
                azureQueue.sendTopicMessage('account-create', JSON.stringify(message), (error) => {
                    if (!error) {
                        resData.message = "Message sent to queue";
                        callback(null, resData);
                    } else {
                        Logger.info(' Error in sending to queue ', error);
                        callback(error, null);
                    }
                })
            }
        })
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
                    let response = JSON.parse(body);
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
        var resData = {};

        domain.User.query().where({
                'accountAddress': req.body.fromAddress
            }).select('serverNode')
            .then((userData) => {
              var walletServerNode = userData[0].serverNode;
        if (walletServerNode == currentServerNode) {
            privateWeb3.eth.sendTransaction({
                from: fromAddress,
                to: toAddress,
                value: privateWeb3.toWei(amount, 'ether')
            }, (tx_error, tx_result) => {
                if (!tx_error) {
                    resData.transactionResult = tx_result;
                    callback(null, resData);
                } else {
                    callback(tx_error);
                }
            });
        } else {
            var path = '/api/v1/contract/broadcastTransactions';
            var postData = req.body;
            byPassRequest(walletServerNode, path, postData);
        }
      })


    }





}
module.exports = new Accounts();
