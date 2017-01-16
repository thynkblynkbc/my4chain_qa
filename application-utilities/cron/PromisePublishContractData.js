'use strict';


class PublishContractData {
    //  constructor(){
    //    this.dataToPublish = [];
    //  }

    collectData() {
        return new Promise(function(resolve, reject) {
            let resData = {};
            domain.Contract.query().
            where("Published", "=", "n").limit(4).then((databaseReturn) => {

                if (!databaseReturn) {
                    //    Logger.info("error in data");
                    resData.message = "No data found";
                    reject(resData);
                } else {
                    //  Logger.info("Data is found",resData);
                    resData.message = "data found";
                    resData.data = databaseReturn;
                    resolve(resData);
                }

            });
        });
    }

    makeJsonData(data) {
        return new Promise((resolve, reject) => {
            let resData = {};

            let dataToPublish = [];
            console.log("dataReturn", data.length)
            async.forEach(data, (item, next) => {

                let current = item.contractAddress + "," + item.senderAddress + "," + item.fileHash + "|";
                dataToPublish.push(current);
                next()
            }, (err) => {
                console.log("dataToPublish", dataToPublish);
                if (err) {
                    resData = {
                        message: "error in genrating JSON"
                    };
                    reject(resData);
                } else {

                    resData = {
                        data: dataToPublish
                    };
                    //  console.log("resData",resData);
                    resolve(resData);
                }
                //  cb(JSON.stringify(dataToPublish));
            });

        });
    }
    createContractAbi() {
        return new Promise((resolve, reject) => {
            fs.readFile('./solidity/publicFileStorage.sol', 'utf8', (err, solidityCode) => {
                if (err) {
                    console.log("error in reading file: ", err);

                    reject({
                        message: "error in reading file"
                    })
                } else {
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
                    //  cb(solAbi, "0x"+solBytecode,smartSponsor);

                }
            });

        });
    }



    createContract(dataJSON, bytecode, abi) {
        return new Promise((resolve, reject) => {
            try {
                var smartSponsor = privateWeb3.eth.contract(abi);
                  var ss = smartSponsor.at("0x925d0a547e8ed929b0d4bfdbb64b3755cdb75ea9");

                ss.getData.call({
                    from: "0x925d0a547e8ed929b0d4bfdbb64b3755cdb75ea9"
                }, (err, data) => {
                    Logger.info("getData: ", data);


                });
                var contractData = smartSponsor.new.getData(dataJSON, {
                    from: "0xe908c0a14ff6cc5e46c0ada652af2c193b1191b1",
                    data: bytecode
                });
                var estimate = privateWeb3.eth.estimateGas({
                    data: contractData
                })

                console.log("estimate-->", estimate);
                var ss = smartSponsor.new(dataJSON, {
                    from: "0xe908c0a14ff6cc5e46c0ada652af2c193b1191b1",
                    gas: estimate,
                    data: bytecode
                }, (err, contract) => {
                    Logger.info("createContract");
                    if (err) {
                        console.error(err);
                        //callback(err, err);
                        reject({
                            message: "error in contract creation."
                        });
                    } else if (contract.address) {
                        Logger.info("contract address : ", contract.address);
                        resolve({
                            contractData: contract
                        });
                    } else {
                        Logger.info("A transmitted, waiting for mining...");
                        Logger.info(new Date());
                    }
                });
            } catch (err) {
                console.log(err);
            }
        });

    }

    callFunction() {
        console.log("Promise-->", Promise);
        var Json = {};
        this.collectData().then((data) => {
                //  Logger.info("data111", data);

                return this.makeJsonData(data.data); //.bind(this, data.data);
                console.log("data is present", data.message)
            }).then((JSONdata) => {
                Json = JSON.stringify(JSONdata.data);
                console.log("Json is present", JSONdata)
                return this.createContractAbi();

            })
            .then((data) => {
                console.log("contract abi")
                return this.createContract(Json, "0x" + data.bytecode, data.abi);
            })
            .catch(function(catchErr) {
                Logger.info("catchErr", catchErr)
            })
    }

}

module.exports = new PublishContractData();
