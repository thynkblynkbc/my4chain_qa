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
    contractMethodCall(method, adminAddress, accountAddress, action, ss, callback, textValue, conAddress, val, gas, reqObj) {
        console.log("This is the action", method);
        switch (method) {
            case "update":
                PrivateEthereumService.unlockAccount("0xdd27a0f0bc61c5a97cfbbdbfa28e2ca9181c4fa3","password", 30, (error, result) => {
                         if (error) {
                             callback(error, result);
                             return;
                         } else {
                            ss.update({
                                from: adminAddress,
                                gas: gas
                            }, (err, data) => {
                                Logger.info("update: ", data);
                                callback(err, data);
                            });
                          }
                    })
                    break;
                    case "usersLog":
                        var event = ss.usersLog({
                            _from: reqObj.from,
                            _to: reqObj.to
                        }, {
                            fromBlock: 0,
                            toBlock: 'latest'
                        });
                        // event.watch(function(error, result) {
                        //
                        // });
                        var result = event.get(function(error, logs) {
                            callback(error, logs);
                        }); event.stopWatching();
                        break;
                    case "expire":
                        ss.expire.call({
                            from: adminAddress,
                            gas: gas
                        }, (err, data) => {
                            Logger.info("expire: ", data);
                            callback(err, data);
                        });
                        break;
                    case "assignAction":
                        //gasPrice: 11067000000000000
                        ss.assignAction(accountAddress, action, {
                            from: adminAddress,
                            gas: gas
                        }, (err, data) => {
                            this.MethodCallBack(err, data, ss, callback, "assignAction");
                        });
                        break;
                    case "getUserAction":
                        ss.getUserAction.call(accountAddress, {
                            from: adminAddress,
                            gas: gas
                        }, (err, data) => {
                            Logger.info("getUserAction: ", data);
                            callback(err, data);
                        });
                        break;
                    case "removeAction":
                        Logger.info("inside remove action"); ss.removeAction(accountAddress, action, {
                            from: adminAddress,
                            gas: gas
                        }, (err, data) => {
                            this.MethodCallBack(err, data, ss, callback, "removeAction");
                        });
                        break;
                    case "acknowledge":
                        Logger.info("inside remove action"); ss.acknowledge({
                            from: adminAddress,
                            gas: gas
                        }, (err, data) => {
                            this.MethodCallBack(err, data, ss, callback, "acknowledge");
                        });
                        break;
                    case "review":
                        console.log("value: ", typeof val, val); ss.review(val, {
                            from: adminAddress,
                            gas: gas
                        }, (err, data) => {
                            this.MethodCallBack(err, data, ss, callback, "review");
                        });
                        break;
                    case "addInfo":
                        ss.addInfo(accountAddress, {
                            from: adminAddress,
                            gas: gas
                        }, (err, data) => {
                            Logger.info("addInfo: ", data);
                            callback(err, data);
                        });
                        break;
                    case "accept":
                        ss.accept(accountAddress, {
                            from: adminAddress,
                            gas: gas
                        }, (err, data) => {
                            Logger.info("addInfo: ", data);
                            callback(err, data);
                        });
                        break;
                    case "revoke":
                        ss.revoke(accountAddress, adminAddress, {
                            from: adminAddress,
                            gas: gas
                        }, (err, data) => {
                            Logger.info("revoke: ", data);
                            callback(err, data);
                        });
                        break;
                    case "decline":
                        ss.decline(accountAddress, {
                            from: adminAddress,
                            gas: gas
                        }, (err, data) => {
                            Logger.info("revoke: ", data);
                            callback(err, data);
                        });
                        break;
                    default:
                        var arr = {}; arr.message = "Method does not exit"; callback(err, arr);
                        break;
                }

        }


    }

    module.exports = new ContractMethordCall();
