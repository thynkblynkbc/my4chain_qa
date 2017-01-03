    'use strict';
    var contractMethordCall = require('./ContractMethordCall');
    class PrivateEthereumService {
      //rolesInt ={};
       constructor (){

         this.rolesInt ={};
         this.rolesInt["CAN_ASSIGN"] = 1;
         this.rolesInt["CAN_REVOKE"] =2;
         this.rolesInt["CAN_ACCEPT"] = 3;
         this.rolesInt["CAN_DECLINE"] = 4;
         this.rolesInt["CAN_REVIEW"] = 5;
         this.rolesInt["CAN_ACK"] =6;
       }
        // unlock account before transaction
        unlockAccount(owner, password, duration, cb) {
            privateWeb3.personal.unlockAccount(owner, password, 120, function(error, result) {
                cb(error, result);
            });

        }
        estimateGas(account, bytecode, cb) {
                privateWeb3.eth.estimateGas({
                    from: account,
                    data: bytecode
                }, function(error, gas) {
                    Logger.info("gas: ", error, gas);
                    cb(error, gas);
                });
            }
            //  convert abi defination of contract
        convertToAbi(cb) {
          fs.readFile(__dirname + '/solidity/NumberContract.sol', 'utf8', function(err, solidityCode) {
                if (err) {
                    console.log("error in reading file: ", err);
                    return;
                } else {
                    Logger.info("File Path: ", __dirname + '/solidity/NumberContract.sol');
                    Logger.info(new Date());
                    Logger.info("-----compling solidity code ----------");
                    Logger.info(new Date());
                    var compiled = solc.compile(solidityCode, 1).contracts.documentAccessMapping;
                    Logger.info("-----complile complete ----------");
                    Logger.info(new Date());
                    const abi = JSON.parse(compiled.interface);
                    // fs.writeFile('./solidity/abi.json', compiled.interface, (err) => {
                    //   console.log("errrrr",err)
                    //
                    // });
                    Logger.info("bytecode: ", typeof compiled.bytecode, compiled.bytecode.length);
                    const bytecode =compiled.bytecode;
                    var smartSponsor = privateWeb3.eth.contract(abi);
                    cb(bytecode, smartSponsor, abi);
                }
            });
        //      var smartSponsor = privateWeb3.eth.contract(solAbi);
        //    cb(solBytecode,smartSponsor,solAbi);

        }
        decryptBuffer(buffer, password) {
            var decipher = crypto.createDecipher('aes-256-cbc', password)
            var dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
            return dec;
        }
        encryptBuffer(buffer, password) {
            var cipher = crypto.createCipher('aes-256-cbc', password)
            var crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
            return crypted;
        }
        createContract(smartSponsor, recordObj, bytecode, gas, abi, callback) {
            Logger.info("-----Contract creation ----------", gas,recordObj.expireDate);
            recordObj.salt=uuid.v1();
            recordObj.encryptHash=this.encrypt(recordObj.fileHash, 'utf8', 'hex',recordObj.salt);
            recordObj.decryptHash=this.decrypt(recordObj.encryptHash,'hex','utf8',recordObj.salt);
            console.log("recordObj: ",recordObj);
            this.interpetate(recordObj,(ownerMember,ownerMemberAction,recipientMember,recipientMemberAction)=>{
             console.log("recordObj1111-->",recordObj)
            var ss = smartSponsor.new("filehash",recordObj.owner,
            ownerMember
            ,ownerMemberAction,recordObj.recipient,//[1,2,3,4,0,6,5,4,3]
            recipientMember,
            recipientMemberAction,
            recordObj.startfrom,
            recordObj.expireDate,{
                  from: recordObj.owner,
                    gas: gas+3000000,
                    data : bytecode
                  }, (err, contract) => {
                    if (err) {
                        console.error(err);
                        callback(err, err);
                        return;
                    } else if (contract.address) {
                        Logger.info(new Date());
                        this.saveToDb(contract, abi, recordObj, bytecode, gas, callback);
                    } else {
                        Logger.info("A transmitted, waiting for mining...");
                        Logger.info(new Date());
                    }
                });

              });

        }

        contractForAssets(ihash, res, callback) {
            //	Logger.info("privateWeb3.personal",privateWeb3.personal.newAccount);
        }

        // create a  smart contract
        smartContract(req, res, callback) {
            let recordObj = req.body;
            var resData = {};
            // call a function to covert abi defination of contract
                 console.log("run interpetate")

            this.convertToAbi((bytecode, smartSponsor, abi) => {
                Logger.info("Unlocking account -----------");
                  Logger.info(new Date());
                this.unlockAccount(recordObj.owner, recordObj.password, 30, (error, result) => {
                    if (error) {
                      console.log(error)
                      resData = new Error("Issue with blockchain");
                      resData.status = 500;

                        callback(resData, null);
                        return;
                    } else {
                        Logger.info(new Date());
                        Logger.info("unlocked");
                      this.estimateGas(recordObj.owner, bytecode, (error, gas) => {
                            if (error) {
                                resData = new Error("Issue with blockchain");
                                resData.status = 500;

                                callback(resData, null);
                                // callback(error, gas);
                                // return;
                            } else {
                                this.createContract(smartSponsor, recordObj, bytecode, gas, abi, callback);
                            }
                        });
                    }
                });
            });
            //});
        }

         interpetate(bodyData,funCallback){

            var ownerMember = [];
            var ownerMemberAction =[];
            var recipientMember = [];
            var recipientMemberAction = [];
                      async.auto({
                        owner_data: (callback)=>{
                            console.log('in get_data');
                            // async code to get some data
                            this.ownerArray(bodyData,ownerMember,ownerMemberAction,callback);
                              console.log('out get_data');
                          //  callback(null, 'data', 'owner in array');
                        },
                        recipient_data: (callback)=>{
                            console.log('in make_folder');
                            this.recipientArray(bodyData,recipientMember,recipientMemberAction,callback);
                            console.log('out make_data');
                            // async code to create a directory to store a file in
                            // this is run at the same time as getting the data
                            //callback(null, 'recipent in array');
                        },
                        write_file: ['owner_data', 'recipient_data', (callback, results)=>{
                          console.log('in write_file');
                            // once there is some data and the directory exists,
                            // write the data to a file in the directory
                            callback(null, 'filename');
                        }]
                    }, (err, results)=> {
                        console.log('err = ', err);
                        console.log('results = ', results);
                        console.log("ownerMember -->",ownerMember);
                        console.log("ownerMemberAction -->",ownerMemberAction);
                          console.log("recipientMember -->",recipientMember);
                            console.log("recipientMemberAction -->",recipientMemberAction);
                        funCallback(ownerMember,ownerMemberAction,recipientMember,recipientMemberAction);

                    });

         }

         ownerArray(bodyData,ownerMember,ownerMemberAction,ownerDataCallback){
           // take owner member array
           let count =0;
           async.forEach(bodyData.ownerMember, (ownerAction, ownerCallback) => {
             // push one by one address into owner member

             console.log(count++);
                ownerMember.push(ownerAction.address);
             async.forEach(ownerAction.action, (action, ownerMemberCallback) => {
               // push action of member one by one as member inserted respectively
                     ownerMemberAction.push(this.rolesInt[action]);
                      ownerMemberCallback();
             },(err)=>{
               console.log()
               // insert 0 (zero) as delimiter of each use action
                       ownerMemberAction.push(0);
                  //     ownerMemberCallback();
                      ownerCallback();
             });
           } , (err)=>{
             console.log("owner end----------------->")
                // ownerCallback();
                 ownerDataCallback(null,{});

           });

         }

         recipientArray(bodyData,recipientMember,recipientMemberAction,recipientDataCallback){
            let count =0;
           // take recipient member array
           async.forEach(bodyData.recipientMember, (recipientAction, recipientCallback) => {
               // push one by one address into recipient member
                console.log("count",count++);
                recipientMember.push(recipientAction.address);
             async.forEach(recipientAction.action, (action, recipientMemberCallback)=> {
                 // push action of member one by one as member inserted in array respectively
                     recipientMemberAction.push(this.rolesInt[action]);
                     recipientMemberCallback();
             },(err)=>{
                       recipientMemberAction.push(0);
                       recipientCallback();
             });
           } , (err)=>{
              console.log("recipient end")
                 //recipientCallback();
                 recipientDataCallback(null,{});

           });

         }


        saveToDb(contract, abi, recordObj, bytecode, gas, callback) {
            domain.Contract.query().insert({
                contractAddress: contract.address,
                transactionHash: contract.transactionHash,
                abi: JSON.stringify(abi),
                senderAddress: recordObj.owner,
                bytecode: bytecode,
                salt: recordObj.salt,
                receipentAddress: recordObj.recipient,
                startTime:knex.fn.now(),
                endTime:knex.fn.now()
            }).then(function(databaseReturn) {
                //Logger.info("Inserted data: ", databaseReturn);
                var arr = {};
                arr.contractAddress = contract.address;
                arr.txnHash = contract.transactionHash;
                arr.gasUsed = gas;
                //arr.tranHash = transactionHash;
                Logger.info("contractAddress: ", arr.contractAddress);
                callback(null, arr);
            });
        }

        selectForDataBase(contractAddress, cb) {
                domain.Contract.query().where({
                    'contractAddress': contractAddress
                }).select().then(function(data) {
                    let contData = data;
                    cb(contData[0].abi, contData[0].bytecode, contData[0].salt);
                });
            }
            // assign role to smart contract
        sponsorContract(req, res, callback) {
            let recordObj = req.body;
            console.log("Inside spnosor the contract function", recordObj);
            this.selectForDataBase(recordObj.contractAddress, (selectData, bytecode, salt) => {
                selectData = JSON.parse(selectData);
                let smartSponsor = privateWeb3.eth.contract(selectData);
                var ss = smartSponsor.at(recordObj.contractAddress);
                Logger.info("Unlock Account ----------------");
                this.unlockAccount(recordObj.accountAddress, recordObj.password, 30, (error, result) => {
                    if (error) {
                        callback(error, result);
                        return;
                    } else {
                        // this.estimateGas(recordObj.parentAddress, bytecode, (error, gas) => {
                        //     if (error) {
                        //         callback(error, gas);
                        //         return;
                        //     } else {

                          contractMethordCall.contractMethodCall(recordObj, ss, callback);

                          //  }
                        //});
                    }
                });

            });

        }
        userdetail(req, res, callback) {
            let recordObj = req.body;
            console.log("Inside spnosor the contract function", recordObj);
            this.selectForDataBase(recordObj.contractAddress, (selectData, bytecode, salt) => {
                selectData = JSON.parse(selectData);
                let smartSponsor = privateWeb3.eth.contract(selectData);
                var contractInstance = smartSponsor.at(recordObj.contractAddress);
                Logger.info("No account lock required ----------------");
                // this.unlockAccount(recordObj.adminAddress, recordObj.password, 30, (error, result) => {
                //     if (error) {
                //         callback(error, result);
                //         return;
                //     } else {
                        // this.estimateGas(recordObj.adminAddress, bytecode, (error, gas) => {
                        //     if (error) {
                        //         callback(error, gas);
                        //         return;
                        //     } else {
                                recordObj.method = "getUserAction";
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
            this.selectForDataBase(recordObj.contractAddress, (selectData, bytecode, salt) => {
                selectData = JSON.parse(selectData);
                let smartSponsor = privateWeb3.eth.contract(selectData);
                var contractInstance = smartSponsor.at(recordObj.contractAddress);
                Logger.info("Unlock Account ----------------");
                recordObj.method = "usersLog";
                let gas =21000;
                contractMethordCall.contractMethodCall(recordObj, contractInstance, callback, gas);
          });
        }
        fileModifylog(req, res, callback) {
            let recordObj = req.body;
            console.log("Inside spnosor the contract function", recordObj);
            this.selectForDataBase(recordObj.contractAddress, (selectData, bytecode, salt) => {
                selectData = JSON.parse(selectData);
                let smartSponsor = privateWeb3.eth.contract(selectData);
                var contractInstance = smartSponsor.at(recordObj.contractAddress);
                Logger.info("Unlock Account ----------------");
                recordObj.method = "modifierLog";
                let gas =21000;
                contractMethordCall.contractMethodCall(recordObj, contractInstance, callback, gas);
          });
        }


        changestate(req, res, callback) {
            let recordObj = req.body;
            console.log("Inside spnosor the contract function", recordObj);
            this.selectForDataBase(recordObj.contractAddress, (selectData, bytecode, salt) => {
                selectData = JSON.parse(selectData);
                let smartSponsor = privateWeb3.eth.contract(selectData);
                var contractInstance = smartSponsor.at(recordObj.contractAddress);
                Logger.info("Unlock Account ----------------");
                this.unlockAccount(recordObj.accountAddress, recordObj.password, 30, (error, result) => {
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
        revoke(req, res, callback) {
            this.review(req, res, callback);
        }
        review(req, res, callback) {
            let recordObj = req.body;
            console.log("Inside spnosor the contract function", recordObj);
            this.selectForDataBase(recordObj.contractAddress, (selectData, bytecode, salt) => {
                selectData = JSON.parse(selectData);
                let smartSponsor = privateWeb3.eth.contract(selectData);
                var contractInstance = smartSponsor.at(recordObj.contractAddress);
                Logger.info("Unlock Account ----------------");
                this.unlockAccount(recordObj.accountAddress, recordObj.password, 30, (error, result) => {
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
        callRevokeMethod(recordObj, contractInstance, gas, callback) {
            contractInstance.revoke(recordObj.revoke.comment, {
                from: recordObj.accountAddress,
                gas: gas
            }, (err, data) => {
              var resData = {};
              resData.txnHash = data;
              callback(null, resData);
                // this.MethodCallBack(err, data, contractInstance, callback, "revoke");
            });
        }
        callReviewMethod(recordObj, contractInstance, gas, callback) {
            this.selectForDataBase(recordObj.contractAddress, (selectData, bytecode, salt) => {
                var encryptFileHash = this.encrypt(recordObj.review.changedFileHash, 'utf8', 'hex', salt);
                var decryptFileHash = this.decrypt(encryptFileHash, 'hex', 'utf8', salt);
                Logger.info("review encrypt decrypt: ", recordObj.review.changedFileHash, encryptFileHash, decryptFileHash);
                contractInstance.review.estimateGas(recordObj.review.isModified, recordObj.review.modifyComment, encryptFileHash, {
                    from: recordObj.accountAddress
                }, (err, gasActual) => {
                  let resData ={};
                    console.log("gasActual: ", gasActual);
                    if (!err) {
                contractInstance.review(recordObj.review.isModified, recordObj.review.modifyComment, encryptFileHash, {
                    from: recordObj.accountAddress,
                    gas: gasActual
                }, (err, data) => {
                   //resData = {};
                  resData.txnHash = data;
                  callback(null, resData);
                    // this.MethodCallBack(err, data, contractInstance, callback, "review");
                });

              }else{
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
                //fs.readFile(__dirname + '/images.jpg', (err, imageData) => {
                var firstHash = crypto.createHmac(algorithm, key).update(imageData).digest('hex');
                Logger.info("hash of image: ", firstHash);

                // step 2 -------Generate
                var secondkey = '1234';
                var secondHash = crypto.createHmac(algorithm, secondkey).update(firstHash).digest('hex');
                Logger.info("secondHash: ", secondHash);

                var arr = {};
                arr.secondHash = secondHash;
                arr.encrypt = this.encrypt(secondHash, 'hex', 'hex', 'oodles');
                arr.decrypt = this.decrypt(arr.encrypt, 'hex', 'hex', 'oodles');
                callback(null, arr);
            });
        }
        privateImageHashtoContract(req, res, callback) {
            var key = 'oodles';
            var algorithm = 'sha256';
            var files = req.files;
            var recordObj = req.body;
            Logger.info("body-->", recordObj);

            // step 1 -------------Generate hash of image

            fs.readFile(files.file.path, (err, fileData) => {
                var firstHash = crypto.createHmac(algorithm, key).update(fileData).digest('hex');
                Logger.info("hash of image: ", firstHash);

                // step 2 -------Generate
                var secondkey = '1234';
                var secondHash = crypto.createHmac(algorithm, secondkey).update(firstHash).digest('hex');
                Logger.info("secondHash: ", secondHash);

                var arr = {};
                arr.secondHash = secondHash;
                arr.encrypt = this.encrypt(secondHash, 'hex', 'hex', 'oodles');
                arr.decrypt = this.decrypt(arr.encrypt, 'hex', 'hex', 'oodles');
                console.log("hash of file: ", arr);
                // saving file hash to contract
                this.fileHashToContract(arr.encrypt, recordObj, callback);
                //
                //this.imageUpload(recordObj, files, fileData);
                //callback(null, arr);
            });
        }
        fileHashToContract(fileHash, recordObj, callback) {
            let contractAddress = recordObj.contractAddress;
            let adminAddress = recordObj.adminAddress;
            let password = recordObj.password;
            console.log("Inside spnosor the contract function");
            this.selectForDataBase(contractAddress, (selectData, bytecode, salt) => {
                selectData = JSON.parse(selectData);
                let smartSponsor = privateWeb3.eth.contract(selectData);
                var ss = smartSponsor.at(contractAddress);
                Logger.info("Unlock Account ----------------");
                this.unlockAccount(adminAddress, password, 30, (error, result) => {
                    if (error) {
                        callback(error, result);
                        return;
                    } else {
                        this.estimateGas(adminAddress, bytecode, (error, gas) => {
                            if (error) {
                                callback(error, gas);
                                return;
                            } else {
                                // method execution on contract
                                //callback(null,fileHash);
                                // var input=new Buffer(result.input.slice(2),'hex');
                                // resData.data=this.decrypt(input).toString('utf8');



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
        imageUpload(recordObj, files, fileData) {
            try {
                //  Logger.info("inside",imageFile);
                console.log("path:-->", publicdir + "/upload/certificateFile");
                try {
                    fs.mkdirSync(publicdir + "/upload/certificateFile");
                } catch (e) {
                    //Logger.info("error in creating folder");
                    console.log("error in creating folder", e);
                }
                var curTime = new Date().getTime();
                var fileName = recordObj.adminAddress + "_" + curTime + "." + files.file.type.split("/")[1]
                    //var imageName = new Date().getTime() + "_" + newUserId + "." + imageFile.file.type.split("/")[1]
                console.log("fileName:-->", fileName);

                var newPath1 = publicdir + "/upload/certificateFile/" + fileName;
                console.log("actual path:-->", newPath1);
                console.log(newPath1, 'full path');
                fs.writeFile(newPath1, fileData, (err) => {
                    //Logger.info("err", err);
                    console.log("err", err);
                    var filePath = "certificateFile/" + fileName;
                    console.log("database image path: -->", filePath);
                    if (!err) {
                        //imagePathSaveToDb(filePath,recordObj);
                    }
                });
            } catch (exception) {
                console.log("err", exception);
            }
        }



        // This is use for for saving hash in ipfs and store hash in contract
        saveFileAndGenerateHash(toAccount, myAccount, req, res, callback) {
            //	Logger.info("privateWeb3.personal",privateWeb3.personal.newAccount);
            //  var imageHash = ipfs.addFile("./newImage.png");
            // ipfs.util.addFromFs('./newImage.png', (err, result) => {
            //       if (err) {
            //           throw err
            //           }
            //             Logger.info(result)
            //           })
            //  Logger.info("imageHash---->", imageHash);

        }

        // // to create a new account in blockchain
        createAccount(recordObj, res, callback) {
            var resData = {};
            //	Logger.info("privateWeb3.personal",privateWeb3.personal.newAccount);
            Logger.info("In CreateAccount controller");
            privateWeb3.personal.newAccount(recordObj.ethPassword, function(error, result) {
                if (!error) {
                    domain.User.query().insert({
                        email: recordObj.email,
                        ethPassword: recordObj.ethPassword,
                        ethAddress: result
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
                    resData = new Error("Issue with blockchain");
                    resData.status = 500;

                    callback(resData, null);
                }
            });
        }
        encrypt(text, from, to, password) {
            var cipher = crypto.createCipher('aes-256-cbc', password);
            var crypted = cipher.update(text, from, to);
            crypted += cipher.final(to);
            return crypted;
        }

        decrypt(text, from, to, password) {
            var decipher = crypto.createDecipher('aes-256-cbc', password);
            var dec = decipher.update(text, from, to)
            dec += decipher.final(to);
            return dec;
        }

        //  send ether to other account
        privateSendether(req, res, callback) {
            var reqData=req.body;
            var requestid=req.params.requestid;
            var fromAddress = reqData.fromAddress;
            var toAddress = reqData.toAddress;
            var password = reqData.password;
            var amount = reqData.amount;
            var data = reqData.data;
            var duration = 30;
            var resData = {};
            Logger.info("gas needed");
            //  var data = 'Imroz created a transaction';
            var encrypted = this.encrypt(data, 'utf8', 'hex', 'oodles');
            var decrypted = this.decrypt(encrypted, 'hex', 'utf8', 'oodles');
            console.log("data: ", data, encrypted, decrypted);

            privateWeb3.personal.unlockAccount(fromAddress, password, duration, (error, result) => {
                if (!error) {
                    Logger.info("Amount sent-->", privateWeb3.toWei(1, 'ether'));
                    this.estimateGas(fromAddress, encrypted, (error, gas) => {
                        if (error) {
                            callback(error, gas);
                            return;
                        } else {
                            privateWeb3.eth.sendTransaction({
                                from: fromAddress,
                                to: toAddress,
                                value: privateWeb3.toWei(amount, 'ether'),
                                data: encrypted
                            }, (tx_error, tx_result) => {
                                if (!tx_error) {
                                    resData.transactionResult = tx_result;
                                    this.storeRequestConfirmation(requestid,tx_result);
                                    callback(null, resData);

                                } else {
                                    callback(tx_error);
                                }
                            });
                        }
                    });

                } else {
                    callback(error);
                }

            });
        }
        storeRequestConfirmation(requestid,tx_result){
          // redisClient.hmset(requestid,tx_result,0,function(err,object){
          //   if(err){ console.log("adding Hmset Error"); }
          //   else{ console.log("Added succesfully"); console.log(object); }
          // });
          var data={ tranHash:tx_result,confirm:0 };
          redisClient.set(requestid,JSON.stringify(data), function(err,object){
              if(err){ console.log("adding set Error"); }
             else{ console.log("Added succesfully set"); console.log(object); }
          });
          redisClient.get(requestid, function(err, object) {
              if(err){ console.log("Getting Set Error"); }
              else{ console.log("----Retrieving SET--"); object=JSON.parse(object); console.log(object,typeof object);
                     console.log("---End Retriving SET");}
          });
          // redisClient.hget(requestid,tx_result,function(err,object){
          //   if(err){ console.log("Getting Hmset Error"); }
          //   else { console.log("----Retrieving HMSET--"); console.log(object);
          //          console.log("---End Retriving HMSET"); }
          //  });
          //  redisClient.multi()
          //  .keys('*', function (err, replies) {
          //    console.log("MULTI got " + replies.length + " replies");
          //    replies.forEach(function (reply, index) {
          //      console.log("Reply " + index + ": " + reply.toString());
          //     //  redisClient.hget(reply,tx_result, function(err, data){
          //     //    console.log(data);
          //     //  });
          //    });
          //  })
          //  .exec(function (err, replies) {});
        }



    }

    module.exports = new PrivateEthereumService();
