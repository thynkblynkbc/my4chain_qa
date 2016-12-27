'use strict ';

class ContractMethordCall {

    callEvent(ss, callback, data) {
        var event = ss.usersLog(function(error, result) {
            if (!error) {
                Logger.info("Event result", result.args);
                var arr = {};
                arr.txnHash = data;
                arr.result = result.args;
                callback(error, arr);
                event.stopWatching();
            } else {
                Logger.info("error", error);
                callback(error, result);
                event.stopWatching();
            }
        });
    }
    selectForDataBase(contractAddress, cb) {
        domain.Contract.query().where({
            'contractAddress': contractAddress
        }).select().then(function(data) {
            let contData = data;
            cb(contData[0].salt);
        });
    }
    MethodCallBack(err, data, ss, callback, methodName) {
        if (err) {
            Logger.info("error: ", err, data);
            callback(err, err);
            return;
        } else {
            Logger.info(methodName, data);
            Logger.info("event Call ------------");
            this.callEvent(ss, callback, data);
        }
    }
    encrypt(text, from, to, password) {
        var cipher = crypto.createCipher('aes-256-cbc', password);
        var crypted = cipher.update(text, from, to);
        crypted += cipher.final(to);
        return crypted;
    }
    contractLogSaveToDb(recordObj){
      domain.ContractLog.query().insert({
          contractAddress: recordObj.contractAddress,
          transactionHash: recordObj.txnHash,
          callerAddress: recordObj.adminAddress,
          action:recordObj.method
      }).then(function(databaseReturn) {
          //Logger.info("Inserted data: ", databaseReturn);
          // var arr = {};
          // arr.contractAddress = contract.address;
          // arr.txnHash = contract.transactionHash;
          // arr.gasUsed = gas;
          // //arr.tranHash = transactionHash;
          // Logger.info("contractAddress: ", arr.contractAddress);
          // callback(null, arr);
      });
    }

    decrypt(text, from, to, password) {
            var decipher = crypto.createDecipher('aes-256-cbc', password);
            var dec = decipher.update(text, from, to)
            dec += decipher.final(to);
            return dec;
        }
        // call different methord of smart contract
    contractMethodCall(recordObj, ss, callback, gas) {
        console.log("This is the action", recordObj.method);
        switch (recordObj.method) {
            case "getEther":
                ss.getEther({
                    from: recordObj.adminAddress,
                    gas: gas,
                    value: privateWeb3.toWei(20, 'ether')
                }, (err, data) => {
                    this.MethodCallBack(err, data, ss, callback, "getEther");
                });
                break;
            case "update":
                privateWeb3.personal.unlockAccount("0xdd27a0f0bc61c5a97cfbbdbfa28e2ca9181c4fa3", "password", 1000, (error, result) => {

                    if (error) {
                        callback(error, result);
                        return;
                    } else {
                        ss.update({
                            from: recordObj.adminAddress,
                            gas: gas
                        }, (err, data) => {
                            Logger.info("update: ", data);
                            callback(err, data);
                        });
                    }
                });
                break;
            case "usersLog":
                var event = ss.usersLog({
                    _from: recordObj.from,
                    _to: recordObj.to
                }, {
                    fromBlock: 0,
                    toBlock: 'latest'
                });
                // event.watch(function(error, result) {
                //
                // });
                var result = event.get(function(error, logs) {
                    callback(error, logs);
                });
                event.stopWatching();
                break;

            case "assignAction":
                //gasPrice: 11067000000000000
                ss.assignAction.estimateGas(recordObj.accountAddress, recordObj.action, {
                    from: recordObj.adminAddress
                }, (err, gasActual) => {
                    console.log("gasActual: ", gasActual);
                    if (!err) {
                        ss.assignAction(recordObj.accountAddress, recordObj.action, {
                            from: recordObj.adminAddress,
                            gas: gasActual
                        }, (err, data) => {
                            var resData = {};
                            resData.txnHash = data;
                            recordObj.txnHash=data;
                            this.contractLogSaveToDb(recordObj);
                            callback(null, resData);
                            //this.MethodCallBack(err, data, ss, callback, "assignAction");
                        });
                    } else {
                        callback(err, err);
                    }

                });
                break;
            case "getUserAction":
                ss.getUserAction.call(recordObj.accountAddress, {
                    from: recordObj.adminAddress,
                    gas: gas
                }, (err, data) => {
                    Logger.info("getUserAction: ", data);
                    var resData = {};
                    resData.userdetail = data;
                    callback(null, resData);

                });
                break;
            case "removeAction":
                Logger.info("inside remove action");
                ss.removeAction(recordObj.accountAddress, recordObj.action, {
                    from: recordObj.adminAddress,
                    gas: gas
                }, (err, data) => {
                  var resData = {};
                  resData.txnHash = data;
                  callback(null, resData);
                  //this.MethodCallBack(err, data, ss, callback, "");
                });
                break;
            case "acknowledge":
                ss.acknowledge({
                    from: recordObj.accountAddress,
                    gas: gas
                }, (err, data) => {
                  var resData = {};
                  resData.txnHash = data;
                  callback(null, resData);
                  //this.MethodCallBack(err, data, ss, callback, "acknowledge");
                });
                break;
            case "sign":
                ss.sign({
                    from: recordObj.accountAddress,
                    gas: gas
                }, (err, data) => {
                  var resData = {};
                  resData.txnHash = data;
                  callback(null, resData);
                    // this.MethodCallBack(err, data, ss, callback, "sign");
                });
                break;
            case "decline":
                ss.decline({
                    from: recordObj.accountAddress,
                    gas: gas
                }, (err, data) => {
                  var resData = {};
                  resData.txnHash = data;
                  callback(null, resData);
                    //this.MethodCallBack(err, data, ss, callback, "decline");
                });
                break;
            case "expire":
                ss.expire.call({
                    from: recordObj.accountAddress,
                    gas: gas
                }, (err, data) => {
                    Logger.info("expire: ", data);
                    var resData = {};
                    resData.isExpire = data;
                    callback(null, resData);
                });
                break;
            default:
                var arr = {};
                arr.message = "Method does not exit";
                callback(err, arr);
                break;

        }

    }


}

module.exports = new ContractMethordCall();
