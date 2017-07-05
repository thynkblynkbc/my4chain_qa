'use strict';
var fs = require('fs');
var Stomp = require('stomp-client');
var utility = require('../application/controller-service-layer/services/PrivateBlockchain/PrivateEthereumUtilities');
var stompClient = new Stomp('127.0.0.1', 61613, 'user', 'pw');
var MessageProducer = require('./MessageProducer.js');

stompClient.connect(function(sessionId) {
    console.log('Connected to stompClient with sessionId : ', sessionId);
    stompClient.subscribe('/queue/transaction-retry-queue', function(body, headers) {
        Logger.info(' Message receveived from transaction-retry-queue at ' + new Date() + body, headers);
        broadcastRetryTransactions(body);
    })
});

setInterval(function() {
    //  Logger.info(' counter :: ',counter);
    broadcastTransactions();
}, 1000)

// setInterval(function() {
//     //  Logger.info(' counter :: ',counter);
//     getTransactionResults();
// }, 200)

var transactionCount = 0;

function broadcastTransactionsRequests(receivedRequest) {

    Logger.info('Trnasaction Request received from other server', receivedRequest.body);
    var req = {};
    req.body = JSON.parse(receivedRequest.body.body);

    // check whether fromAddress has sufficient balance or not
    privateWeb3.eth.getBalance(req.body.fromAddress, function(error, etherBal) {
        if (!error) {
            var Balance = privateWeb3.fromWei(etherBal.toNumber(), 'ether');
            Logger.info('balance in fromAccount : ', Balance);
            if (Balance > 5) { // if fromAddress has sufficient balance
                Logger.info('Sufficient balance in fromAddress at starting');
                utility.unlockAccount(req.body.fromAddress, req.body.password, 60, (error, result) => {
                    if (error) {
                        Logger.info('Error in unlocking account', error);
                    } else {
                        privateWeb3.eth.sendTransaction({
                            from: req.body.fromAddress,
                            to: req.body.toAddress,
                            //  value: privateWeb3.toWei(1, 'ether'),
                            data: privateWeb3.fromAscii(req.body.fileHash) // req.body.data
                        }, (tx_error, tx_result) => {
                            if (!tx_error) {
                                let result = {};
                                result.senderAddress = req.body.fromAddress;
                                result.reciverAddress = req.body.toAddress;
                                result.transactionHash = tx_result;
                                result.data = req.body.fileHash;
                                result.transactionId = req.body.transactionId;
                                utility.saveToTransactionData(result);

                                var message = {
                                    fileHash: req.body.fileHash,
                                    fromAddress: req.body.fromAddress,
                                    toAddress: req.body.toAddress,
                                    transactionHash: tx_result,
                                    transactionId: req.body.transactionId
                                }

                                azureQueue.sendTopicMessage('transaction-result-queue', JSON.stringify(message), (error) => {
                                    if (error) {
                                        Logger.info('Error in sending transaction to transaction-result-queue');
                                    } else {
                                        Logger.info('Transaction sent to transaction-result-queue');
                                        azureQueue.deleteMessage(receivedRequest.body, function(deleteError) {
                                            if (!deleteError) {
                                                // Message deleted
                                                  console.log('message has been deleted from user result subscription');
                                            }
                                        })
                                    }
                                })
                            } else {
                                Logger.info(' Error in saving transaction into DB');
                            }
                        });
                    }
                });
            } else { // if fromAddress doesn't have sufficient balance

                Logger.info('Balance in fromAccount (', Balance, ' ether) not sufficient, so sending this transaction to transaction-retry-queue ActiveMQ');
                privateWeb3.eth.sendTransaction({
                    from: privateWeb3.eth.coinbase,
                    to: req.body.fromAddress,
                    value: privateWeb3.toWei(2, 'ether')
                }, (tx_error, tx_result) => {
                    if (!tx_error) {
                        Logger.info("Payment of 2 ether to account success ", tx_result);
                    } else {
                        Logger.info("Payment of 2 ether to account failed ", tx_error);
                    }
                });

                MessageProducer.sendMessage(JSON.stringify(req.body), 10000, 1235);
                azureQueue.deleteMessage(receivedRequest.body, function(deleteError) {
                    if (!deleteError) {
                        // Message deleted
                        console.log('Message has been deleted from transaction-request-queue');
                    }
                })
                // transaction sent to retry ActiveMQ
            }
        }
    })
}

function getTransactionResults() {
    azureQueue.receiveSubscriptionMessage('transaction-result-queue', 'transactionsresult', (error, receivedMessage) => {
        if (!error) {
            console.log(' receveived body ', receivedMessage.body);
            var transactionsResult = JSON.parse(receivedMessage.body);
            transactionsResult = JSON.stringify(transactionsResult);
            transactionCount++;
            fs.appendFile("transactionsResult", transactionCount + '. ' + transactionsResult + '\n', function(err) {
                if (err) {
                    Logger.info('Error in writing to file ');
                    return console.log(err);
                } else {
                    console.log("TransactionsResult written to file ");
                    azureQueue.deleteMessage(receivedMessage, function(deleteError) {
                        if (!deleteError) {
                            // Message deleted
                            //  console.log('message has been deleted from user result subscription');
                        }
                    })
                }
            });
        } else {
            //  Logger.info('Error in receving message from transaction-result-queue', error);
        }
    })
}

function broadcastRetryTransactions(receivedMessage) {
    var req = {};
    req.body = JSON.parse(receivedMessage);
    privateWeb3.eth.getBalance(req.body.fromAddress, function(error, etherBal) {
        if (!error) {
            var Balance = privateWeb3.fromWei(etherBal.toNumber(), 'ether');
            Logger.info('Balance in fromAddress : ', Balance, ' ether');
            if (Balance > 5) {
                Logger.info('Balance is sufficient now');
                utility.unlockAccount(req.body.fromAddress, req.body.password, 60, (error, result) => {
                    if (error) {

                        Logger.info('Error in unlocking account', error);
                    } else {
                        privateWeb3.eth.sendTransaction({
                            from: req.body.fromAddress,
                            to: req.body.toAddress,
                            //  value: privateWeb3.toWei(1, 'ether'),
                            data: privateWeb3.fromAscii(req.body.fileHash) // req.body.data
                        }, (tx_error, tx_result) => {
                            if (!tx_error) {
                                let result = {};
                                result.senderAddress = req.body.fromAddress;
                                result.reciverAddress = req.body.toAddress;
                                result.transactionHash = tx_result;
                                result.data = req.body.fileHash;
                                result.transactionId = req.body.transactionId;
                                utility.saveToTransactionData(result);
                                var message = {
                                    fileHash: req.body.fileHash,
                                    fromAddress: req.body.fromAddress,
                                    toAddress: req.body.toAddress,
                                    transactionHash: tx_result,
                                    transactionId: req.body.transactionId
                                }

                                azureQueue.sendTopicMessage('transaction-result-queue', JSON.stringify(message), (error) => {
                                    if (error) {
                                        Logger.info('Error in sending transaction to transaction-result-queue');
                                    } else {
                                        Logger.info('Transaction sent to transaction-result-queue');
                                    }
                                })
                            } else {
                                Logger.info('Error in saving transaction into DB');
                            }
                        });
                    }
                });
            } else {
                Logger.info('Balance in fromAddress (', Balance, ' ether) is still not sufficient, so again sending to retry queue');
                privateWeb3.eth.sendTransaction({
                    from: privateWeb3.eth.coinbase,
                    to: req.body.fromAddress,
                    value: privateWeb3.toWei(2, 'ether')
                }, (tx_error, tx_result) => {
                    if (!tx_error) {
                        Logger.info("Payment of 2 ether to account success ", tx_result);
                    } else {
                        Logger.info("Payment of 2 ether to account failed ", tx_error);
                    }
                });
                MessageProducer.sendMessage(JSON.stringify(req.body), 10000, 1235);
            }
        }
    })
}

function broadcastTransactions() {
    //azureQueue.receiveSubscriptionMessage('transaction-request-test-queue', 'transactions-test', (error, receivedMessage) => {
      azureQueue.receiveSubscriptionMessage('transaction-request-queue', 'transactions', (error, receivedMessage) => {
        if (!error) {
            Logger.info('Message received from transaction-request-queue', receivedMessage);
            var req = {};
            req.body = JSON.parse(receivedMessage.body);
            domain.User.query().where({
                    'accountAddress': req.body.fromAddress
                }).select('serverNode')
                .then((userData) => {
                    console.log(' server node -- ', JSON.stringify(userData, null, 2));
                    var serverNode = userData[0].serverNode;
                    var request = {};
                    request.body = req.body;

                    if (serverNode == currentServerNode) {

                        // check whether fromAddress has sufficient balance or not
                        privateWeb3.eth.getBalance(req.body.fromAddress, function(error, etherBal) {
                            if (!error) {
                                var Balance = privateWeb3.fromWei(etherBal.toNumber(), 'ether');
                                Logger.info('balance in fromAccount : ', Balance);
                                if (Balance > 5) { // if fromAddress has sufficient balance
                                    Logger.info('Sufficient balance in fromAddress at starting');
                                    utility.unlockAccount(req.body.fromAddress, req.body.password, 60, (error, result) => {
                                        if (error) {
                                            Logger.info('Error in unlocking account', error);
                                        } else {
                                            privateWeb3.eth.sendTransaction({
                                                from: req.body.fromAddress,
                                                to: req.body.toAddress,
                                                //  value: privateWeb3.toWei(1, 'ether'),
                                                data: privateWeb3.fromAscii(req.body.fileHash) // req.body.data
                                            }, (tx_error, tx_result) => {
                                                if (!tx_error) {
                                                    let result = {};
                                                    result.senderAddress = req.body.fromAddress;
                                                    result.reciverAddress = req.body.toAddress;
                                                    result.transactionHash = tx_result;
                                                    result.data = req.body.fileHash;
                                                    result.transactionId = req.body.transactionId;
                                                    utility.saveToTransactionData(result);

                                                    var message = {
                                                        fileHash: req.body.fileHash,
                                                        fromAddress: req.body.fromAddress,
                                                        toAddress: req.body.toAddress,
                                                        transactionHash: tx_result,
                                                        transactionId: req.body.transactionId
                                                    }

                                                    azureQueue.sendTopicMessage('transaction-result-queue', JSON.stringify(message), (error) => {
                                                        if (error) {
                                                            Logger.info('Error in sending transaction to transaction-result-queue');
                                                        } else {
                                                            Logger.info('Transaction sent to transaction-result-queue');
                                                            azureQueue.deleteMessage(receivedMessage, function(deleteError) {
                                                                if (!deleteError) {
                                                                    // Message deleted
                                                                    //  console.log('message has been deleted from user result subscription');
                                                                }
                                                            })
                                                        }
                                                    })
                                                } else {
                                                    Logger.info(' Error in saving transaction into DB');
                                                }
                                            });
                                        }
                                    });
                                } else { // if fromAddress doesn't have sufficient balance

                                    Logger.info('Balance in fromAccount (', Balance, ' ether) not sufficient, so sending this transaction to transaction-retry-queue ActiveMQ');
                                    privateWeb3.eth.sendTransaction({
                                        from: privateWeb3.eth.coinbase,
                                        to: req.body.fromAddress,
                                        value: privateWeb3.toWei(2, 'ether')
                                    }, (tx_error, tx_result) => {
                                        if (!tx_error) {
                                            Logger.info("Payment of 2 ether to account success ", tx_result);
                                        } else {
                                            Logger.info("Payment of 2 ether to account failed ", tx_error);
                                        }
                                    });

                                    MessageProducer.sendMessage(JSON.stringify(req.body), 10000, 1235);
                                    azureQueue.deleteMessage(receivedMessage, function(deleteError) {
                                        if (!deleteError) {
                                            // Message deleted
                                            console.log('Message has been deleted from transaction-request-queue');
                                        }
                                    })
                                    // transaction sent to retry ActiveMQ
                                }
                            }
                        })
                    } else {
                        Logger.info(' in else block ');

                        var http = require('http');
                        var querystring = require('querystring');
                        const postData = querystring.stringify(receivedMessage);

                        var hostname = gethost()

                        function gethost() {
                            switch (serverNode) {
                                case 'blkchain_server1':
                                    return '10.0.0.4';
                                    break;
                                case 'blkchain_server2':
                                    return '10.0.0.5';
                                    break;
                                case 'blkchain_server3':
                                    return '10.0.1.4';
                                    break;
                                case 'blkchain_server4':
                                    return '10.0.2.4';
                                    break;
                                default:
                                    return 'localhost';
                            }
                        }

                        const options = {
                            hostname: hostname,
                            port: 3000,
                            path: '/api/v1/contract/broadcastTransactions',
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                                'Content-Length': Buffer.byteLength(postData)
                            }
                        };
                        const req = http.request(options, (res) => {
                            res.setEncoding('utf8');
                            res.on('data', (chunk) => {
                                console.log('body ', chunk);
                            });
                            res.on('end', () => {
                                console.log('No more data in response.');
                            });
                        });
                        req.on('error', (e) => {
                            console.error('problem with request:', e);
                        });
                        // write data to request body
                        req.write(postData);
                        req.end()
                    }

                })





        } else {
            //Logger.info('Error in receiving transaction from transaction-request-queue', error);
        }
    })
}


module.exports = broadcastTransactionsRequests;
