'use strict';


class PublishContractData {
    //  constructor(){
    //    this.dataToPublish = [];
    //  }

    collectData() {
        return new Promise(function(resolve, reject) {
            let resData = {};
            //shkjshdkj
            domain.Contract.query().
            where("Published", "=", "n").limit(4).then((databaseReturn) => {

                if (!databaseReturn || databaseReturn.length <= 0) {
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
          try{
            let resData = {};
            let contractAddresses =[];

            let dataToPublish = [];
            console.log("dataReturn", data.length)
            async.forEach(data, (item, next) => {

     let current =   "extra data of transaction,"+item.fileHash +",http://localhost/block/"+item.id+ "|";

                for(let i=0;i < 25;i++){
                         dataToPublish.push(current);
                }
                  contractAddresses.push(item.contractAddress);
                next()
            }, (err) => {
                console.log("dataToPublish", dataToPublish.length);
                if (err) {
                    resData = {
                        message: "error in genrating JSON"
                    };
                    reject(resData);
                } else {
                //  console.log("dataToPublish", dataToPublish);
                    resData = {
                        data: dataToPublish,
                        addresses:contractAddresses
                    };

                  //  console.log("contractAddresses",contractAddresses);
                    resolve(resData);
                }
                //  cb(JSON.stringify(dataToPublish));
            });
          }catch(err){
            resolve(err);
          }

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
                //   var ss = smartSponsor.at("0x925d0a547e8ed929b0d4bfdbb64b3755cdb75ea9");
                //
                // ss.getData.call({
                //     from: "0x925d0a547e8ed929b0d4bfdbb64b3755cdb75ea9"
                // }, (err, data) => {
                //     Logger.info("getData: ", data);
                //
                //
                // });
                var contractData = smartSponsor.new.getData(dataJSON, {
                    from: privateWeb3.eth.coinbase,
                    data: bytecode
                });

                  console.log("privateWeb3.eth.coinbase");
                var estimate = privateWeb3.eth.estimateGas({
                    data: contractData
                })

                console.log("estimate-->", estimate," length of ",bytecode.length);
                var ss = smartSponsor.new(dataJSON, {
                    from: privateWeb3.eth.coinbase,//privateWeb3.eth.coinbase,
                    gas: estimate,
                    data: bytecode,
                  //  gasPrice:3000000000
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
                            contractaddress: contract.address,
                            contracttrans : contract.transactionHash
                        });
                    } else {
                        Logger.info("A transmitted, waiting for mining...",contract.transactionHash);
                        Logger.info(new Date());
                    }
                });
            } catch (err) {
                console.log(err);
            }
        });

    }

    updateTheDatabase(updateAddress,contractAddress){
      return new Promise((resolve, reject) => {
        let resData ={};
        console.log("contractAddress-->",updateAddress,contractAddress[0])
  //       .query()
  // .patch({lastName: 'Dinosaur'})
  // .where('age', '>', 60)
  // .then(function (numUpdated) {
        domain.Contract.query()
         .patch({'publishedAddress': updateAddress,'Published':'y'})
        .where('contractAddress','in', contractAddress).then((databaseReturn) => {
          if(!databaseReturn){
            resData = {data:databaseReturn};
            resolve(resData);
          }else{
            resData = {message:"data not updated"};
            reject(resData)
          }
        });
      });
    }

    callFunction() {
        console.log("Promise-->", Promise);
        var Json = {};
        var contractAddress =[];
        this.collectData().then((data) => {
                //  Logger.info("data111", data);

                return this.makeJsonData(data.data); //.bind(this, data.data);
                console.log("data is present", data.message)
            }).then((JSONdata) => {
                Json = JSON.stringify(JSONdata.data);
                contractAddress = JSONdata.addresses;
              //  console.log("Json is present", JSONdata,contractAddress)
                return this.createContractAbi();

            })
            .then((data) => {
                console.log("contract abi")
                return this.createContract(Json, "0x" + data.bytecode, data.abi);
            }).then((sucess) => {
                this.updateTheDatabase(sucess.contractaddress,contractAddress);
            //  console.log("contractAddress",sucess,contractAddress);
            }).then((updateSuccess) =>{
                console.log("updateSuccess",updateSuccess);
            })
            .catch((catchErr) => {
                Logger.info("catchErr", catchErr)
            });
    }

}

module.exports = new PublishContractData();
