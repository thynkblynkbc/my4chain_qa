    'use strict';
    var contractMethordCall = require('./ContractMethordCall');
    class PrivateEthereumService {


        // unlock account before transaction
        unlockAccount(owner, password, duration, cb) {
            privateWeb3.personal.unlockAccount(owner, password, 120, function(error, result) {
                cb(error, result);
            });

        }
        estimateGas(account, bytecode,cb) {
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

            fs.readFile(__dirname + '/solidity/binaryContract.sol', 'utf8', function(err, solidityCode) {
                if (err) {
                    console.log("error in reading file: ", err);
                    return;
                } else {

                    Logger.info("File Path: ", __dirname + '/solidity/binaryContract.sol');
                    Logger.info(new Date());
                    Logger.info("-----compling solidity code ----------");
                    Logger.info(new Date());
                    // var compiled = solc.compile(solidityCode, 1).contracts.DieselPrice;
                    var compiled = solc.compile(solidityCode, 1).contracts.documentAccessMapping;
                    Logger.info("-----complile complete ----------");
                    Logger.info(new Date());
                    const abi = JSON.parse(compiled.interface);
                    Logger.info("bytecode: ", typeof compiled.bytecode, compiled.bytecode.length);
                    const bytecode = compiled.bytecode;
                    var smartSponsor = privateWeb3.eth.contract(abi);

                    cb(bytecode, smartSponsor, abi);
                }
            });

        }
        decryptBuffer(buffer,password){
            var decipher = crypto.createDecipher('aes-256-cbc',password)
            var dec = Buffer.concat([decipher.update(buffer) , decipher.final()]);
            return dec;
        }
        encryptBuffer(buffer,password){
            var cipher = crypto.createCipher('aes-256-cbc',password)
            var crypted = Buffer.concat([cipher.update(buffer),cipher.final()]);
            return crypted;
        }
        createContract(smartSponsor, recordObj, bytecode, gas, abi, callback) {
            Logger.info("-----Contract creation ----------", gas);
            recordObj.salt=uuid.v1();
            recordObj.encryptHash=this.encrypt(recordObj.fileHash, 'utf8', 'hex',recordObj.salt);
            recordObj.decryptHash=this.decrypt(recordObj.encryptHash,'hex','utf8',recordObj.salt);
            console.log("recordObj: ",recordObj);
            var ss = smartSponsor.new(recordObj.to,recordObj.encryptHash,{
                    from: recordObj.owner,
                    gas: gas+300000,
                    data : bytecode
                  }, (err, contract) => {
                    if (err) {
                        console.error(err);
                        callback(err, err);
                        return;
                    } else if (contract.address) {
                        this.saveToDb(contract, abi, recordObj, bytecode, gas, callback);
                    } else {
                        Logger.info("A transmitted, waiting for mining...");
                    }
                });
        }

        contractForAssets(ihash, res, callback) {
            //	Logger.info("privateWeb3.personal",privateWeb3.personal.newAccount);
        }

        // create a  smart contract
        smartContract(req, res, callback) {
            let recordObj=req.body;
            // call a function to covert abi defination of contract
            this.convertToAbi((bytecode, smartSponsor, abi) => {
                Logger.info("Unlocking account -----------");
                this.unlockAccount(recordObj.owner, recordObj.password, 30, (error, result) => {
                    if (error) {
                        callback(error, result);
                        return;
                    } else {
                      this.estimateGas(recordObj.owner, bytecode, (error, gas) => {
                            if (error) {
                                callback(error, gas);
                                return;
                            } else {
                                this.createContract(smartSponsor, recordObj, bytecode, gas, abi, callback);
                            }
                        });
                    }
                });
            });
        }

        saveToDb(contract, abi, recordObj, bytecode, gas, callback) {
            domain.Contract.query().insert({
                contractAddress: contract.address,
                transactionHash: contract.transactionHash,
                abi: JSON.stringify(abi),
                ethAddress: recordObj.owner,
                bytecode: bytecode,
                salt:recordObj.salt,
                partyAddress:recordObj.to
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
                    cb(contData[0].abi, contData[0].bytecode);
                });
            }
            // assign role to smart contract
        sponsorContract(req, res, callback) {
            let recordObj=req.body;
            console.log("Inside spnosor the contract function",recordObj);
            this.selectForDataBase(recordObj.contractAddress, (selectData, bytecode) => {
                selectData = JSON.parse(selectData);
                let smartSponsor = privateWeb3.eth.contract(selectData);
                var ss = smartSponsor.at(recordObj.contractAddress);
                Logger.info("Unlock Account ----------------");
                this.unlockAccount(recordObj.adminAddress, recordObj.password, 30, (error, result) => {
                    if (error) {
                        callback(error, result);
                        return;
                    } else {
                        this.estimateGas(recordObj.adminAddress, bytecode, (error, gas) => {
                            if (error) {
                                callback(error, gas);
                                return;
                            } else {
                                contractMethordCall.contractMethodCall(recordObj,ss,callback,gas);
                            }
                        });
                    }
                });
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
                arr.encrypt = this.encrypt(secondHash, 'hex', 'hex','oodles');
                arr.decrypt = this.decrypt(arr.encrypt, 'hex', 'hex','oodles');
                callback(null, arr);
            });
        }
        privateImageHashtoContract(req, res, callback) {
            var key = 'oodles';
            var algorithm = 'sha256';
            var files = req.files;
            var recordObj = req.body;
            Logger.info("body-->",recordObj);

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
                arr.encrypt = this.encrypt(secondHash, 'hex', 'hex','oodles');
                arr.decrypt = this.decrypt(arr.encrypt, 'hex', 'hex','oodles');
                console.log("hash of file: ",arr);
                // saving file hash to contract
                this.fileHashToContract(arr.encrypt, recordObj,callback);
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
            this.selectForDataBase(contractAddress, (selectData, bytecode) => {
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



                                fileHash=""+fileHash;
                                console.log("fileHash: ",typeof fileHash);
                                ss.addFileHash.estimateGas(fileHash, {
                                    from: adminAddress
                                }, (err, gasActual) => {
                                    console.log("gasActual: ", gasActual);
                                    if (!err) {
                                        ss.addFileHash(fileHash, {
                                             from: adminAddress,
                                             gas: gasActual
                                        }, (err, data) => {
                                             if(err){
                                               callback(err,err);
                                             }
                                             else {
                                                 contractMethordCall.MethodCallBack(err, data, ss, callback, "addFileHash");
                                           }

                                        });
                                    }else {
                                      callback(err,err);
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
            //	Logger.info("privateWeb3.personal",privateWeb3.personal.newAccount);
            Logger.info("hello");
            privateWeb3.personal.newAccount(recordObj.password, function(error, result) {
                if (!error) {
                    domain.User.query().insert({
                        email: recordObj.email,
                        password: recordObj.password,
                        ethPassword: recordObj.ethPassword,
                        ethAddress: result
                    }).then(function(data) {
                        console.log("Inserted data: ", data);
                        var databaseReturn = data;
                        var resData = {};
                        resData.key = "password";
                        resData.address = result;
                        resData.data = databaseReturn;

                        callback(null, resData);
                    });
                    // var resData = {};
                    // resData.key = "password";
                    // resData.address = result;
                    // callback(null, resData);
                } else {
                    callback(error);
                }
            });
        }
        encrypt(text, from, to,password) {
            var cipher = crypto.createCipher('aes-256-cbc', password);
            var crypted = cipher.update(text, from, to);
            crypted += cipher.final(to);
            return crypted;
        }

        decrypt(text, from, to,password) {
            var decipher = crypto.createDecipher('aes-256-cbc', password);
            var dec = decipher.update(text, from, to)
            dec += decipher.final(to);
            return dec;
        }

        //  send ether to other account
        privateSendether(reqData, res, callback) {
            var fromAddress = reqData.fromAddress;
            var toAddress = reqData.toAddress;
            var password = reqData.password;
            var amount = reqData.amount;
            var data = reqData.data;
            var duration = 30;
            var resData = {};
            Logger.info("gas needed");
            //  var data = 'Imroz created a transaction';
            var encrypted = this.encrypt(data, 'utf8', 'hex','oodles');
            var decrypted = this.decrypt(encrypted, 'hex', 'utf8','oodles');
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
                            }, function(tx_error, tx_result) {
                                if (!tx_error) {
                                    resData.transactionResult = tx_result;
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


    }

    module.exports = new PrivateEthereumService();
