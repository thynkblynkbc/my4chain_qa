'use strict';
var fs = require('fs');
var Stomp = require('stomp-client');
var utility = require('../application/controller-service-layer/services/PrivateBlockchain/PrivateEthereumUtilities');
var stompClient = new Stomp('127.0.0.1', 61613, 'user', 'pw');
var MessageProducer = require('./MessageProducer.js');

stompClient.connect(function(sessionId) {
    console.log('Connected to stompClient with sessionId : ', sessionId);

    if (process.env.NODE_ENV == 'production') {
        stompClient.subscribe('/queue/transaction-retry-queue-prod', function(body, headers) {
            //  Logger.info(' Message receveived from transaction-retry-queue at ' + new Date() + body, headers);
            broadcastRetryTransactions(body);
        })
    } else if (process.env.NODE_ENV == 'development') {
        stompClient.subscribe('/queue/transaction-retry-queue-dev', function(body, headers) {
            //  Logger.info(' Message receveived from transaction-retry-queue at ' + new Date() + body, headers);
            broadcastRetryTransactions(body);
        })
    } else if (process.env.NODE_ENV == 'qa') {
        stompClient.subscribe('/queue/transaction-retry-queue-qa', function(body, headers) {
            //  Logger.info(' Message receveived from transaction-retry-queue at ' + new Date() + body, headers);
            broadcastRetryTransactions(body);
        })
    } else if (process.env.NODE_ENV == 'local') {
        stompClient.subscribe('/queue/transaction-retry-queue-local', function(body, headers) {
            //  Logger.info(' Message receveived from transaction-retry-queue at ' + new Date() + body, headers);
            broadcastRetryTransactions(body);
        })
    }

});

setInterval(function() {
    //  Logger.info(' counter :: ',counter);
    broadcastTransactions();
}, 1000)

 setInterval(function() {
     //  Logger.info(' counter :: ',counter);
     getTransactionResults();
 }, 1000)

var transactionCount = 0;

function broadcastTransactionsRequests(receivedRequest) {
    var req = {};
    req.body = JSON.parse(receivedRequest.body.body);
    // check whether fromAddress has sufficient balance or not
    privateWeb3.eth.getBalance(req.body.fromAddress, function(error, etherBal) {
        if (!error) {
            var Balance = privateWeb3.fromWei(etherBal.toNumber(), 'ether');
            if (Balance > 10) { // if fromAddress has sufficient balance
                Logger.info('Sufficient balance ( ' + Balance + ' ) in fromAddress at starting');
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
                                var topicName;

                                if (process.env.NODE_ENV == 'development') {
                                    topicName = 'transaction-result-queue-dev';
                                } else if (process.env.NODE_ENV == 'production') {
                                    topicName = 'transaction-result-queue-prod';
                                } else if (process.env.NODE_ENV == 'qa') {
                                    topicName = 'transaction-result-queue-qa';
                                } else if (process.env.NODE_ENV == 'local') {
                                    topicName = 'transaction-result-queue-local';
                                }

                                azureQueue.sendTopicMessage(topicName, JSON.stringify(message), (error) => {
                                    if (error) {
                                        Logger.info('Error in sending transaction to transaction-result-queue');
                                    } else {
                                        Logger.info('Transaction sent to transaction-result-queue');
                                        azureQueue.deleteMessage(receivedRequest.body, function(deleteError) {
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
                    value: privateWeb3.toWei(15, 'ether')
                }, (tx_error, tx_result) => {
                    if (!tx_error) {
                        //  Logger.info("Payment of 2 ether to account success ", tx_result);
                    } else {
                        //  Logger.info("Payment of 2 ether to account failed ", tx_error);
                    }
                });

                MessageProducer.sendMessage(JSON.stringify(req.body), 10000, 1235);
                azureQueue.deleteMessage(receivedRequest.body, function(deleteError) {
                    if (!deleteError) {
                        // Message deleted
                        //    console.log('Message has been deleted from transaction-request-queue');
                    }
                })
                // transaction sent to retry ActiveMQ
            }
        }
    })
}

function getTransactionResults() {

    var resultTopicName;
    var txResultSubs;
    if (process.env.NODE_ENV == 'development') {
        resultTopicName = 'transaction-result-queue-dev';
        txResultSubs = 'TransactionsResultDev';
    } else if (process.env.NODE_ENV == 'production') {
        resultTopicName = 'transaction-result-queue-prod';
        txResultSubs = 'TransactionsResultProd';
    } else if (process.env.NODE_ENV == 'qa') {
        resultTopicName = 'transaction-result-queue-qa';
        txResultSubs = 'TransactionsResultQA';
    } else if (process.env.NODE_ENV == 'local') {
        resultTopicName = 'transaction-result-queue-local';
        txResultSubs = 'TransactionsResultLocal';
    }

    azureQueue.receiveSubscriptionMessage(resultTopicName, txResultSubs, (error, receivedMessage) => {
        if (!error) {
            console.log(' receveived body ', receivedMessage.body);
            var transactionsResult = JSON.parse(receivedMessage.body);
            transactionsResult = JSON.stringify(transactionsResult);
            transactionCount++;
            fs.appendFile("transactionsResult", transactionCount + '. ' + transactionsResult +' transactionEnqueueTime '+receivedMessage.brokerProperties.EnqueuedTimeUtc+ '\n', function(err) {
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
            //  Logger.info('Balance in fromAddress : ', Balance, ' ether');
            if (Balance > 10) {
                Logger.info('Balance ' + Balance + ' Ether is sufficient now');
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

                                var txResultTopic;
                                if (process.env.NODE_ENV == 'development') {
                                    txResultTopic = 'transaction-result-queue-dev';
                                } else if (process.env.NODE_ENV == 'production') {
                                    txResultTopic = 'transaction-result-queue-prod';
                                } else if (process.env.NODE_ENV == 'qa') {
                                    txResultTopic = 'transaction-result-queue-qa';
                                } else if (process.env.NODE_ENV == 'local') {
                                    txResultTopic = 'transaction-result-queue-local';
                                }
                                azureQueue.sendTopicMessage(txResultTopic, JSON.stringify(message), (error) => {
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
                    value: privateWeb3.toWei(15, 'ether')
                }, (tx_error, tx_result) => {
                    if (!tx_error) {
                        //  Logger.info("Payment of 2 ether to account success ", tx_result);
                    } else {
                        //    Logger.info("Payment of 2 ether to account failed ", tx_error);
                    }
                });
                MessageProducer.sendMessage(JSON.stringify(req.body), 10000, 1235);
            }
        }
    })
}

function broadcastTransactions() {
    //azureQueue.receiveSubscriptionMessage('transaction-request-test-queue', 'transactions-test', (error, receivedMessage) => {

    var txRequestTopic;
    var txRequestSubs;
    if (process.env.NODE_ENV == 'development') {
        txRequestTopic = 'transaction-request-queue-dev';
        txRequestSubs = 'TransactionsDev';
    } else if (process.env.NODE_ENV == 'production') {
        txRequestTopic = 'transaction-request-queue-prod';
        txRequestSubs = 'TransactionsProd';
    } else if (process.env.NODE_ENV == 'qa') {
        txRequestTopic = 'transaction-request-queue-qa';
        txRequestSubs = 'TransactionsQA';
    }
    if (process.env.NODE_ENV == 'local') {
        txRequestTopic = 'transaction-request-queue-local';
        txRequestSubs = 'TransactionsLocal';
    }

    azureQueue.receiveSubscriptionMessage(txRequestTopic, txRequestSubs, (error, receivedMessage) => {
        if (!error) {
            //  Logger.info('Message received from transaction-request-queue', receivedMessage);
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
                                //    Logger.info('balance in fromAccount : ', Balance);
                                if (Balance > 10) { // if fromAddress has sufficient balance
                                    Logger.info('Sufficient balance',Balance,' Ether in fromAddress at starting');
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

                                                    var txResultTopic1;
                                                    if (process.env.NODE_ENV == 'development') {
                                                        txResultTopic1 = 'transaction-result-queue-dev';
                                                    } else if (process.env.NODE_ENV == 'production') {
                                                        txResultTopic1 = 'transaction-result-queue-prod';
                                                    } else if (process.env.NODE_ENV == 'qa') {
                                                        txResultTopic1 = 'transaction-result-queue-qa';
                                                    } else if (process.env.NODE_ENV == 'local') {
                                                        txResultTopic1 = 'transaction-result-queue-local';
                                                    }
                                                    azureQueue.sendTopicMessage(txResultTopic1, JSON.stringify(message), (error) => {
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
                                        value: privateWeb3.toWei(15, 'ether')
                                    }, (tx_error, tx_result) => {
                                        if (!tx_error) {
                                            //    Logger.info("Payment of 2 ether to account success ", tx_result);
                                        } else {
                                            //    Logger.info("Payment of 2 ether to account failed ", tx_error);
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

                        var hostname = gethost();

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

                        var portVM;
                        if (process.env.NODE_ENV == 'qa') {
                            portVM = 3002;
                        } else {
                            portVM = 3000;
                        }

                        const options = {
                            hostname: hostname,
                            port: portVM,
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
                                //  console.log('No more data in response.');
                            });
                        });
                        req.on('error', (e) => {
                            //  console.error('problem with request:', e);
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
