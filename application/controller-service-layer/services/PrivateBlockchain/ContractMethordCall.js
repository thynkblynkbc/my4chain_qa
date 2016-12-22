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
        // call different methord of smart contract
    contractMethodCall(recordObj,ss,callback,gas){
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
            case "expire":
                ss.expire.call({
                    from: recordObj.adminAddress,
                    gas: gas
                }, (err, data) => {
                    Logger.info("expire: ", data);
                    callback(err, data);
                });
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
                          callback(null,resData);
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
                            callback(err, data);
                        });
                        break;
                    case "removeAction":
                        Logger.info("inside remove action"); ss.removeAction(recordObj.accountAddress, recordObj.action, {
                            from: recordObj.adminAddress,
                            gas: gas
                        }, (err, data) => {
                            this.MethodCallBack(err, data, ss, callback, "removeAction");
                        });
                        break;
                    case "acknowledge":
                        Logger.info("inside remove action"); ss.acknowledge({
                            from: recordObj.adminAddress,
                            gas: gas
                        }, (err, data) => {
                            this.MethodCallBack(err, data, ss, callback, "acknowledge");
                        });
                        break;
                    case "review":
                        console.log("value: ", typeof val, val); ss.review(val, {
                            from: recordObj.adminAddress,
                            gas: gas
                        }, (err, data) => {
                            this.MethodCallBack(err, data, ss, callback, "review");
                        });
                        break;
                    case "addInfo":
                        ss.addInfo(recordObj.accountAddress, {
                            from: recordObj.adminAddress,
                            gas: gas
                        }, (err, data) => {
                            Logger.info("addInfo: ", data);
                            callback(err, data);
                        });
                        break;
                    case "accept":
                        ss.accept(recordObj.accountAddress, {
                            from: recordObj.adminAddress,
                            gas: gas
                        }, (err, data) => {
                           var args ={};
                           args.txnHash =data;
                           Logger.info("accept: ", data);
                           callback(err, args)
                        });
                        break;
                    case "revoke":
                        ss.revoke(recordObj.accountAddress, recordObj.adminAddress, {
                            from: recordObj.adminAddress,
                            gas: gas
                        }, (err, data) => {
                            var args ={};
                            args.txnHash =data;
                            Logger.info("revoke: ", data);
                            callback(err, args);
                        });
                        break;
                    case "decline":
                        ss.decline(recordObj.accountAddress, {
                            from: recordObj.adminAddress,
                            gas: gas
                        }, (err, data) => {
                           var args ={};
                           args.txnHash =data;
                           Logger.info("decline: ", data);
                           callback(err, args)
                        });
                        break;
                    default:
                        var arr = {}; arr.message = "Method does not exit"; callback(err, arr);
                        break;

        }

    }


}

module.exports = new ContractMethordCall();
