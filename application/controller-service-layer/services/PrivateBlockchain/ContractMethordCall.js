'use strict ';

class ContractMethordCall {

  constructor (){

    this.rolesInt ={};
    this.rolesInt["CAN_ASSIGN"] = 1;
    this.rolesInt["CAN_REVOKE"] =2;
    this.rolesInt["CAN_ACCEPT"] = 3;
    this.rolesInt["CAN_DECLINE"] = 4;
    this.rolesInt["CAN_REVIEW"] = 5;
    this.rolesInt["CAN_ACK"] =6;
  }
  covertStringRoleToInt(roles ,funcallback){
    console.log("roles",roles);
     let strRole = [];
     if(roles.length > 0){
     async.forEach(roles,(item,callback)=>{
       strRole.push(this.rolesInt[item]);
       callback();
     },(err)=>{
       console.log(strRole);
       funcallback(strRole);


     })
   }else{
     funcallback(strRole);
   }

  }
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
          callerAddress: recordObj.accountAddress,
          action:recordObj.action
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
    contractMethodCall(recordObj, ss, callback) {
      var gas =300000;
        console.log("This is the action", recordObj.method);
        switch (recordObj.action) {
            case "getData":
                ss.getData.call({
                    from: recordObj.adminAddress,
                    gas: gas
                }, (err, data) => {
                    Logger.info("getUserAction: ", data);
                    var resData = {};
                    resData.userdetail = data;
                    callback(null, resData);
                });
                break;
            case "setData":
                fs.readFile(publicdir + '/solidity/data.txt', 'utf8', function(err, data) {
                 if (err) {
                         console.log("error in reading file: ", err);
                         return;
                     } else {
                       console.log("data: ",typeof data,data.length,data,JSON.stringify(data));
                       recordObj.data=JSON.stringify(data);
                        console.log("recordObj.data: ",recordObj.data.length);
                        ss.setData.estimateGas(recordObj.data, {
                            from: recordObj.adminAddress
                        }, (err, gasActual) => {
                            console.log("gasActual: ", gasActual);
                            if (!err) {
                                ss.setData(recordObj.data, {
                                    from: recordObj.adminAddress,
                                    gas: gasActual
                                }, (err, data) => {
                                    var resData = {};
                                    resData.txnHash = data;
                                    callback(null, resData);
                                });
                            } else {
                                callback(err, err);
                            }
                        });
                      }
                  });

                break;
            case "getEther":
                ss.getEther({
                    from: recordObj.adminAddress,
                    gas: gas,
                    value: privateWeb3.toWei(20, 'ether')
                }, (err, data) => {
                    this.MethodCallBack(err, data, ss, callback, "getEther");
                });
                break;
            case "usersLog":
            Logger.info("from",recordObj.from,"to  ",recordObj.to);
                 recordObj.from=recordObj.from?recordObj.from:"";
                 recordObj.to=recordObj.to?recordObj.to:"";
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
                  var logError = {};
                //  console.log("error",error,logs)
                  if(logs.length <= 0){
                    logError.object = "No log for this from and to account . Please remove from and to if you don't known."
                    callback(null, logError);
                  }else{
                      callback(error, logs);
                  }
                });
                event.stopWatching(function(err,data){
                  console.log("error in stop watching");
                });
                break;
              case "modifierLog":
                Logger.info("from",recordObj.from,"to  ",recordObj.to);
                     recordObj.from=recordObj.from?recordObj.from:"";
                    // recordObj.to=recordObj.to?recordObj.to:"";
                    var event = ss.fileModifyLog({
                        _from: recordObj.from
                  //      ,_to: recordObj.to
                    }, {
                        fromBlock: 0,
                        toBlock: 'latest'
                    });
                    // event.watch(function(error, result) {
                    //
                    // });
                    var result = event.get(function(error, logs) {
                      var logError = {};
                    //  console.log("error",error,logs);
                      if(logs.length <= 0){
                        logError.object = "No log for this from and to account . Please remove from and to if you don't known."
                        callback(null, logError);
                      }else{
                          callback(error, logs);
                      }
                    });
                    event.stopWatching(function(err,data){
                      console.log("error in stop watching");
                    });
                    break;

            case "assignAction":
                //gasPrice: 11067000000000000
                  console.log("gasActual: ",recordObj.memberAddress);
                  this.covertStringRoleToInt(recordObj.role,(intArray)=>{
                    var resData = {};
                ss.assignAction.estimateGas(recordObj.memberAddress, intArray, {
                    from: recordObj.accountAddress
                }, (err, gasActual) => {
                    console.log("gasActual: ", gasActual);
                    if (!err) {
                        ss.assignAction(recordObj.memberAddress, intArray, {
                            from: recordObj.accountAddress,
                            gas: gasActual
                        }, (err, data) => {
                          if(!err){
                          //console.log("err",err,"data",data)

                            resData.txnHash = data;
                            recordObj.txnHash = data;
                            this.contractLogSaveToDb(recordObj);
                            callback(null, resData);
                          }else{
                            resData = new Error(err);
                            resData.status = 403;
                            callback(resData)
                          }
                            //this.MethodCallBack(err, data, ss, callback, "assignAction");
                        });

              } else {
                callback(err, err);
              }

            });

          });
              break;
            case "getUserAction":
                ss.getUserAction.call(recordObj.accountAddress,{
                    from: recordObj.accountAddress
                }, (err, data) => {
                    Logger.info("getUserAction: ", data);
                    var resData = {};
                    resData.userdetail = data;
                    callback(null, resData);

                });
                break;
            case "removeAction":
                Logger.info("inside remove action");
                this.covertStringRoleToInt(recordObj.role,(intArray)=>{
              ss.removeAction.estimateGas(recordObj.memberAddress, intArray, {
                  from: recordObj.accountAddress
              }, (err, gasActual) => {
                  console.log("gasActual: ", gasActual);
                  if (!err) {
                ss.removeAction(recordObj.memberAddress, intArray, {
                    from: recordObj.accountAddress,
                    gas: gas
                }, (err, data) => {
                    var resData = {};
                    resData.txnHash = data;
                    recordObj.txnHash = data;
                    this.contractLogSaveToDb(recordObj);
                    callback(null, resData);
                    //this.MethodCallBack(err, data, ss, callback, "");
                });
              } else {
                  callback(err, err);
              }

                  });

                });
                break;
            case "acknowledge":
            ss.acknowledge.estimateGas({
                from: recordObj.accountAddress
            }, (err, gasActual) => {
               let resData = {};
                //console.log("gasActual: ", gasActual);
                if (!err) {
                ss.acknowledge({
                    from: recordObj.accountAddress,
                    gas: gasActual
                }, (err, data) => {
                  //console.log(err,data)
                  if(err){
                    resData = new Error(err);
                    resData.status = 403;
                    callback(resData);
                  }else{
                  resData.txnHash = data;
                  recordObj.txnHash = data;
                  this.contractLogSaveToDb(recordObj);
                  callback(null, resData);
                }
                  //this.MethodCallBack(err, data, ss, callback, "acknowledge");
                });
              }else{
                resData = new Error(err);
                resData.status = 403;
                callback(resData);
              }
              });
                break;
            case "sign":
            ss.sign.estimateGas({
                from: recordObj.accountAddress
            }, (err, gasActual) => {
               let resData = {};
                //console.log("gasActual: ", gasActual);
                if (!err) {
                ss.sign({
                    from: recordObj.accountAddress,
                    gas: gas
                }, (err, data) => {
                  resData.txnHash = data;
                  recordObj.txnHash = data;
                  this.contractLogSaveToDb(recordObj);
                  callback(null, resData);
                // this.MethodCallBack(err, data, ss, callback, "sign");
                });
              }else{

                resData = new Error(err);
                resData.status = 500;
                  callback(resData);
              }
            });

                break;
            case "decline":
                ss.decline({
                    from: recordObj.accountAddress,
                    gas: gas
                }, (err, data) => {
                    var resData = {};
                    resData.txnHash = data;
                    recordObj.txnHash = data;
                    this.contractLogSaveToDb(recordObj);
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
                callback(null, arr);
                break;

        }

    }


}

module.exports = new ContractMethordCall();
