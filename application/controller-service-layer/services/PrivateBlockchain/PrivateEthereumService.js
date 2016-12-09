    'use strict';
    var contractMethordCall = require('./ContractMethordCall');
    class PrivateEthereumService {


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
            fs.readFile(__dirname + '/testNew.sol', 'utf8', function(err, solidityCode) {
                if (err) {
                    console.log("error in reading file: ", err);
                    return;
                } else {
                    //console.log("words: ", solidityCode);
                    Logger.info("File Path: ", __dirname + '/testNew.sol');
                    Logger.info(new Date());
                    Logger.info("-----compling solidity code ----------");
                    Logger.info(new Date());
                    //var srcCompiled = privateWeb3.eth.compile.solidity(solidityCode);
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
        createContract(smartSponsor, owner, bytecode, gas, abi, callback) {
            Logger.info("-----Contract creation ----------",gas);
            var ss = smartSponsor.new({
                from: owner,
                data: bytecode,
                gas: gas
            }, (err, contract) => {
                if (err) {
                    console.error(err,"error");
                    return;
                } else if (contract.address) {
                    this.saveToDb(contract.address, contract.transactionHash, abi, owner, bytecode, gas, callback);
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
            let owner = req.body.owner;
            let password = req.body.password;
            // call a function to covert abi defination of contract
            this.convertToAbi((bytecode, smartSponsor, abi) => {
                Logger.info("Unlocking account -----------");
                this.unlockAccount(owner, password, 30, (error, result) => {
                    if (error) {
                        callback(error, result);
                        return;
                    } else {
                        this.estimateGas(owner, bytecode, (error, gas) => {
                            if (error) {
                                callback(error, gas);
                                return;
                            } else {
                                this.createContract(smartSponsor, owner, bytecode, gas, abi, callback);
                            }
                        });
                    }
                });
            });
        }

        saveToDb(contractAddress, transactionHash, abi, owner, bytecode, gas, callback) {
            domain.Contract.query().insert({
                contractAddress: contractAddress,
                transactionHash: transactionHash,
                abi: JSON.stringify(abi),
                ethAddress: owner,
                bytecode: bytecode
            }).then(function(databaseReturn) {
                console.log("Inserted data: ", databaseReturn);
                var arr = {};
                arr.contractAddress = contractAddress;
                arr.gasUsed = gas;
                arr.tranHash= transactionHash;
                Logger.info("contractAddress: ", arr.contractAddress);
                callback(null, arr);
            });
        }

        selectForDataBase(contractAddress, cb) {
                domain.Contract.query().where({
                    'contractAddress': contractAddress
                }).select().then(function(data) {
                    let contData = data;
                 //   Logger.info("contData: ",contData);
                    cb(contData[0].abi, contData[0].bytecode);
                });
            }
            // assign role to smart contract
        sponsorContract(req, res, callback) {
            let contractAddress = req.body.contractAddress;
            let accountAddress = req.body.accountAddress;
            let adminAddress = req.body.adminAddress;
            let password = req.body.password;
            let action = req.body.action;
            let method = req.body.method;
            let textValue = req.body.textValue;
            console.log("Inside spnosor the contract function");
            this.selectForDataBase(contractAddress, (selectData,bytecode) => {
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
                                contractMethordCall.contractMethodCall(method, adminAddress, accountAddress, action, ss, callback, textValue, contractAddress, req.body.val, gas);
                            }
                        });
                    }
                });
            });
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


        //  send ether to other account
        privateSendether(reqData, res, callback) {
            var fromAddress = reqData.fromAddress;
            var toAddress = reqData.toAddress;
            var password = reqData.password;
            var amount = reqData.amount;
            var duration = 30;
            var resData = {};
            Logger.info("gas needed");
            privateWeb3.personal.unlockAccount(fromAddress, password, duration, function(error, result) {
                if (!error) {
                    Logger.info("Amount sent-->", privateWeb3.toWei(1, 'ether'));
                    privateWeb3.eth.sendTransaction({
                        from: fromAddress,
                        to: toAddress,
                        value: privateWeb3.toWei(amount, 'ether'),
                        gas: 21000
                    }, function(tx_error, tx_result) {
                        if (!tx_error) {
                            resData.transactionResult = tx_result;
                            callback(null, resData);
                        } else {
                            callback(tx_error);
                        }
                    });
                } else {
                    callback(error);
                }

            });
        }


    }

    module.exports = new PrivateEthereumService();
