'use strict ';

class ContractMethordCall{

  callEvent(ss, callback, data) {
          var event = ss.GetValue(function(error, result) {
              if (!error) {
                  Logger.info("Event result", result.args);
                  var arr = {};
                  arr.transactionHash = data;
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
  // call different methord of smart contract
contractMethodCall(method, adminAddress, accountAddress, action, ss, callback, textValue, conAddress, val,gas) {
  console.log("This is the action",method);
  switch (method) {
    case "expire":
        ss.expire.call({
            from: adminAddress,
            gas: gas,
            gasPrice: 11067000000000000
        }, (err, data) => {
            Logger.info("expire: ", data);
            callback(err, data);
        });
        break;
    case "assignAction":
        ss.assignAction(accountAddress, action, {
            from: adminAddress,
            gas: gas,
            gasPrice: 11067000000000000
        }, (err, data) => {
            Logger.info("assignAction: ", data);
            Logger.info("event Call ------------");
            this.callEvent(ss, callback, data);
        });
        break;
    case "getUserAction":
        ss.getUserAction.call(accountAddress, {
            from: adminAddress,
            gas: gas,
            gasPrice: 11067000000000000
        }, (err, data) => {
            Logger.info("getUserAction: ", data);
            callback(err, data);
        });
        break;
    case "removeAction":
        Logger.info("inside remove action");
        ss.removeAction(accountAddress, action, {
            from: adminAddress,
            gas: gas,
            gasPrice: 11067000000000000
        }, (err, data) => {
            Logger.info(err, data);
            callback(err, data);
        });
        break;
    case "acknowledge":
        Logger.info("inside remove action");
        ss.acknowledge({
            from: adminAddress,
            gas: gas,
            gasPrice: 11067000000000000
        }, (err, data) => {
            Logger.info(err, data);
            callback(err, data);
        });
        break;
    case "review":
        ss.review(accountAddress, val, {
            from: adminAddress,
            gas: gas,
            gasPrice: 11067000000000000
        }, (err, data) => {
            Logger.info("review: ", data);
            callback(err, data);
        });
        break;
    case "addInfo":
        ss.addInfo(accountAddress, {
            from: adminAddress,
            gas: gas,
            gasPrice: 11067000000000000
        }, (err, data) => {
            Logger.info("addInfo: ", data);
            callback(err, data);
        });
        break;
    case "accept":
        ss.accept(accountAddress, {
            from: adminAddress,
            gas: gas,
            gasPrice: 11067000000000000
        }, (err, data) => {
            Logger.info("addInfo: ", data);
            callback(err, data);
        });
        break;
    case "revoke":
        ss.revoke(accountAddress, adminAddress, {
            from: adminAddress,
            gas: gas,
            gasPrice: 11067000000000000
        }, (err, data) => {
            Logger.info("revoke: ", data);
            callback(err, data);

        });
        break;
    case "decline":
        ss.decline(accountAddress, {
            from: adminAddress,
            gas: gas,
            gasPrice: 11067000000000000
        }, (err, data) => {
            Logger.info("revoke: ", data);
            callback(err, data);
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
