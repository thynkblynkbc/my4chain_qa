'use strict';
class PrivateEthereumDetail {
    accountBalance(address, res, callback) {
        privateWeb3.eth.getBalance(address, function(error, result) {
            if (!error) {
                var resData = {};
                resData.Balance = privateWeb3.fromWei(result.toNumber(), 'ether');
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
                resData.Balance = web3.fromWei(result.toNumber(), 'ether');
                callback(null, resData);
            } else {
                callback(error)
            }
        });
    }
    requestConfirmation(req, res, callback) {
        var resData = {};
        var requestid = req.params.requestid;
        redisClient.get(requestid, (err, object) => {
            if (err) {
                console.log("Getting Set Error");
            } else {
                console.log("----Retrieving SET--");
                object = JSON.parse(object);
                console.log(object, typeof object);
                if (object.confirm >= 2) {
                    resData.totalConfirmations = object.confirm;
                    callback(null, resData);
                } else {
                    this.checkConfirmation(object.tranHash, (err, confirm) => {
                        if (err) {
                            callback(err, err);
                        } else {
                            var data = {
                                tranHash: object.tranHash,
                                confirm: confirm.totalConfirmations
                            };
                            redisClient.set(requestid, JSON.stringify(data), (err, object) => {
                                if (err) {
                                    console.log("adding set Error");
                                } else {
                                    console.log("Added succesfully set");
                                    console.log(object);
                                    callback(null, confirm);
                                }
                            });
                        }
                    });
                }
                console.log("---End Retriving SET");
            }
        });
    }
    transactionConfirmations(tranxHash, res, callback) {
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
                            cb(null, resData);
                        } else {
                            resData.totalConfirmations = 0;
                            resData.message = "Block hash not genrated"
                            cb(null, resData);
                        }
                    } else {
                        resData = new Error(configurationHolder.errorMessage.blockchainIssue);
                        resData.status = 500;
                        cb(resData, null);
                    }
                });
            } else {
                resData = new Error(configurationHolder.errorMessage.blockchainIssue);
                resData.status = 500;
                cb(resData, null);
            }
        });
    }
    decrypt(buffer) {
        var password = 'oodles';
        var decipher = crypto.createDecipher('aes-256-cbc', password)
        var dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
        return dec;
    }
    // can get a transaction detail for the user
    transactionDetail(tranxHash, res, callback) {
        var resData = {};
        privateWeb3.eth.getTransaction(tranxHash, (error, result) => {
            if (!error) {
                Logger.info('tx detail : ', result);
                resData.transactionDetail = result;
                callback(null, resData);
            } else {
                resData.message = 'No data with this transactionHash';
                callback(resData, null);
            }
        })
    }
}
module.exports = new PrivateEthereumDetail();
