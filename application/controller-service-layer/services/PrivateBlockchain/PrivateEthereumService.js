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
            // send file hash in transaction
        sendRawHashIntransaction(req, res, callback) {
          Logger.info("data in transaction", req.body, privateWeb3.toHex(6))
          let resData = {};

          var Tx = require('ethereumjs-tx')
          var crypto = require('crypto')
      //    var privateKey = crypto.randomBytes(32)
       var privateKey = privateKey = Buffer.from('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex')

          var gasPrice = privateWeb3.eth.gasPrice;
          var gasPriceHex = privateWeb3.toHex(gasPrice);
          var nonce = privateWeb3.eth.getTransactionCount(req.body.fromAddress);
          var nonceHex = privateWeb3.toHex(nonce);
          var rawTx = {
            from: req.body.fromAddress,
              nonce: nonceHex,
              gasPrice: gasPriceHex,
              gasLimit: '0x2710000000',
              gas:privateWeb3.toHex(1000000),
              to: req.body.toAddress,
              from: req.body.fromAddress,
             data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
              chainId: privateWeb3.toHex(6)
          }


            Logger.info("rawTx in transaction", rawTx)
          var tx = new Tx(rawTx)
          console.log(tx);
          tx.sign(privateKey)

          var serializedTx = tx.serialize()
          console.log(serializedTx.toString('hex'),tx)

          privateWeb3.eth.sendRawTransaction(serializedTx.toString('hex'), function(err, hash) {
              //  if (!err)

              console.log("hiii", err, hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
              callback(err,hash);
          });

        }

        // send file hash in raw  transaction
        sendHashIntransaction(req, res, callback) {

            Logger.info("data in transaction", req.body.data)
            let resData = {};
            privateWeb3.eth.sendTransaction({
                from: req.body.fromAddress,
                to: req.body.toAddress,
                //  value: privateWeb3.toWei(1, 'ether'),
                data: privateWeb3.fromAscii(req.body.data) // req.body.data
            }, (tx_error, tx_result) => {
                if (!tx_error) {
                    resData.transactionResult = tx_result;
                    let result = {};
                    result.senderAddress = req.body.fromAddress;
                    result.reciverAddress = req.body.toAddress;
                    result.transactionHash = tx_result;
                    result.data = req.body.data;
                    utility.saveToTransactionData(result);
                    callback(null, resData);
                } else {
                    callback(tx_error);
                }
            });
        }

        // get hash data from transaction
        getHashIntransaction(req, res, callback) {
            //  Logger.info("data in transaction",req.body.data)
            let resData = {};
            privateWeb3.eth.getTransaction(req.query.tranxHash, function(error, blockByHash) {
                if (!error) {
                    if (blockByHash != null) {
                        //  console.log("blockhash----> ",blockByHash);
                        //  resData = blockByHash;
                        resData.originalData = privateWeb3.toAscii(blockByHash.input);
                        resData.blockNumber = blockByHash.blockNumber;
                        resData.hash = blockByHash.hash;
                        resData.input = blockByHash.input;
                        if (!blockByHash.blockNumber) {

                            resData.message = "Block is not created";

                        } else {
                            resData.message = "Block is created";
                        }
                        //  resData.block = blockByHash;
                        //resData.latest = bestBlock.number;
                        callback(null, resData);
                        //callback(null, resData);
                    } else {
                        //  resData.totalConfirmations = 0;
                        resData.message = "Block hash not genrated"
                            //resData = new Error(error);
                            //resData.status = 500;
                        callback(null, resData);
                        //callback(resData,null);

                    }
                } else {

                    resData = new Error(configurationHolder.errorMessage.blockchainIssue);
                    resData.status = 500;
                    callback(resData, null);
                    // callback(resData,null);
                }
            });
        }



        // unlock account before transaction

        createContract(smartSponsor, recordObj, bytecode, gas, abi, callback, web3x) {

                try {


            // var bytecode = abi.filter(function (json) {
            //           return json.type === 'constructor' && json.inputs.length === params.length;
            //       }).map(function (json) {
            //           return json.inputs.map(function (input) {
            //               return input.type;
            //           });
            //       }).map(function (types) {
            //           return coder.encodeParams(types, params);
            //       })[0] || '';


                    let resData = {};
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
                        let Trans = null;
                        try {
                            Logger.info("Date of logger", recordObj.startfromMilli, " ", recordObj.expireDateMilli);
                            Logger.info(new Date());
                            Logger.info("contract " , ownerMemberAction);
                            // var paramsBytes = smartSponsor.customByteCodeConvert(recordObj.encryptHash, recordObj.owner,
                            //     ownerMember, ownerMemberAction, recordObj.recipient, //[1,2,3,4,0,6,5,4,3]
                            //     recipientMember,
                            //     recipientMemberAction,
                            //     recordObj.startfromMilli,
                            //     recordObj.expireDateMilli, {
                            //         from: recordObj.owner,
                            //         gas: 19518064, //estimate,
                            //         //   gasPrice:0,
                            //         data: bytecode
                            //             //      nonce : ++nonce
                            //     }, (err, contractParams) => {
                            //         console.log("data of bytes ");
                            //         console.log(new Date())
                            //
                            //         var Tx = require('ethereumjs-tx')
                            //         var crypto = require('crypto')
                            //     //    var privateKey = crypto.randomBytes(32)
                            //      var privateKey = privateKey = Buffer.from('d0faa27012b8a8ad41efdbc158b273131af5c61134a9df9ccdaca93f272222bf', 'hex')
                            //
                            //         var gasPrice = privateWeb3.eth.gasPrice;
                            //         var gasPriceHex = privateWeb3.toHex(gasPrice);
                            //         var nonce = privateWeb3.eth.getTransactionCount(recordObj.owner);
                            //         var nonceHex = privateWeb3.toHex(nonce);
                            //         var rawTx = {
                            //           nonce: nonceHex,
                            //           gasPrice: gasPriceHex,
                            //           from :recordObj.owner,
                            //           gasLimit: privateWeb3.toHex(20000000),
                            //           data:   bytecode+contractParams,
                            //           chainId :'0x6'
                            //         }
                            //         console.log(rawTx.nonce);
                            //           var tx = new Tx(rawTx)
                            //           tx.sign(privateKey)
                            //           var serializedTx = tx.serialize()
                            //
                            //           privateWeb3.eth.sendRawTransaction(rawTx, function(err, hash) {
                            //               //  if (!err)
                            //
                            //               console.log("hiii1111", err, hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
                            //             //  callback(err,hash);
                            //           });
                            //         //  console.log(serializedTx.toString('hex'))
                            //         //  broadCastTx(serializedTx.toString('hex'))
                            //     });
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
                                            Logger.info("Error");
                                            errLogger.info(err);


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
                                            return utility.updateToDb(contract, abi, recordObj, bytecode, gas, callback);
                                    } else {
                                        Trans = contract.transactionHash;
                                        Logger.info("A transmitted, waiting for mining...", contract.transactionHash);
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
                            let startMilli = new Date(recordObj.startfrom).getTime() + "";
                            let endMilli = new Date(recordObj.expireDate).getTime() + "";
                            recordObj.startfromMilli = startMilli.slice(0, -3);
                            recordObj.expireDateMilli = endMilli.slice(0, -3);
                            Logger.info(new Date());
                            Logger.info("unlocked");
                            let gas = 0;
                            // call contract create
                            this.createContract(smartSponsor, recordObj, bytecode, gas, abi, callback, utiData.web3x);

                        }
                    });
            //     }
            // });

        }

        interpetate(bodyData, funCallback) {

            var ownerMember = [];
            var ownerMemberAction = [];
            var recipientMember = [];
            var recipientMemberAction = [];
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

        // assign role to smart contract
        assignandremove(req, res, callback) {
            let recordObj = req.body;
            let resData = {};
            console.log(new Date());
            utility.checkUserAuth(recordObj.accountAddress, recordObj.password, (ifexist) => {
                if (ifexist == false) {
                    resData = new Error(configurationHolder.errorMessage.actionUnautherized);
                    resData.status = 401;

                    return callback(resData, null);
                } else {
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

                }
            });

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

        privateImageHashGenerate(req, res, callback) {
            var key = 'oodles';
            var algorithm = 'sha256';
            var imagePath = req.files.file.path;
            // step 1 -------------Generate hash of image

            fs.readFile(imagePath, (err, imageData) => {
                var firstHash = crypto.createHmac(algorithm, key).update(imageData).digest('hex');
                Logger.info("hash of image: ", firstHash);

                // step 2 -------Generate
                var secondkey = '1234';
                var secondHash = crypto.createHmac(algorithm, secondkey).update(firstHash).digest('hex');
                Logger.info("secondHash: ", secondHash);

                var arr = {};
                arr.secondHash = secondHash;
                arr.encrypt = utility.encrypt(secondHash, 'hex', 'hex', 'oodles');
                arr.decrypt = utility.decrypt(arr.encrypt, 'hex', 'hex', 'oodles');
                callback(null, arr);
            });
        }

        fileHashToContract(fileHash, recordObj, callback) {
            let contractAddress = recordObj.contractAddress;
            let adminAddress = recordObj.adminAddress;
            let password = recordObj.password;
            console.log("Inside spnosor the contract function");
            utility.selectForDataBase(contractAddress, (selectData, bytecode, salt) => {
                selectData = JSON.parse(selectData);
                let smartSponsor = privateWeb3.eth.contract(selectData);
                var ss = smartSponsor.at(contractAddress);
                Logger.info("Unlock Account ----------------");
                utility.unlockAccount(adminAddress, password, 30, (error, result) => {
                    if (error) {
                        callback(error, result);
                        return;
                    } else {
                        utility.estimateGas(adminAddress, bytecode, (error, gas) => {
                            if (error) {
                                callback(error, gas);
                                return;
                            } else {
                                // method execution on contract
                                //callback(null,fileHash);
                                // var input=new Buffer(result.input.slice(2),'hex');
                                // resData.data=utility.decrypt(input).toString('utf8');
                                fileHash = "" + fileHash;
                                console.log("fileHash: ", typeof fileHash);
                                ss.addFileHash.estimateGas(fileHash, {
                                    from: adminAddress
                                }, (err, gasActual) => {
                                    console.log("gasActual: ", gasActual);
                                    if (!err) {
                                        ss.addFileHash(fileHash, {
                                            from: adminAddress,
                                            gas: gasActual
                                        }, (err, data) => {
                                            if (err) {
                                                callback(err, err);
                                            } else {
                                                contractMethordCall.MethodCallBack(err, data, ss, callback, "addFileHash");
                                            }
                                        });
                                    } else {
                                        callback(err, err);
                                    }
                                });
                            }
                        });
                    }
                });
            });
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
        storeRequestConfirmation(requestid, tx_result) {
            // redisClient.hmset(requestid,tx_result,0,function(err,object){
            //   if(err){ console.log("adding Hmset Error"); }
            //   else{ console.log("Added succesfully"); console.log(object); }
            // });
            var data = {
                tranHash: tx_result,
                confirm: 0
            };
            redisClient.set(requestid, JSON.stringify(data), function(err, object) {
                if (err) {
                    console.log("adding set Error");
                } else {
                    console.log("Added succesfully set");
                    console.log(object);
                }
            });
            redisClient.get(requestid, function(err, object) {
                if (err) {
                    console.log("Getting Set Error");
                } else {
                    console.log("----Retrieving SET--");
                    object = JSON.parse(object);
                    console.log(object, typeof object);
                    console.log("---End Retriving SET");
                }
            });
        }



    }

    module.exports = new PrivateEthereumService();
