'use strict';
var contractMethordCall = require('./ContractPartyMethordCall');
class PrivateEthereumPartyService {


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
        fs.readFile(__dirname + '/twoParty.sol', 'utf8', function(err, solidityCode) {
        // fs.readFile(__dirname + '/orcalize.sol', 'utf8', function(err, solidityCode) {
       // fs.readFile(__dirname + '/decline.sol', 'utf8', function(err, solidityCode) {
            if (err) {
                console.log("error in reading file: ", err);
                return;
            } else {

                 Logger.info("File Path: ", __dirname + '/twoParty.sol');
                // Logger.info("File Path: ", __dirname + '/orcalize.sol');
                //Logger.info("File Path: ", __dirname + '/decline.sol');
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
    smartPartyContract(req, res, callback) {
        let owner = req.body.owner;
        let password = req.body.password;
        let to = req.body.to;
        hjdhs
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
                            this.createContract(smartSponsor, owner,to, bytecode, gas, abi, callback);
                        }
                    });
                }
            });
        });
    }
    createContract(smartSponsor, owner,to, bytecode, gas, abi, callback) {
        Logger.info("-----Contract creation party ----------", gas);
        var contractData = privateWeb3.eth.contract(abi).new.getData({data: bytecode});
        console.log("estimating gas price of creating B...");
        var gasEstimate = privateWeb3.eth.estimateGas({data: bytecode});
        console.log(gasEstimate);
        var ss = smartSponsor.new(owner , to , {
            from: owner,
            data: bytecode,
            gas: gas+400000

          //  gasPrice: 1106700000000,
        }, (err, contract) => {
            if (err) {
                console.error(err);
                callback(err, err);
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


    saveToDb(contractAddress, transactionHash, abi, owner, bytecode, gas, callback) {
        domain.Contract.query().insert({
            contractAddress: contractAddress,
            transactionHash: transactionHash,
            abi: JSON.stringify(abi),
            ethAddress: owner,
            bytecode: bytecode
        }).then(function(databaseReturn) {
            //Logger.info("Inserted data: ", databaseReturn);
            var arr = {};
            arr.contractAddress = contractAddress;
            arr.txnHash = transactionHash;
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
    sponsorPartyContract(req, res, callback) {
        let contractAddress = req.body.contractAddress;
        let accountAddress = req.body.accountAddress;
        let adminAddress = req.body.adminAddress;
        let password = req.body.password;
        let action = req.body.action;
        let method = req.body.method;
        let textValue = req.body.textValue;
        let partyAddress = req.body.partyAddress;
        console.log("Inside spnosor the contract function",req.body);
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
                            contractMethordCall.contractMethodCall(method, adminAddress, accountAddress,partyAddress, action, ss, callback, textValue, contractAddress, req.body.val, gas, req.body);
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
            arr.encrypt = this.encrypt(secondHash, 'hex', 'hex');
            arr.decrypt = this.decrypt(arr.encrypt, 'hex', 'hex');
            callback(null, arr);
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
    encrypt(text, from, to) {
        var password = 'oodles';
        var cipher = crypto.createCipher('aes-256-cbc', password);
        var crypted = cipher.update(text, from, to);
        crypted += cipher.final(to);
        return crypted;
    }

    decrypt(text, from, to) {
        var password = 'oodles';
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
        var data=reqData.data;
        var duration = 30;
        var resData = {};
        Logger.info("gas needed");
      //  var data = 'Imroz created a transaction';
        var encrypted = this.encrypt(data, 'utf8', 'hex');
        var decrypted = this.decrypt(encrypted, 'hex', 'utf8');
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

module.exports = new PrivateEthereumPartyService();