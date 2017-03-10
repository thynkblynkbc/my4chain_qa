'use strict';

class PrivateEthereumExtra {

    constructor() {

    }
    privateImageHashGenerate(req, res, callback) {
        var key = 'oodles';
        var algorithm = 'sha256';
        var imagePath = req.files.file.path;
        // step 1 -------------Generate hash of image

        fs.readFile(imagePath, (err, imageData) => {
            var firstHash = crypto.createHmac(algorithm, key).update(imageData).digest('hex');
            Logger.info("hash of image: ", firstHash);

            // step 2 -------Generate
            var secondkey = '1234';
            var secondHash = crypto.createHmac(algorithm, secondkey).update(firstHash).digest('hex');
            Logger.info("secondHash: ", secondHash);

            var arr = {};
            arr.secondHash = secondHash;
            arr.encrypt = utility.encrypt(secondHash, 'hex', 'hex', 'oodles');
            arr.decrypt = utility.decrypt(arr.encrypt, 'hex', 'hex', 'oodles');
            callback(null, arr);
        });
    }

    fileHashToContract(fileHash, recordObj, callback) {
        let contractAddress = recordObj.contractAddress;
        let adminAddress = recordObj.adminAddress;
        let password = recordObj.password;
        console.log("Inside spnosor the contract function");
        utility.selectForDataBase(contractAddress, (selectData, bytecode, salt) => {
            selectData = JSON.parse(selectData);
            let smartSponsor = privateWeb3.eth.contract(selectData);
            var ss = smartSponsor.at(contractAddress);
            Logger.info("Unlock Account ----------------");
            utility.unlockAccount(adminAddress, password, 30, (error, result) => {
                if (error) {
                    callback(error, result);
                    return;
                } else {
                    utility.estimateGas(adminAddress, bytecode, (error, gas) => {
                        if (error) {
                            callback(error, gas);
                            return;
                        } else {
                            // method execution on contract
                            //callback(null,fileHash);
                            // var input=new Buffer(result.input.slice(2),'hex');
                            // resData.data=utility.decrypt(input).toString('utf8');
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


    storeRequestConfirmation(requestid, tx_result) {
        // redisClient.hmset(requestid,tx_result,0,function(err,object){
        //   if(err){ console.log("adding Hmset Error"); }
        //   else{ console.log("Added succesfully"); console.log(object); }
        // });
        var data = {
            tranHash: tx_result,
            confirm: 0
        };
        redisClient.set(requestid, JSON.stringify(data), function(err, object) {
            if (err) {
                console.log("adding set Error");
            } else {
                console.log("Added succesfully set");
                console.log(object);
            }
        });
        redisClient.get(requestid, function(err, object) {
            if (err) {
                console.log("Getting Set Error");
            } else {
                console.log("----Retrieving SET--");
                object = JSON.parse(object);
                console.log(object, typeof object);
                console.log("---End Retriving SET");
            }
        });
    }

}

module.exports = new PrivateEthereumExtra();
