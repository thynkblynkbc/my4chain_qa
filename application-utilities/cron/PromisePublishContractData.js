'use strict';
class PublishContractData {
    collectData() {
        return new Promise(function(resolve, reject) {
            let resData = {};
            Logger.info("Promise-->");
            domain.Contract.query().
            where("Published", "=", "n").limit(4).then((databaseReturn) => {
                if (!databaseReturn || databaseReturn.length <= 0) {
                    resData.message = "No data found";
                    reject(resData);
                } else {
                    resData.message = "data found";
                    resData.data = databaseReturn;
                    resolve(resData);
                }
            });
        });
    }
    makeJsonData(data) {
        return new Promise((resolve, reject) => {
            try {
                let resData = {};
                let contractAddresses = [];
                let dataToPublish = [];
                Logger.info("dataReturn", data.length)
                async.forEach(data, (item, next) => {
                    let current = "extra data of transaction," + item.fileHash + ",http://localhost/block/" + item.id + "|";
                    dataToPublish.push(current);
                    contractAddresses.push(item.contractAddress);
                    next()
                }, (err) => {
                    Logger.info("dataToPublish", dataToPublish.length);
                    if (err) {
                        resData = {
                            message: "error in genrating JSON"
                        };
                        reject(resData);
                    } else {
                        resData = {
                            data: dataToPublish,
                            addresses: contractAddresses
                        };
                        resolve(resData);
                    }
                });
            } catch (err) {
                resolve(err);
            }
        });
    }
    createContractAbi() {
        return new Promise((resolve, reject) => {
            fs.readFile('./solidity/publicFileStorage.sol', 'utf8', (err, solidityCode) => {
                if (err) {
                    Logger.info("error in reading file: ", err);
                    reject({
                        message: "error in reading file"
                    })
                } else {
                    try {
                        Logger.info("-----compling solidity code ----------");
                        var compiled = solc.compile(solidityCode, 1).contracts.publicTransaction;
                        let solAbi = JSON.parse(compiled.interface);
                        let solBytecode = compiled.bytecode;
                        Logger.info("-----complile complete ----------");
                        Logger.info(new Date());
                        let smartSponsor = privateWeb3.eth.contract(solAbi);
                        resolve({
                            abi: solAbi,
                            bytecode: solBytecode
                        });
                    } catch (err) {
                        reject({
                            message: err
                        })
                    }
                }
            });
        });
    }
    createContract(dataJSON, bytecode, abi) {
        return new Promise((resolve, reject) => {
            try {
                var smartSponsor = privateWeb3.eth.contract(abi);
                var contractData = smartSponsor.new.getData(dataJSON, {
                    from: privateWeb3.eth.coinbase,
                    data: bytecode
                });
                Logger.info("privateWeb3.eth.coinbase");
                var estimate = privateWeb3.eth.estimateGas({
                    data: contractData
                })
                Logger.info("estimate-->", estimate, " length of ", bytecode.length);
                var ss = smartSponsor.new(dataJSON, {
                    from: privateWeb3.eth.coinbase,
                    gas: estimate,
                    data: bytecode,
                }, (err, contract) => {
                    Logger.info("createContract");
                    if (err) {
                        console.error(err);
                        reject({
                            message: "error in contract creation."
                        });
                    } else if (contract.address) {
                        Logger.info("contract address : ", contract.address);
                        resolve({
                            contractaddress: contract.address,
                            contracttrans: contract.transactionHash
                        });
                    } else {
                        Logger.info("A transmitted, waiting for mining...", contract.transactionHash);
                        Logger.info(new Date());
                    }
                });
            } catch (err) {
                Logger.info(err);
            }
        });
    }
    updateTheDatabase(updateAddress, contractAddress) {
        return new Promise((resolve, reject) => {
            let resData = {};
            Logger.info("contractAddress-->", updateAddress, contractAddress[0])
            domain.Contract.query()
                .patch({
                    'publishedAddress': updateAddress,
                    'Published': 'y'
                })
                .where('contractAddress', 'in', contractAddress).then((databaseReturn) => {
                    if (!databaseReturn) {
                        resData = {
                            data: databaseReturn
                        };
                        resolve(resData);
                    } else {
                        resData = {
                            message: "data not updated"
                        };
                        reject(resData)
                    }
                });
        });
    }
    callFunction() {
        Logger.info("Promise-->");
        var Json = {};
        var contractAddress = [];
        this.collectData().then((data) => {
                Logger.info("Promise-->");
                return this.makeJsonData(data.data);
                Logger.info("data is present", data.message)
            }).then((JSONdata) => {
                Json = JSON.stringify(JSONdata.data);
                contractAddress = JSONdata.addresses;
                return this.createContractAbi();
            })
            .then((data) => {
                Logger.info("contract abi")
                return this.createContract(Json, "0x" + data.bytecode, data.abi);
            }).then((sucess) => {
                this.updateTheDatabase(sucess.contractaddress, contractAddress);
            }).then((updateSuccess) => {
                Logger.info("updateSuccess", updateSuccess);
            })
            .catch((catchErr) => {
                Logger.info(catchErr)
            });
    }
}
module.exports = new PublishContractData();
