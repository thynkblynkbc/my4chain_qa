    'use strict';
    var contractMethordCall = require('./ContractMethordCall');
    var utility = require('./PrivateEthereumUtilities');
    class PrivateEthereumService {
        //rolesInt ={};
        constructor() {

            this.rolesInt = {};
            this.rolesInt["CAN_ASSIGN"] = 1;
            this.rolesInt["CAN_REVOKE"] = 2;
            this.rolesInt["CAN_ACCEPT"] = 3;
            this.rolesInt["CAN_DECLINE"] = 4;
            this.rolesInt["CAN_REVIEW"] = 5;
            this.rolesInt["CAN_ACK"] = 6;
        }

        // unlock account before transaction

        createRawContract(smartSponsor, recordObj, bytecode, gas, abi, callback, web3x) {

            try {

                let resData = {};
                Logger.info("-----Contract creation ----------", gas, recordObj.expireDate);
                Logger.info(new Date());
                recordObj.salt = "123456"; //uuid.v1();
                recordObj.encryptHash = utility.encrypt(recordObj.fileHash, 'utf8', 'hex', recordObj.salt);
                recordObj.decryptHash = utility.decrypt(recordObj.encryptHash, 'hex', 'utf8', recordObj.salt);
                //  Logger.info("recordObj: ",recordObj);
                utility.interpetate(recordObj, (ownerMember, ownerMemberAction, recipientMember, recipientMemberAction) => {

                    let Trans = null;
                    try {
                      domain.User.query().where({
                          'accountAddress': recordObj.owner
                      }).select().then(function(data) {
                        let dataRecord = JSON.parse(JSON.stringify(data));
                          if(data.length > 0){
                              Logger.info(dataRecord[0].privateKey+" sssssssss");

                        Logger.info("Date of logger", recordObj.startfromMilli, " ", recordObj.expireDateMilli);
                        Logger.info(new Date());
                        Logger.info("contract ", ownerMemberAction);
                        var paramsBytes = smartSponsor.contractParmasConvertToBytes(recordObj.encryptHash, recordObj.owner,
                            ownerMember, ownerMemberAction, recordObj.recipient, //[1,2,3,4,0,6,5,4,3]
                            recipientMember,
                            recipientMemberAction,
                            recordObj.startfromMilli,
                            recordObj.expireDateMilli, {
                                from: recordObj.owner,
                                gas: 19518064, //estimate,
                                //   gasPrice:0,
                                data: bytecode
                                    //      nonce : ++nonce
                            }, (err, contractParams) => {
                                console.log("data of bytes ");
                                console.log(new Date())

                                var Tx = require('ethereumjs-tx')
                                var crypto = require('crypto')
                                    //   var privateKey = crypto.randomBytes(32)
                                var privateKey = Buffer.from('d0faa27012b8a8ad41efdbc158b273131af5c61134a9df9ccdaca93f272222b2', 'hex')

                                var gasPrice = privateWeb3.eth.gasPrice;
                                var gasPriceHex = privateWeb3.toHex(gasPrice);
                                var nonce = privateWeb3.eth.getTransactionCount(recordObj.owner);
                                var nonceHex = privateWeb3.toHex(nonce);
                                console.log("nonce " + nonce + " gasPrice " + gasPrice)
                                var rawTx = {
                                    nonce: nonceHex,
                                    gasPrice: gasPriceHex,
                                    from: recordObj.owner,
                                    //  to:recordObj.owner,
                                    gasLimit: privateWeb3.toHex(19518065),
                                    data: bytecode + contractParams

                                }

                                var tx = new Tx(rawTx)
                                tx.sign(privateKey)
                                    //  console.log(tx.toJSON(privateKey));""
                                Logger.info("last");
                                console.log(new Date());

                                var serializedTx = tx.serialize()
                                    //   console.log(serializedTx.toString('hex'));
                                privateWeb3.eth.sendRawTransaction('0x' + serializedTx.toString('hex'), function(err, hash) {
                                    if (!err) {
                                        console.log(new Date());
                                        //    console.log(serializedTx.toString('hex'));
                                        callback(null, {
                                            contractDet: hash,
                                            time: new Date()
                                        });

                                    } else {

                                        callback(err, null);
                                    }

                                    console.log("hiii1111", err, hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
                                    //  callback(err,hash);
                                });
                                //  console.log(serializedTx.toString('hex'))
                                //  broadCastTx(serializedTx.toString('hex'))
                            });

                          }else{
                            resData = new Error(configurationHolder.errorMessage.errorInApi);
                            resData.status = 409;

                            callback(resData, null);
                          }
                        });

                    } catch (catchErr) {
                        Logger.info(configurationHolder.errorMessage.errorMsgForLogger + catchErr);
                        callback(catchErr, null);
                        return;
                    }

                });
            } catch (err) {
                resData = new Error(configurationHolder.errorMessage.errorInApi);
                resData.status = 409;

                callback(resData, null);

            }

        }
        createContract(smartSponsor, recordObj, bytecode, gas, abi, callback, web3x) {
              let resData = {};
                try {

                    Logger.info("-----Contract creation ----------", gas, recordObj.expireDate);
                    Logger.info(new Date());
                    recordObj.salt = "123456"; //uuid.v1();
                    recordObj.encryptHash = utility.encrypt(recordObj.fileHash, 'utf8', 'hex', recordObj.salt);
                    recordObj.decryptHash = utility.decrypt(recordObj.encryptHash, 'hex', 'utf8', recordObj.salt);
                    //  Logger.info("recordObj: ",recordObj);
                    this.interpetate(recordObj, (ownerMember, ownerMemberAction, recipientMember, recipientMemberAction) => {
                        //            var contractData = smartSponsor.new.getData(recordObj.encryptHash,recordObj.owner,
                        // ownerMember
                        // ,ownerMemberAction,recordObj.recipient,//[1,2,3,4,0,6,5,4,3]
                        // recipientMember,
                        // recipientMemberAction,
                        // recordObj.startfromMilli,
                        // recordObj.expireDateMilli,{
                        //       from: recordObj.owner,
                        //         gas: gas,
                        //         gasPrice :0,
                        //         data : bytecode
                        //       });
                        //  //     Logger.info("contractData -->",contractData)
                        //       privateWeb3.eth.estimateGas({
                        //           data: contractData
                        //       },(err,estimate)=>{
                        //         console.log("estimate ",estimate);
                        //       });

                        Logger.info("Inside intreprater");
                        let Trans = null;
                        try {


                            var ss = smartSponsor.new(recordObj.encryptHash, recordObj.owner,
                                ownerMember, ownerMemberAction, recordObj.recipient, //[1,2,3,4,0,6,5,4,3]
                                recipientMember,
                                recipientMemberAction,
                                recordObj.startfromMilli,
                                recordObj.expireDateMilli, {
                                    from: recordObj.owner,
                                    gas: 19518064, //estimate,
                                    //   gasPrice:0,
                                    data: bytecode
                                        //      nonce : ++nonce
                                }, (err, contract) => {

                                    if (err) {
                                        try {
                                            Logger.info(err);
                                            //    Logger.info("Error");
                                            //    errLogger.info(err);


                                            callback(err, null);
                                        } catch (catchErr) {
                                            errLogger.info("secondcallback error", catchErr);
                                        }
                                        //  return;
                                    } else if (contract.address) {
                                        //    errLogger.info("address ", contract.address," transactionHash ",contract.transactionHash);
                                        Logger.info("address ", contract.address);
                                        //  errLogger.info(new Date());
                                        web3x.reset();
                                      //  privateWeb3.reset();
                                        return utility.updateToDb(contract, abi, recordObj, bytecode, gas, callback);
                                    } else {

                                          web3x.reset();

                                        Trans = contract.transactionHash;

                                      //    privateWeb3.reset();
                                        Logger.info("A transmitted, waiting for mining...",recordObj.expireDateMilli," expire ", contract.transactionHash);
                                        Logger.info(new Date());
                                        callback(null, {
                                            contractDet: contract.transactionHash,
                                            time: new Date()
                                        });

                                        return utility.saveToDb(contract, abi, recordObj, bytecode, gas, callback);

                                    }
                                });


                        } catch (catchErr) {
                            Logger.info(configurationHolder.errorMessage.errorMsgForLogger + catchErr);
                            callback(catchErr, null);
                            return;
                        }

                    });
                } catch (err) {
                    resData = new Error(configurationHolder.errorMessage.errorInApi);
                    resData.status = 409;

                    callback(resData, null);

                }

            }

            interpetate(bodyData, funCallback) {

                var ownerMember = [];
                var ownerMemberAction = [];
                var recipientMember = [];
                var recipientMemberAction = [];
                Logger.info(new Date());
                async.auto({
                    owner_data: (callback) => {
                        //  console.log('in get_data');
                        // async code to get some data
                        this.ownerArray(bodyData, ownerMember, ownerMemberAction, callback);
                        //    console.log('out get_data');
                    },
                    recipient_data: (callback) => {
                        //  console.log('in make_folder');
                        this.recipientArray(bodyData, recipientMember, recipientMemberAction, callback);
                        //    console.log('out make_data');
                        // async code to create a directory to store a file in
                        // this is run at the same time as getting the data
                        //callback(null, 'recipent in array');
                    },
                    write_file: ['owner_data', 'recipient_data', (callback, results) => {
                        //  console.log('in write_file');
                        // once there is some data and the directory exists,
                        // write the data to a file in the directory
                        callback(null, 'filename');
                    }]
                }, (err, results) => {

                    funCallback(ownerMember, ownerMemberAction, recipientMember, recipientMemberAction);
                    return;
                });

            }

            ownerArray(bodyData, ownerMember, ownerMemberAction, ownerDataCallback) {
                // take owner member array
                let count = 0;
                async.forEach(bodyData.ownerMember, (ownerAction, ownerCallback) => {
                    // push one by one address into owner member

                    //   console.log(count++);
                    ownerMember.push(ownerAction.address);
                    async.forEach(ownerAction.action, (action, ownerMemberCallback) => {
                        // push action of member one by one as member inserted respectively
                        if (this.rolesInt[action]) {
                            ownerMemberAction.push(this.rolesInt[action]);
                        }
                        ownerMemberCallback();
                    }, (err) => {
                        //     console.log()
                        // insert 0 (zero) as delimiter of each use action
                        ownerMemberAction.push(0);
                        //     ownerMemberCallback();
                        ownerCallback();
                    });
                }, (err) => {
                    //     console.log("owner end----------------->")
                    // ownerCallback();
                    ownerDataCallback(null, {});
                    return;

                });

            }

            recipientArray(bodyData, recipientMember, recipientMemberAction, recipientDataCallback) {
                let count = 0;
                // take recipient member array
                async.forEach(bodyData.recipientMember, (recipientAction, recipientCallback) => {
                    // push one by one address into recipient member
                    //    console.log("count",count++);
                    recipientMember.push(recipientAction.address);
                    async.forEach(recipientAction.action, (action, recipientMemberCallback) => {
                        // push action of member one by one as member inserted in array respectively
                        if (this.rolesInt[action]) {
                            recipientMemberAction.push(this.rolesInt[action]);
                        }
                        recipientMemberCallback();
                    }, (err) => {
                        recipientMemberAction.push(0);
                        recipientCallback();
                    });
                }, (err) => {
                    //  console.log("recipient end")
                    //recipientCallback();
                    recipientDataCallback(null, {});
                    return;
                });

            }
            // create a  smart contract
        smartContract(req, res, callback) {
            let recordObj = req.body;
            var resData = {};
            // call a function to covert abi defination of contract
            console.log("run interpetate")
            Logger.info(new Date());
            // utility.checkUserAuth(recordObj.owner, recordObj.password, (ifexist) => {
            //     if (ifexist == false) {
            //         resData = new Error(configurationHolder.errorMessage.actionUnautherized);
            //         resData.status = 401;
            //
            //         return callback(resData, null);
            //     } else {
            Logger.info(new Date());
            utility.convertToAbi((error, utiData) => {
                if (error) {
                    resData = new Error(configurationHolder.errorMessage.errorInContract);
                    resData.status = 403;

                    return callback(resData, null);
                } else {
                    let bytecode = utiData.bytecode,
                        smartSponsor = utiData.smartSponsor,
                        abi = utiData.abi;
                    Logger.info("Unlocking account1 -----------");
                    Logger.info(new Date());
                    let startMilli = new Date(recordObj.startDate).getTime() + "";
                    let endMilli = new Date(recordObj.expireDate).getTime() + "";
                    recordObj.startfromMilli = startMilli.slice(0, -3);
                    recordObj.expireDateMilli = endMilli.slice(0, -3);
                    Logger.info(new Date());
                    Logger.info("unlocked");
                    let gas = 0;
                    // call contract create
                    if (recordObj.raw == true) {
                        this.createRawContract(smartSponsor, recordObj, bytecode, gas, abi, callback, utiData.web3x);
                    } else {

                        this.createContract(smartSponsor, recordObj, bytecode, gas, abi, callback, utiData.web3x);
                    }
                }
            });
            //     }
            // });

        }

      // assign role to smart contract
        assignandremove(req, res, callback) {
            let recordObj = req.body;
            let resData = {};
            console.log(new Date());
            // utility.checkUserAuth(recordObj.accountAddress, recordObj.password, (ifexist) => {
            //     if (ifexist == false) {
            //         resData = new Error(configurationHolder.errorMessage.actionUnautherized);
            //         resData.status = 401;
            //
            //         return callback(resData, null);
            //     } else {
                    console.log("Inside spnosor the contract function", recordObj);
                    console.log(new Date());
                    utility.selectForDataBase(recordObj.contractAddress, (selectData, bytecode, salt) => {
                        selectData = JSON.parse(selectData);
                        let smartSponsor = privateWeb3.eth.contract(selectData);
                        var ss = smartSponsor.at(recordObj.contractAddress);
                        Logger.info(new Date());
                        //    Logger.info("Unlock Account ----------------");
                        // utility.unlockAccount(recordObj.accountAddress, recordObj.password,60, (error, result) => {
                        //   console.log("err",error,"res",result);
                        //     if (!result) {
                        //         callback(error, result);
                        //         return;
                        //     } else {
                        // utility.estimateGas(recordObj.parentAddress, bytecode, (error, gas) => {
                        //     if (error) {
                        //         callback(error, gas);
                        //         return;
                        //     } else {

                        contractMethordCall.contractMethodCall(recordObj, ss, callback);

                        //  }
                        //});
                        //     }
                        // });

                    });

            //     }
            // });

        }
        userdetail(req, res, callback) {
            let recordObj = req.body;
            console.log("Inside spnosor the contract function", recordObj);
            utility.selectForDataBase(recordObj.contractAddress, (selectData, bytecode, salt) => {
                selectData = JSON.parse(selectData);
                let smartSponsor = privateWeb3.eth.contract(selectData);
                var contractInstance = smartSponsor.at(recordObj.contractAddress);
                Logger.info("No account lock required ----------------");
                // utility.unlockAccount(recordObj.adminAddress, recordObj.password, 30, (error, result) => {
                //     if (error) {
                //         callback(error, result);
                //         return;
                //     } else {
                // utility.estimateGas(recordObj.adminAddress, bytecode, (error, gas) => {
                //     if (error) {
                //         callback(error, gas);
                //         return;
                //     } else {
                recordObj.action = "getUserAction";
                contractMethordCall.contractMethodCall(recordObj, contractInstance, callback);
                //     }
                // });
                //     }
                // });

            });
        }
        log(req, res, callback) {
            let recordObj = req.body;
            console.log("Inside spnosor the contract function", recordObj);
            utility.selectForDataBase(recordObj.contractAddress, (selectData, bytecode, salt) => {
                selectData = JSON.parse(selectData);
                let smartSponsor = privateWeb3.eth.contract(selectData);
                var contractInstance = smartSponsor.at(recordObj.contractAddress);
                Logger.info("Unlock Account ----------------");
                recordObj.action = "usersLog";
                let gas = 21000;
                contractMethordCall.contractMethodCall(recordObj, contractInstance, callback, gas);
            });
        }
        fileModifylog(req, res, callback) {
            let recordObj = req.body;
            console.log("Inside spnosor the contract function", recordObj);
            utility.selectForDataBase(recordObj.contractAddress, (selectData, bytecode, salt) => {
                selectData = JSON.parse(selectData);
                let smartSponsor = privateWeb3.eth.contract(selectData);
                var contractInstance = smartSponsor.at(recordObj.contractAddress);
                Logger.info("Unlock Account ----------------");
                recordObj.action = "modifierLog";
                let gas = 21000;
                contractMethordCall.contractMethodCall(recordObj, contractInstance, callback, gas);
            });
        }


        changestate(req, res, callback) {
            let recordObj = req.body;
            let resData = {}
            utility.checkUserAuth(recordObj.accountAddress, recordObj.password, (ifexist) => {
                if (ifexist == false) {
                    resData = new Error(configurationHolder.errorMessage.actionUnautherized);
                    resData.status = 401;

                    return callback(resData, null);
                } else {
                    console.log("Inside spnosor the contract function", recordObj);
                    utility.selectForDataBase(recordObj.contractAddress, (selectData, bytecode, salt) => {
                        selectData = JSON.parse(selectData);
                        let smartSponsor = privateWeb3.eth.contract(selectData);
                        var contractInstance = smartSponsor.at(recordObj.contractAddress);
                        Logger.info("Unlock Account ----------------");
                        utility.unlockAccount(recordObj.accountAddress, recordObj.password, 30, (error, result) => {
                            if (error) {
                                callback(error, result);
                                return;
                            } else {
                                let gas = 21000;
                                contractMethordCall.contractMethodCall(recordObj, contractInstance, callback, gas);

                            }
                        });

                    });
                }
            });

        }
        revoke(req, res, callback) {
            let recordObj = req.body;
            let resData = {}
            utility.checkUserAuth(recordObj.accountAddress, recordObj.password, (ifexist) => {
                if (ifexist == false) {
                    resData = new Error(configurationHolder.errorMessage.actionUnautherized);
                    resData.status = 401;

                    return callback(resData, null);
                } else {
                    console.log("Inside spnosor the contract function", recordObj);
                    utility.selectForDataBase(recordObj.contractAddress, (selectData, bytecode, salt) => {
                        selectData = JSON.parse(selectData);
                        let smartSponsor = privateWeb3.eth.contract(selectData);
                        var contractInstance = smartSponsor.at(recordObj.contractAddress);
                        Logger.info("Unlock Account ----------------");
                        utility.unlockAccount(recordObj.accountAddress, recordObj.password, 30, (error, result) => {
                            if (error) {
                                callback(error, result);
                                return;
                            } else {
                                let gas = 2100;
                                this.callRevokeMethod(recordObj, contractInstance, gas, callback);
                            }
                        });
                    });
                }
            });
        }
        review(req, res, callback) {
            let recordObj = req.body;
            let resData = {}
            utility.checkUserAuth(recordObj.accountAddress, recordObj.password, (ifexist) => {
                if (ifexist == false) {
                    resData = new Error(configurationHolder.errorMessage.actionUnautherized);
                    resData.status = 401;

                    return callback(resData, null);
                } else {
                    console.log("Inside spnosor the contract function", recordObj);
                    utility.selectForDataBase(recordObj.contractAddress, (selectData, bytecode, salt) => {
                        selectData = JSON.parse(selectData);
                        let smartSponsor = privateWeb3.eth.contract(selectData);
                        var contractInstance = smartSponsor.at(recordObj.contractAddress);
                        Logger.info("Unlock Account ----------------");
                        utility.unlockAccount(recordObj.accountAddress, recordObj.password, 30, (error, result) => {
                            if (error) {
                                callback(error, result);
                                return;
                            } else {
                                let gas = 2100;
                                this.callReviewMethod(recordObj, contractInstance, gas, callback);
                            }
                        });

                    });
                }
            });

        }
        callRevokeMethod(recordObj, contractInstance, gas, callback) {
            contractInstance.revoke(recordObj.revoke.comment, {
                from: recordObj.accountAddress,
                gas: gas
            }, (err, data) => {
                var resData = {};
                resData.txnHash = data;
                recordObj.txnHash = data;
                recordObj.action = "review";
                contractMethordCall.contractLogSaveToDb(recordObj);
                callback(null, resData);
                // this.MethodCallBack(err, data, contractInstance, callback, "revoke");
            });
        }
        callReviewMethod(recordObj, contractInstance, gas, callback) {
            utility.selectForDataBase(recordObj.contractAddress, (selectData, bytecode, salt) => {
                var encryptFileHash = utility.encrypt(recordObj.review.changedFileHash, 'utf8', 'hex', salt);
                var decryptFileHash = utility.decrypt(encryptFileHash, 'hex', 'utf8', salt);
                Logger.info("review encrypt decrypt: ", recordObj.review.changedFileHash, encryptFileHash, decryptFileHash);
                contractInstance.review.estimateGas(recordObj.review.isModified, recordObj.review.modifyComment, encryptFileHash, {
                    from: recordObj.accountAddress
                }, (err, gasActual) => {
                    let resData = {};
                    console.log("gasActual: ", gasActual);
                    if (!err) {
                        contractInstance.review(recordObj.review.isModified, recordObj.review.modifyComment, encryptFileHash, {
                            from: recordObj.accountAddress,
                            gas: gasActual
                        }, (err, data) => {
                            //resData = {};
                            resData.txnHash = data;
                            recordObj.txnHash = data;
                            recordObj.action = "review";
                            contractMethordCall.contractLogSaveToDb(recordObj);
                            callback(null, resData);
                            // this.MethodCallBack(err, data, contractInstance, callback, "review");
                        });

                    } else {
                        // resData = {};
                        resData = new Error(err);
                        resData.status = 403;
                        callback(null, resData);
                    }
                });
            });
        }
        MethodCallBack(err, data, contractInstance, callback, methodName) {
            if (err) {
                Logger.info("error: ", err, data);
                callback(err, err);
                return;
            } else {
                Logger.info(methodName, data);
                Logger.info("event Call ------------");
                this.callEvent(contractInstance, callback, data);
            }
        }
        callEvent(contractInstance, callback, data) {
            var event = contractInstance.usersLog(function(error, result) {
                if (!error) {
                    Logger.info("Event result", result.args);
                    var arr = {};
                    arr.txnHash = data;
                    arr.result = result.args;
                    callback(error, arr);
                    event.stopWatching();
                } else {
                    Logger.info("error", error);
                    callback(error, result);
                    event.stopWatching();
                }
            });
        }
    }

    module.exports = new PrivateEthereumService();
