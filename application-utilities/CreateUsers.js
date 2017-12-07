'use strict';
var fs = require('fs');
var os = require('os');
var Joi = require('joi');
var util = require('util');
var ifaces = os.networkInterfaces();


// azureQueue.deleteTopic('transaction-request-queue');
// azureQueue.deleteTopic('transaction-retry-queue');
// azureQueue.deleteTopic('transaction-result-queue');
// azureQueue.listTopics();

var counter = 0;
setInterval(function() {
    counter++;
    createUsersFromqueue();
}, 1000);

// setInterval(function() {
//     getUsersResultFromqueue();
// }, 1000);


  var accountResultTopic;
  var accountResultSub;
  if (process.env.NODE_ENV == 'development') {
      accountResultTopic = 'account-result-dev';
      accountResultSub = 'AccountResultDev';
  } else if (process.env.NODE_ENV == 'production') {
      accountResultTopic = 'account-result-prod';
      accountResultSub = 'AccountResultProd';
  } else if (process.env.NODE_ENV == 'qa') {
      accountResultTopic = 'account-result-qa';
      accountResultSub = 'AccountResultQA';
  } else if (process.env.NODE_ENV == 'local') {
      accountResultTopic = 'account-result-local';
      accountResultSub = 'AccountResultLocal';
  }

var serverip = ifaces.eth0[0].address;

var serverNode = getserverNode();
    global.currentServerNode = serverNode;

function getserverNode() {
    switch (serverip) {
        case '10.0.0.4':
            return 'blkchain_server1';
            break;
        case '10.0.0.5':
            return 'blkchain_server2';
            break;
        case '10.0.1.4':
            return 'blkchain_server3';
            break;
        case '10.0.2.4':
            return 'blkchain_server4';
            break;
        default:
            return 'blkchain_local';
    }
}

var userCount = 0;
/*
function getUsersResultFromqueue() {

    azureQueue.receiveSubscriptionMessage(accountResultTopic, accountResultSub, (error, receivedMessage) => {
        if (error) {
            //    Logger.info('Error in receiving message from account-result', error);
        } else {
              Logger.info('Message received from users result queue ', receivedMessage);
            var resultObj = JSON.parse(receivedMessage.body);
            resultObj = JSON.stringify(resultObj);

            //  console.log(' result obj '+JSON.stringify(resultObj,null,2));
            userCount++;
            fs.appendFile("CreateAccountResult", userCount + '. ' + resultObj +'  reqEnqueueTime - '+receivedMessage.brokerProperties.EnqueuedTimeUtc+'\n', function(err) {
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
*/
function createUsersFromqueue() {
  var newDate = new Date();
  var year = newDate.getFullYear();
  var month = newDate.getMonth()+1;
  var day = newDate.getDate();
  var ErrorLogfileName = "CreateAccountFailureLog_" + day +"_"+month+"_"+year+".log";
  var SuccessLogfileName = "CreateAccountSuccessLog_" + day +"_"+month+"_"+year+".log";

  var accountCreateTopic;
  var accountCreateSub;
  var resData = {};
  if (process.env.NODE_ENV == 'development') {
      accountCreateTopic = 'account-create-dev';
      accountCreateSub = 'UsersDev';
  } else if (process.env.NODE_ENV == 'production') {
      accountCreateTopic = 'account-create-prod';
      accountCreateSub = 'UsersProd';
  } else if (process.env.NODE_ENV == 'qa') {
      accountCreateTopic = 'account-create-qa';
      accountCreateSub = 'UsersQA';
  } else if (process.env.NODE_ENV == 'local') {
      accountCreateTopic = 'account-create-local';
      accountCreateSub = 'UsersLocal';
  }

    //Logger.info('IN Create Account From CreateUser');

    azureQueue.receiveSubscriptionMessage(accountCreateTopic, accountCreateSub, (error, receivedMessage) => {
        if (error) {
                //Logger.info('Error in receiving message from TopicCreateAccount to create users ', error);
        } else {
              // Logger.info('STEP 0 : Message received from topic - '+accountCreateTopic+' sub - '+accountCreateSub+'to create user account ', receivedMessage);
            var recordObj1 = JSON.parse(receivedMessage.body);
            var brokerProperties = receivedMessage.brokerProperties;
            var valMy4chainId = recordObj1.my4chainId;
            var valEthPassword = recordObj1.ethPassword;
            var valApiTimestamp = recordObj1.apiTimestamp;
            const schema = {
              my4chainId: Joi.number().required(),
              ethPassword: Joi.string().guid().required(),
              apiTimestamp: Joi.date().required(),
            }
            Joi.validate(recordObj1, schema, function (err, value) {
              if(!err)
              {
                  //Logger.info('SCHEMA VERIFIED');
                  domain.User.query().where({
                      'my4chainId': valMy4chainId
                  }).select().then(function(userData) {
                    if (userData.length > 0) {
                      fs.appendFile(ErrorLogfileName,"================================ \n"
                        + new Date().toString() + " : Duplicate data " + util.inspect(recordObj1) + ' \n', function(err) {
                          if (err) {
                            //  Logger.info(' error in writing to file ');
                              return console.log(err);
                          } else {
                            //  console.log("CreateAccount result written to file");
                          }
                      });

                      /*var message = {
                          my4chainId: valMy4chainId,
                          accountAddress: userData.accountAddress
                      }*/
                      azureQueue.deleteMessage(receivedMessage, function(deleteError) {
                          if (!delrecordObj1eteError) {
                              fs.appendFile(ErrorLogfileName,"================================ \n" +
                                  new Date().toString() + " : DUPLICATE DELETE " + util.inspect(receivedMessage) + ' Message has been deleted from account-create queue \n', function(err) {
                                  if (err) {
                                    //  Logger.info(' error in writing to file ');
                                      return console.log(err);
                                  } else {
                                    //  console.log("CreateAccount result written to file");
                                  }
                              });
                          }
                      })
                    } else {
                        //Logger.info('IN CREATE NEW ACCOUND');
                          privateWeb3.personal.newAccount(recordObj1.ethPassword, function(error, result) {
                          if (!error) {
                            fs.appendFile(SuccessLogfileName,"================================ \n" +
                                  new Date().toString() + " : ACCOUNT CREATE ON BLOCKCHAIN WITH DATA " + util.inspect(result) + ' \n', function(err) {
                                if (err) {
                                  //  Logger.info(' error in writing to file ');
                                    return console.log(err);
                                } else {
                                  //  console.log("CreateAccount result written to file");
                                }
                            });

                            var objInsertQuery = {
                                my4chainId: recordObj1.my4chainId,
                                ethPassword: recordObj1.ethPassword,
                                serverNode: serverNode,
                                accountAddress: result,
                                apiTimestamp : recordObj1.apiTimestamp
                            };
                              Logger.info('IN INSERT DB object : ',objInsertQuery);
                              domain.User.query().insert(objInsertQuery).then(function(DbQueryResponce) {
                                  if (DbQueryResponce)
                                  {
                                    fs.appendFile(SuccessLogfileName,"================================ \n" + new Date().toString() + " : Message Saved " + util.inspect(receivedMessage) + '\n', function(err) {
                                          if (err) {
                                            //  Logger.info(' error in writing to file ');
                                              return console.log(err);
                                          } else {
                                            //  console.log("CreateAccount result written to file");
                                          }
                                      });
                                    //  Logger.info('STEP 1 : Account Successfully created and saved in database ');
                                      var message = {
                                          my4chainId: recordObj1.my4chainId,
                                          accountAddress: result
                                      }


                                      azureQueue.sendTopicMessage(accountResultTopic, JSON.stringify(message), (error) => {
                                        if (!error) {
                                          azureQueue.deleteMessage(receivedMessage, function(deleteError) {
                                              if (!deleteError) {
                                                  fs.appendFile(SuccessLogfileName,"================================ \n"
                                                      +new Date().toString() + " : Message deleted from account-create queue and send to account-result queue" + util.inspect(receivedMessage) + '  \n', function(err) {
                                                      if (err) {
                                                        //  Logger.info(' error in writing to file ');
                                                          return console.log(err);
                                                      } else {
                                                        //  console.log("CreateAccount result written to file");
                                                      }
                                                  });
                                              }
                                          })
                                        }else {
                                          fs.appendFile("CreateAccountLog", new Date().toString() + " : " +'Error in sending to ' + accountResultTopic+' queue '+ error+'\n', function(err) {
                                              if (err) {
                                                //  Logger.info(' error in writing to file ');
                                                  return console.log(err);
                                              } else {
                                                //  console.log("CreateAccount result written to file");
                                              }
                                          });
                                        }
                                      });
                                  }
                              },function(error){
                                fs.appendFile(ErrorLogfileName,"================================ \n" +new Date().toString()
                                      + " : Failed to save " + util.inspect(receivedMessage) + ' \n', function(err) {
                                    if (err) {
                                      //  Logger.info(' error in writing to file ');
                                        return console.log(err);
                                    } else {
                                      //  console.log("CreateAccount result written to file");
                                    }
                                });
                                Logger.info("In error Info")
                              })

                              privateWeb3.eth.sendTransaction({
                                  from: privateWeb3.eth.coinbase,
                                  to: result,
                                  value: privateWeb3.toWei(20, 'ether')
                              }, (tx_error, tx_result) => {
                                  if (!tx_error) {
                                      userCount++;
                                      Logger.info("STEP PAYMENT : Payment of 20 ether to account success ", tx_result);
                                      fs.appendFile("etherTransactionResult", userCount + '. ' + result+' success'+' txHash - '+tx_result+'\n', function(err) {
                                          if (err) {
                                              //Logger.info(' error in writing to file ');
                                              return console.log(err);
                                          } else {
                                            //  console.log("etherTransactionResult written to file");
                                          }
                                      });
                                  } else {
                                      userCount++;
                                      Logger.info("STEP 6 : Payment of 20 ether to account failed ", tx_error);
                                      fs.appendFile("etherTransactionResult",new Date().toString() + " : " + userCount + '. ' + result+' failed'+'\n', function(err) {
                                          if (err) {
                                            //  Logger.info(' error in writing to file ');
                                              return console.log(err);
                                          } else {
                                            //  console.log("CreateAccount result written to file");
                                          }
                                      });
                                  }
                              });


                          } else {
                              Logger.info('Error :', error);
                          }
                      });
                    }
                }).catch(error => {
                  fs.appendFile(ErrorLogfileName,"================================ \n" + new Date().toString() +
                            " : ERROR in request. Please send the data in format :" + util.inspect(message) + ' \n', function(err) {
                        if (err) {
                            return console.log(err);
                        } else {
                        }
                    });
                    Logger.info("Error in query");
                })
              }else {
                Logger.info("STEP 7 : Schema validation Failed " + err);
                fs.appendFile(ErrorLogfileName,"================================ \n STEP 7 :" + new Date().toString() + ' : Schema validation Failed For Data' + util.inspect(recordObj1) + " Error LOG : "+ err+'\n', function(err) {
                    //if (err) {
                      //  Logger.info(' error in writing to file ');
                        //return console.log(err);
                    //} else {
                      //if(brokerProperties.DeliveryCount>4)
                      //{
                        azureQueue.deleteMessage(receivedMessage, function(deleteError) {
                            if (!deleteError) {
                                fs.appendFile(ErrorLogfileName,new Date().toString() + " : " + util.inspect(receivedMessage) + ' Message has been deleted from account-create queue After 5 retry \n', function(err) {
                                    if (err) {
                                        return console.log(err);
                                    } else {
                                      }
                                });
                            }
                        })
                    //  }
                  //  }
                });
              }
            });
        }
    })
}
