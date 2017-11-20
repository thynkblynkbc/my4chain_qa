'use strict';
var Joi = require('joi');
var byPassRequest = require('./../../../../application-utilities/ByPassRequests.js');
class Accounts {
    constructor() {}
    // to create a new account in blockchain
    createAccount(recordObj, res, callback) {
        var resData = {};
        var accountCreateTopic;
        var valMy4chainId = recordObj.my4chainId;
        var valEthPassword = recordObj.ethPassword;
        var valApiTimestamp = recordObj.apiTimestamp;
        const schema = {
          my4chainId: Joi.number().required(),
          ethPassword: Joi.string().guid().required(),
          apiTimestamp: Joi.date().required(),
        }
        Logger.info("---- starting Schema validation -----");

        Joi.validate(recordObj, schema, function (err, value) {
          if(!err)
          {
            Logger.info("---- Schema Verified Successfully -----");

            if (process.env.NODE_ENV == 'development') {
                accountCreateTopic = 'account-create-dev';
            } else if (process.env.NODE_ENV == 'production') {
                accountCreateTopic = 'account-create-prod';
            } else if (process.env.NODE_ENV == 'qa') {
                accountCreateTopic = 'account-create-qa';
            } else if (process.env.NODE_ENV == 'local') {
                accountCreateTopic = 'account-create-local';
            }
            // valEthPassword
            Logger.info("In CreateAccount  controller");
            domain.User.query().where({
                'my4chainId': recordObj.my4chainId
            }).select().then(function(userData) {
                if (userData.length > 0) {
                    resData.message = "My4chainId already exists";
                    callback(resData, null);
                } else {
                    var message = {
                        my4chainId: valMy4chainId,
                        ethPassword: valEthPassword,
                        apiTimestamp : valApiTimestamp
                    }

                    console.log('create account request format before sending to account-create ' + JSON.stringify(message));
                    azureQueue.sendTopicMessage(accountCreateTopic, JSON.stringify(message), (error) => {
                        if (!error) {
                            Logger.info('Message sent to ' + accountCreateTopic + ' topic');
                            resData.message = "Message sent to  request queue";
                            callback(null, resData);
                        } else {
                            Logger.info(' Error in sending to queue ', error);
                            callback(error, null);
                        }
                    })
                }
            }).catch(error => {

              //var errorStr = {"message":{"\"my4chainId\":\"bigint\",\"ethPassword\":\"sting(255)\",\"apiTimestamp\":\"2017-11-16 18:32:32\""}};
              var errorStr ={"message":"ERROR in request. Please send the data in format {\"my4chainId\" :\"bigint\",\"ethPassword\":\"GUID\",\"apiTimestamp\":\"2017-11-16 18:32:32\""};
              console.log("ERROR in request. Please send the data in format "+errorStr);
              //errorStr.message = 'heloo error';
              //errorStr.errors = 'extendedMessage heloo error';
              callback(errorStr);
            })

          }else {
            Logger.info("Schema validation Failed");
            callback(err);
          }


        });






    }
    // to create a new account in blockchain
    createimportAccount(recordObj, res, callback) {
        var resData = {};
        var http = require('http');
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
        Logger.info('I am in sendEhter method');
        privateWeb3.personal.unlockAccount(req.body.fromAddress, password, 0, function(error, result1) {
            domain.User.query().where({
                    'accountAddress': req.body.fromAddress
                }).select('serverNode')
                .then((userData) => {
                    Logger.info('User data from db - ', userData);
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
                        Logger.info('I am in else block of sendEther');
                        var path = '/api/v1/contract/sendether/123';
                        var postData = req.body;
                        byPassRequest(walletServerNode, path, postData, (response) => {
                            if (!response.error) {
                                resData.transactionResult = response.object.transactionResult;
                                callback(null, resData);
                            } else {
                                callback(response.object.message);
                            }
                        });
                    }
                })
        })
    }
}
module.exports = new Accounts();
