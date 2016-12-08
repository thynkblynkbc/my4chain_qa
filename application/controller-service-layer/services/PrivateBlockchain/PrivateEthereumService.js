    'use strict';
    var contractMethordCall = require('./ContractMethordCall');
    class PrivateEthereumService {


        // unlock account before transaction
        unlockAccount(owner, password, duration, cb) {
            privateWeb3.personal.unlockAccount(owner, password, 120, function(error, result) {
                cb(error, result);
            });

        }

        //  convert abi defination of contract
        convertToAbi(cb) {
            let fs = require('fs');
            var words = fs.readFile(__dirname + '/testNew.sol', 'utf8', function(err, solidityCode) {
                if (err) {
                    console.log("error in reading file: ", err);
                    return;
                } else {
                    //console.log("words: ", solidityCode);
                    Logger.info("File Path: ", __dirname + '/testNew.sol');
                    Logger.info("-----compling solidity code ----------",new Date());
                    var srcCompiled = privateWeb3.eth.compile.solidity(solidityCode);
                    // var solc = require('solc');
                    // // var input = {
                    // //     'file.sol': solidityCode
                    // // };
                    //   var compiled = solc.compile(solidityCode, 1).contracts.documentAccessMapping;
                    // Logger.info("-----complile complete ----------",new Date());
                //    Logger.info(srcCompiled)
                  //  const compiled = solc.compile(source, 1);
                //  let srcCompiled = privateWeb3.eth.compile.solidity(words);
                              let smartSponsor = privateWeb3.eth.contract(srcCompiled.documentAccessMapping.info.abiDefinition);
                // const abi = JSON.parse(compiled.interface)
                // const bytecode = compiled.bytecode
                    fs.writeFile('/home/himanshu/Documents/project/ethereum/application/controller-service-layer/services/PrivateBlockchain/data.json', JSON.stringify(srcCompiled.documentAccessMapping.info.abiDefinition), 'utf-8', function(err, done) {
                        console.log("hi", err, done)
                    });
                //    var smartSponsor = privateWeb3.eth.contract(abi);

                    cb(srcCompiled.documentAccessMapping.code, smartSponsor, srcCompiled.documentAccessMapping.info.abiDefinition);
                }
            });


        }

        contractForAssets(ihash, res, callback) {
            //	Logger.info("privateWeb3.personal",privateWeb3.personal.newAccount);
        }

        // create a  smart contract
        smartContract(req, res, callback) {

            Logger.info("abiDefinition: ");
            let owner = req.body.owner;
            let password = req.body.password;
            // call a function to covert abi defination of contract
            this.convertToAbi((srcCompiled, smartSponsor, abi) => {
                Logger.info("smartSponsor: ", typeof smartSponsor);
                Logger.info("srcCompiled: ", typeof srcCompiled);
                this.unlockAccount(owner, password, 30, (error, result) => {
                    var gasUsed = privateWeb3.eth.estimateGas({
                        from: owner,
                        data: srcCompiled,
                    });
                    //  Logger.info("result: ---->", result);
                    var ss = smartSponsor.new({
                        from: owner,
                        data: srcCompiled,
                        gas: gasUsed
                    }, function(err, contract) {
                        if (err) {
                            console.error(err);
                            return;
                        } else if (contract.address) {
                            domain.Contract.query().insert({
                                contractAddress: contract.address,
                                transactionHash: contract.transactionHash,
                                abi: JSON.stringify(abi),
                                ethAddress: owner
                            }).then(function(databaseReturn) {
                                //    console.log("Inserted data: ", databaseReturn);
                                var arr = {};
                                arr.contractAddress = contract.address;
                                arr.gasUsed = gasUsed;
                                arr.contract = contract;
                                arr.InsertedData = databaseReturn;

                                //  Logger.info("contractAddress: ", arr);
                            });

                            var aAddress = contract.address;
                            var arr = {};

                            arr.contractAddress = aAddress;
                            arr.tranHash = contract.transactionHash;
                            Logger.info("contractAddress: ", arr);
                            callback(err, arr);
                        } else {
                            Logger.info("A transmitted, waiting for mining...");
                        }

                    });
                });
            });
        }

        selectForDataBase(contractAddress, cb) {
                domain.Contract.query().where({
                    'contractAddress': contractAddress
                }).select().then(function(data) {
                    //  console.log("Inserted data: ", data);
                    let contData = JSON.parse(JSON.stringify(data));
                    //  console.log("new data: ", contData);
                    cb(contData[0].abi);
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
            let fs = require('fs');
            this.selectForDataBase(contractAddress, (selectData) => {
                selectData = JSON.parse(selectData);


                let smartSponsor = privateWeb3.eth.contract(selectData);
                // console.log(smartSponsor);
                //      this.convertToAbi((srcCompiled, smartSponsor,abi) => {
                var abiDefinition = selectData;
                //       console.log(smartSponsor);
                var ss = smartSponsor.at(contractAddress);

                this.unlockAccount(adminAddress, password, 30, (error, result) => {
                    var data = {
                        method: method,
                        adminAddress: adminAddress,
                        accountAddress: accountAddress,
                        action: action
                    };
                    Logger.info(error, result);
                    contractMethordCall.contractMethodCall(method, adminAddress, accountAddress, action, ss, callback, textValue, contractAddress, req.body.val);
                });


                //    });

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
