'use strict';
var fs = require('fs');
var os = require('os');
var ifaces = os.networkInterfaces();

// azureQueue.deleteTopic('transaction-request-queue');
// azureQueue.deleteTopic('transaction-retry-queue');
// azureQueue.deleteTopic('transaction-result-queue');
//azureQueue.listTopics();


var counter = 0;
setInterval(function() {
    counter++;
    //  Logger.info(' counter :: ',counter);
    createUsersFromqueue();
}, 10)


// setInterval(function() {
//     counter++;
//     //  Logger.info(' counter :: ',counter);
//     getUsersResultFromqueue();
// }, 10)

var serverip = ifaces.eth0[0].address;

var serverNode = getserverNode();


function getserverNode() {
    switch (serverip) {
        case '10.0.0.4':
            return '1';
            break;
        case '10.0.0.5':
            return '2';
            break;
        case '33':
            return '3';
            break;
        case '44':
            return '4';
            break;
        default:
            return 'None';
    }
}

var userCount = 0;

function getUsersResultFromqueue() {

    azureQueue.receiveSubscriptionMessage('account-result', 'result', (error, receivedMessage) => {
        if (error) {
            //    Logger.info('Error in receiving message from account-result', error);
        } else {
            //  Logger.info('Message received from users result queue ', receivedMessage);
            var resultObj = JSON.parse(receivedMessage.body);
            resultObj = JSON.stringify(resultObj);

            //  console.log(' result obj '+JSON.stringify(resultObj,null,2));
            userCount++;
            fs.appendFile("CreateAccountResult", userCount + '. ' + resultObj +'  timestamp - '+new Date()+'\n', function(err) {
                if (err) {
                    Logger.info(' error in writing to file ');
                    return console.log(err);
                } else {
                    console.log("CreateAccount result written to file");
                    azureQueue.deleteMessage(receivedMessage, function(deleteError) {
                        if (!deleteError) {
                            // Message deleted
                            //  console.log('message has been deleted from user result subscription');
                        }
                    })
                }
            });
        }
    })
}


function createUsersFromqueue() {
    azureQueue.receiveSubscriptionMessage('account-create', 'users', (error, receivedMessage) => {
        if (error) {
            //    Logger.info('Error in receiving message from TopicCreateAccount to create users ', error);
        } else {
                Logger.info(' Message received from queue to create user account ', receivedMessage);
            var recordObj1 = JSON.parse(receivedMessage.body);

            //    Logger.info(' recordObj1 -- ',recordObj1);

            privateWeb3.personal.newAccount(recordObj1.ethPassword, function(error, result) {
                if (!error) {
                    domain.User.query().insert({
                        my4chainId: recordObj1.my4chainId,
                        ethPassword: recordObj1.ethPassword,
                        serverNode: serverNode,
                        accountAddress: result
                    }).then(function(data) {
                        Logger.info('Account Successfully created and saved in database ');
                        var message = {
                            my4chainId: recordObj1.my4chainId,
                            accountAddress: result
                        }

                        console.log(' stringified - ' + JSON.stringify(message));
                        azureQueue.sendTopicMessage('account-result', JSON.stringify(message), (error) => {
                            if (!error) {
                                Logger.info('Message sent to result queue');
                                azureQueue.deleteMessage(receivedMessage, function(deleteError) {
                                    if (!deleteError) {
                                        // Message deleted
                                        console.log('Message has been deleted from account-create queue ');
                                    }
                                })
                            } else {
                                Logger.info('Error in sending to result queue ', error);
                            }
                        })
                    });

                    privateWeb3.personal.unlockAccount(result, recordObj1.ethPassword, 0, function(error, result1) {
                        if (!error) {
                            Logger.info('New account ', result, ' unlocking success, will reamin unlocked till geth running ', result1);
                        } else {
                            Logger.info('New account unlocking failed', error);
                        }
                    })
                    
                    privateWeb3.eth.sendTransaction({
                        from: privateWeb3.eth.coinbase,
                        to: result,
                        value: privateWeb3.toWei(2, 'ether')
                    }, (tx_error, tx_result) => {
                        if (!tx_error) {
                            Logger.info("Payment of 2 ether to account success ", tx_result);
                        } else {
                            Logger.info("Payment of 2 ether to account failed ", tx_error);
                        }
                    });

                } else {
                    Logger.info(' error ', error);
                }
            });
        }
    })
}
