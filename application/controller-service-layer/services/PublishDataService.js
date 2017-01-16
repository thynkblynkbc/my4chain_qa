'use strict';
var utility = require('./PrivateBlockchain/PrivateEthereumUtilities');
class PublishDataService {
    // send data in global
    convertToAbi(cb) {
        var filePath = publicdir + '/solidity/publicFileStorage.sol';
        fs.readFile(filePath, 'utf8', function(err, solidityCode) {
            if (err) {
                console.log("error in reading file: ", err);
                return;
            } else {
                Logger.info("File Path: ", filePath);
                Logger.info(new Date());
                Logger.info("-----compling solidity code ----------");
                Logger.info(new Date());
                var compiled = solc.compile(solidityCode, 1).contracts.publicTransaction;
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
    sendData(req, res, callback) {
        var recordObj = req.body;
        var resData = {};
        // call a function to covert abi defination of contract
        this.convertToAbi((bytecode, smartSponsor, abi) => {
            Logger.info("Unlocking account -----------");
            Logger.info(new Date());
            utility.unlockAccount(recordObj.owner, recordObj.password, 30, (error, result) => {
                if (error) {
                    console.log(error)
                    resData = new Error("Issue with blockchain");
                    resData.status = 500;
                    callback(resData, null);
                    return;
                } else {
                    Logger.info(new Date());
                    Logger.info("unlocked");
                    utility.estimateGas(recordObj.owner, bytecode, (error, gas) => {
                        if (error) {
                            resData = new Error("Issue with blockchain");
                            resData.status = 500;
                            callback(resData, null);
                        } else {
                            this.createContract(smartSponsor, recordObj, bytecode, gas, abi, callback);
                        }
                    });
                }
            });
        });
    }
    createContract(smartSponsor, recordObj, bytecode, gas, abi, callback) {
        console.log("recordObj: ", recordObj);
        recordObj.salt = uuid.v1(); // hard coded
        recordObj.recipient = recordObj.owner; // hard coded
        var ss = smartSponsor.new({
            from: recordObj.owner,
            gas: gas,
            data: bytecode
                     }, (err, contract) => {
            if (err) {
                console.error(err);
                callback(err, err);
                return;
            } else if (contract.address) {
                Logger.info("contract address : ", contract.address);
                recordObj.contractAddress = contract.address;
                recordObj.contractTransaction = contract.transactionHash;
                this.saveContractData(ss, recordObj, callback);
                this.saveToDb(contract, abi, recordObj, bytecode, gas, callback);
            } else {
                Logger.info("A transmitted, waiting for mining...");
                Logger.info(new Date());
            }
        });
    }
    saveContractData(ss, recordObj, callback) {
        this.loadData((data) => {
            console.log("data: ", typeof data, data.length, data, JSON.stringify(data));
            recordObj.data = JSON.stringify(data);
            console.log("recordObj.data: ", recordObj.data.length);
            ss.setData.estimateGas(recordObj.data, {
                from: recordObj.owner
            }, (err, gasActual) => {
                console.log("gasActual: ", gasActual,err);
                if (!err) {
                    ss.setData(recordObj.data, {
                        from: recordObj.owner,
                        gas: gasActual,
                        gasPrice:0
                    }, (err, data) => {
                        var resData = {};
                        resData.txnHash = data;
                        resData.contractAddress = recordObj.contractAddress;
                        resData.contractTransaction = recordObj.contractTransaction;
                        Logger.info("txnHash of setData with contractAddress: ", resData);
                        callback(null, resData);
                    });
                } else {
                    callback(err, err);
                }
            });
        });
    }
    loadData(cb) {
        var data = [];
        for (var i = 1; i <= 253; i++) {
            var current = {
          "contractData":  "0x2ac5aa61a996081cbe6a575bbdf1351255417219||0xec23355d5fcf2d5dca37675ad37f4dd7343e746ebbc23450d2dec4632d364beb||0xdd27a0f0bc61c5a97cfbbdbfa28e2ca9181c4fa3||http://www.my4chain.com?contractAddress=0x2ac5aa61a996081cbe6a575bbdf1351255417219",
          }
            data.push(current);
            if (i == 253) {
                cb(data);
            }
        }
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
            startTime: knex.fn.now(),
            endTime: knex.fn.now()
        }).then(function(databaseReturn) {
            //Logger.info("Inserted data: ", databaseReturn);
            var arr = {};
            arr.contractAddress = contract.address;
            arr.txnHash = contract.transactionHash;
            arr.gasUsed = gas;
            //arr.tranHash = transactionHash;
            Logger.info("db contractAddress: ", arr.contractAddress);
            // callback(null, arr);
        });
    }
    getData(req, res, callback) {
        console.log("req.query.contractAddress: ", req.query.contractAddress);
        utility.selectForDataBase(req.query.contractAddress, (selectData, bytecode, salt) => {
            selectData = JSON.parse(selectData);
            let smartSponsor = privateWeb3.eth.contract(selectData);
            var ss = smartSponsor.at(req.query.contractAddress);
            this.getContractData(ss, callback);
        });
    }
    getContractData(ss, callback) {
        ss.getData.call((err, data) => {
            Logger.info("getUserAction: ", data.length);
            var resData = {};
            resData.userdetail = JSON.parse(data);
            callback(null, resData);
        });
    }
}

module.exports = new PublishDataService();
