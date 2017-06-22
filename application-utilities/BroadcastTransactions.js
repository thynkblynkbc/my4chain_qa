'use strict';
var fs = require('fs');

var utility = require('../application/controller-service-layer/services/PrivateBlockchain/PrivateEthereumUtilities');

setInterval(function() {
    //  Logger.info(' counter :: ',counter);
    broadcastTransactions();
}, 1000)

setInterval(function() {
    //  Logger.info(' counter :: ',counter);
    getTransactionResults();
}, 2000)


setInterval(function() {
    //  Logger.info(' counter :: ',counter);
    broadcastRetryTransactions();
}, 10000)


var transactionCount = 0;
function getTransactionResults() {

azureQueue.receiveSubscriptionMessage('transaction-result-queue','transactionsresult',(error, receivedMessage) =>
{
  if(!error)
  {

    //console.log(' receveived body ',receivedMessage.body);
    var transactionsResult = JSON.parse(receivedMessage.body);
    transactionsResult = JSON.stringify(transactionsResult);
    transactionCount++;
    fs.appendFile("transactionsResult", transactionCount+'. '+transactionsResult+'\n', function(err) {
        if (err) {
            Logger.info(' error in writing to file ');
            return console.log(err);
        }
        else
        {
          console.log("transactionsResult written to file ");
          azureQueue.deleteMessage(receivedMessage, function(deleteError) {
              if (!deleteError) {
                  // Message deleted
                //  console.log('message has been deleted from user result subscription');
              }
          })
        }
    });
  } else {
    Logger.info('Error in receving message from transaction-result-queue', error);
  }
}
)
}


function broadcastRetryTransactions() {
    azureQueue.receiveSubscriptionMessage('transaction-retry-queue', 'retrytransactions', (error, receivedMessage) => {
        if (!error) {
            var req = {};
            req.body = JSON.parse(receivedMessage.body);

            privateWeb3.eth.getBalance(req.body.fromAddress, function(error, etherBal) {
                if (!error) {
                    var Balance = privateWeb3.fromWei(etherBal.toNumber(), 'ether');

                    var Balance = privateWeb3.fromWei(etherBal.toNumber(), 'ether');
                    Logger.info('balance in fromAccount : ', Balance);

                    if (Balance > 5) {
                        Logger.info('Sufficient balance ');
                        utility.unlockAccount(req.body.fromAddress, req.body.password, 60, (error, result) => {
                            if (error) {
                                Logger.info('Error in unlocking account');
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
                                        utility.saveToTransactionData(result);
                                        var message = {
                                            fileHash: req.body.fileHash,
                                            fromAddress: req.body.fromAddress,
                                            toAddress: req.body.toAddress,
                                            transactionHash: tx_result
                                        }
                                        azureQueue.sendTopicMessage('transaction-result-queue', JSON.stringify(message), (error) => {
                                            if (error) {
                                                Logger.info('error in sending transaction to transaction-result-queue');
                                            } else {
                                                Logger.info('transaction sent to transaction-result-queue');
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
                    } else {

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

                       azureQueue.sendTopicMessage('transaction-retry-queue', JSON.stringify(req.body), (error) => {
                            if (error) {
                                Logger.info('error in sending transaction to transaction-retry-queue');
                            } else {
                                Logger.info('transaction sent to transaction-retry-queue');
                                azureQueue.deleteMessage(receivedMessage, function(deleteError) {
                                    if (!deleteError) {
                                        // Message deleted
                                        console.log('message has been deleted from user retry topic');
                                    }
                                })
                            }
                        })


                    }
                }
            })
        } else {
            Logger.info('Error in receiving transaction from transaction-request-queue', error);
        }
    })
}



function broadcastTransactions() {
    azureQueue.receiveSubscriptionMessage('transaction-request-queue', 'transactions', (error, receivedMessage) => {
        if (!error) {
            var req = {};
            req.body = JSON.parse(receivedMessage.body);

            privateWeb3.eth.getBalance(req.body.fromAddress, function(error, etherBal) {
                if (!error) {
                    var Balance = privateWeb3.fromWei(etherBal.toNumber(), 'ether');

                    var Balance = privateWeb3.fromWei(etherBal.toNumber(), 'ether');
                    Logger.info('balance in fromAccount : ', Balance);

                    if (Balance > 5) {
                        Logger.info('Sufficient balance ');
                        utility.unlockAccount(req.body.fromAddress, req.body.password, 60, (error, result) => {
                            if (error) {
                                Logger.info('Error in unlocking account');
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
                                        utility.saveToTransactionData(result);
                                        var message = {
                                            fileHash: req.body.fileHash,
                                            fromAddress: req.body.fromAddress,
                                            toAddress: req.body.toAddress,
                                            transactionHash: tx_result
                                        }
                                        azureQueue.sendTopicMessage('transaction-result-queue', JSON.stringify(message), (error) => {
                                            if (error) {
                                                Logger.info('error in sending transaction to transaction-result-queue');
                                            } else {
                                                Logger.info('transaction sent to transaction-result-queue');
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
                    } else {

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


                       azureQueue.sendTopicMessage('transaction-retry-queue', JSON.stringify(req.body), (error) => {
                            if (error) {
                                Logger.info('error in sending transaction to transaction-retry-queue');
                            } else {
                                Logger.info('transaction sent to transaction-retry-queue');
                                azureQueue.deleteMessage(receivedMessage, function(deleteError) {
                                    if (!deleteError) {
                                        // Message deleted
                                      //  console.log('message has been deleted from user result subscription');
                                    }
                                })
                            }
                        })
                    }
                }
            })
        } else {
            Logger.info('Error in receiving transaction from transaction-request-queue', error);
        }
    })
}
