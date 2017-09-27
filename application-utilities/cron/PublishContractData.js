'use strict';
class PublishContractData {
    collectData(cb) {
        let resData = {};
        domain.Contract.query().
        where("Published", "=", "n").andWhere("contractAddress", "!=", "NaN").limit(4).then((databaseReturn) => {
            if (!databaseReturn) {
                Logger.info("error in data");
                resData.message = "No data found";
                cb(resData, null);
            } else {
                resData.message = "data found";
                cb(null, resData);
            }
        });
    }
    makeJsonData(cb) {
        let dataToPublish = [];
        this.collectData((eror, data) => {
            if (!data) {} else {
                Logger.info("dataReturn", data.length)
                async.forEach(data, (item, next) => {
                    let current = item.contractAddress + "," + item.senderAddress + "," + item.fileHash + "|";
                    dataToPublish.push(current);
                    next()
                }, (err) => {
                    Logger.info("Data ");
                    cb(JSON.stringify(dataToPublish));
                });
            }
        });
    }
    createContract(smartSponsor, recordObj, bytecode, gas, abi, callback) {
        Logger.info("recordObj: ", recordObj);
        this.makeJsonData((dataJSON) => {
            this.createContractAbi((abi, bytecode, contractObject) => {
                var contractData = contractObject.new.getData(dataJSON, {
                    from: "0xe908c0a14ff6cc5e46c0ada652af2c193b1191b1",
                    data: bytecode
                });
                var estimate = privateWeb3.eth.estimateGas({
                    data: contractData
                })
                Logger.info("estimate", estimate);
                var ss = contractObject.new(dataJSON, {
                    from: "0xe908c0a14ff6cc5e46c0ada652af2c193b1191b1",
                    gas: estimate,
                    data: bytecode
                }, (err, contract) => {
                    if (err) {
                        console.error(err);
                        return;
                    } else if (contract.address) {
                        Logger.info("contract address : ", contract.address);
                    } else {
                        Logger.info("A transmitted, waiting for mining...");
                        Logger.info(new Date());
                    }
                });
            });
        });
    }
    createContractAbi(cb) {
        fs.readFile('./solidity/publicFileStorage.sol', 'utf8', function(err, solidityCode) {
            if (err) {
                console.log("error in reading file: ", err);
                return;
            } else {
                Logger.info("-----compling solidity code ----------");
                try {
                    var compiled = solc.compile(solidityCode, 1).contracts.publicTransaction;
                    let solAbi = JSON.parse(compiled.interface);
                    let solBytecode = compiled.bytecode;
                    Logger.info("-----complile complete ----------");
                    Logger.info(new Date());
                    let smartSponsor = privateWeb3.eth.contract(solAbi);
                    cb(solAbi, "0x" + solBytecode, smartSponsor);
                } catch (e) {
                    if (e) {
                        Logger.info(e);
                        console.log("error:", e);
                    }
                }
            }
        });
    }
}
module.exports = new PublishContractData();
