'use strict';

class PrivateEthereumDetail {


    // get your account balance
    accountBalance(address, res, callback) {
        // dummyAddress="d275c1fe34f30713bdd2c7fa35475b4aa52e21ed";

        Logger.info("address=------>", address);

        privateWeb3.eth.getBalance(address, function(error, result) {
            if (!error) {
                var resData = {};
                resData.Balance = result.toNumber();
                callback(null, resData);
            } else {
                callback(error)
            }
        });

    }
    coinbaseBalance(res, callback) {
        privateWeb3.eth.getBalance(privateWeb3.eth.coinbase, function(error, result) {
            if (!error) {
                var resData = {};
                resData.Balance = result.toNumber();
                callback(null, resData);
            } else {
                callback(error)
            }
        });

    }

    requestConfirmation(req, res, callback) {
        var resData={};
            // var data={ tranHash:tx_result,confirm:0 };
            // redisClient.set(requestid,JSON.stringify(data), function(err,object){
            //     if(err){ console.log("adding set Error"); }
            //    else{ console.log("Added succesfully set"); console.log(object); }
            // });
            var requestid = req.params.requestid;
            redisClient.get(requestid, (err, object)=> {
                if (err) {
                    console.log("Getting Set Error");
                } else {
                    console.log("----Retrieving SET--");
                    object = JSON.parse(object);
                    console.log(object, typeof object);
                     if(object.confirm>=2){
                       resData.totalConfirmations = object.confirm;
                       callback(null,resData);
                     }else {
                        this.checkConfirmation(object.tranHash,(err,confirm) =>{
                          if(err){
                            callback(err,err);
                          }else {
                            var data={ tranHash:object.tranHash,confirm:confirm.totalConfirmations };
                            redisClient.set(requestid,JSON.stringify(data), (err,object) => {
                            if(err){ console.log("adding set Error"); }
                            else{ console.log("Added succesfully set"); console.log(object);
                              callback(null,confirm);
                          }
                            });
                          }
                        });

                     }
                    console.log("---End Retriving SET");
                }
            });
        }
        // transaction conformation for a block
    transactionConfirmations(tranxHash, res, callback) {
        // var dummytxHash="0x19a36234629a6a5692083438fbe2cc4b97eb98e42a9ed0211ff227f2a5dca32a";

        //Logger.info("transaction---", privateWeb3.eth.blockNumber - privateWeb3.eth.getTransaction(tranxHash).blockNumber);
        this.checkConfirmation(tranxHash, (err, confirm) => {
            if (err) {
                callback(err, err);
            } else {
                callback(err, confirm);
            }
        });
    }
    checkConfirmation(tranxHash, cb) {
            var resData = {};
            privateWeb3.eth.getBlock('latest', function(err, bestBlock) {
                if (!err) {
                    Logger.info("bestBlock--->", bestBlock);

                    privateWeb3.eth.getTransaction(tranxHash, function(error, blockByHash) {
                        if (!error) {
                            if (blockByHash != null) {
                                Logger.info("blockByHash", blockByHash.blockNumber, "  jjjjjjj  ", bestBlock.number);
                                var result = 0;
                                if (bestBlock.number && blockByHash.blockNumber != null) {
                                    result = bestBlock.number - blockByHash.blockNumber;
                                } else {
                                    result = 0;
                                }
                                resData.totalConfirmations = result;
                                //  resData.block = blockByHash;
                                //resData.latest = bestBlock.number;
                                cb(null, resData);
                                //callback(null, resData);
                            } else {

                                resData = new Error("cant get blockByHash");
                                resData.status = 500;
                                cb(resData, null);
                                //callback(resData,null);

                            }
                        } else {

                            resData = new Error("Issue with blockchain");
                            resData.status = 500;
                            cb(resData, null);
                            // callback(resData,null);
                        }
                    });

                } else {
                    resData = new Error("Issue with blockchain");
                    resData.status = 500;
                    cb(resData, null);
                    //callback(resData,null);
                }
            });
        }
        // function encrypt(buffer){
        //   var cipher = crypto.createCipher(algorithm,password)
        //   var crypted = Buffer.concat([cipher.update(buffer),cipher.final()]);
        //   return crypted;
        // }

    decrypt(buffer) {
            var password = 'oodles';

            var decipher = crypto.createDecipher('aes-256-cbc', password)
            var dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
            return dec;
        }
        // can get a transaction detail for the user
    transactionDetail(tranxHash, res, callback) {
        // var dummytxHash="0x19a36234629a6a5692083438fbe2cc4b97eb98e42a9ed0211ff227f2a5dca32a";
        var resData = {};
        privateWeb3.eth.getTransaction(tranxHash, (error, result) => {
            if (!error) {
                if (result != null) {
                    try {
                        Logger.info("Result--->", result);
                        console.log("data: ", privateWeb3.eth.getTransaction(tranxHash));
                        resData.transactionDetail = result;
                        if(result.input.slice(2).length>0){
                           var input=new Buffer(result.input.slice(2),'hex').toString('utf8');
                          //  resData.data=this.decrypt(input).toString('utf8');
                          resData.data=input;
                          console.log("input: ",input);
                         }else {
                          resData.data="";
                        }

                        callback(null, resData);
                    } catch (e) {
                        console.log(e);
                        resData = new Error("Error to read data");
                        resData.status = 409;

                        callback(resData, null);
                    }
                } else {
                    resData = new Error("Issue with blockchain");
                    resData.status = 500;

                    callback(resData, null);
                }
            } else {
                resData = new Error("Issue with blockchain");
                resData.status = 500;

                callback(resData, null);
            }
        });

    }

}

module.exports = new PrivateEthereumDetail();
