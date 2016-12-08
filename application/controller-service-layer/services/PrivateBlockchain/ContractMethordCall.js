'use strict ';

class ContractMethordCall{

  callEvent(ss, callback) {
    Logger.info("cllevent call");



  }
  // call different methord of smart contract
contractMethodCall(method, adminAddress, accountAddress, action, ss, callback, textValue, conAddress, val) {
  console.log("This is the action",method);
  switch (method) {
      case "assignAction":
          ss.assignAction(accountAddress,action,  {
              from: adminAddress,
              gas:4000000
          }, function(err, data) {
            console.log(data);
            var newData={};
            newData.txnHash=data;
              callback(err, newData);
          });
          break;
      case "getUserAction":
          ss.getUserAction.call(accountAddress, {
              from: adminAddress,
              gas:4000000
          }, (err, data) => {
              Logger.info("getUserAction: ", data);


              callback(err, data);


            //  callback(err, data);
          });
          break;
          case "checkroleAction":
          ss.checkroleAction.call(accountAddress,action, {
              from: adminAddress,
              gas:4000000
          }, (err, data) => {
              Logger.info("getUserAction: ", data);


              callback(err, data);


            //  callback(err, data);
          });
          break;
      case "removeAction":
          Logger.info("inside remove action");
          ss.removeAction(accountAddress, action, {
              from: adminAddress,
              gas:4000000
          }, (err, data) => {
              Logger.info(err, data);
              var newData={};
              newData.txnHash=data;
                callback(err, newData);

          });
          break;
      case "review":
          ss.review(accountAddress, val, {
              from: adminAddress
          }, (err, data) => {
            this.callEvent(ss,callback);
              Logger.info("review: ", data);
              var newData={};
              newData.txnHash=data;
                callback(err, newData);
          });
          break;
      case "addInfo":
          ss.addInfo(accountAddress, {
              from: adminAddress
          }, function(err, data) {
              Logger.info("addInfo: ", data);
              var newData={};
              newData.txnHash=data;
                callback(err, newData);
          });
          break;
          case "accept":
              ss.accept(accountAddress, {
                  from: adminAddress
              }, function(err, data) {
                  Logger.info("addInfo: ", data);
                  var newData={};
                  newData.txnHash=data;
                    callback(err, newData);
              });
              break;
      case "revoke":
          ss.revoke(accountAddress,adminAddress, {
              from: adminAddress
          }, (err, data) => {
              Logger.info("revoke: ", data);
              var newData={};
              newData.txnHash=data;
                callback(err, newData);


          });
          break;
          case "decline":
              ss.decline({
                  from: accountAddress
              }, (err, data) => {
                  Logger.info("revoke: ", data);
                  var newData={};
                  newData.txnHash=data;
                    callback(err, newData);

                  //  callEvent(ss,callback);
              });
              break;
      case "users":
          ss.users({
              from: adminAddress
          }, function(err, data) {
              Logger.info("getUserAction: ", data);
              callback(err, data);
          });
          break;
          case "eventLog":
                  console.log("eventlog");
                  var event = ss.GetValue(function(error, result) {
                      if (!error) {
                          Logger.info(result, "Hello ", result.args);
                         callback(error, result);
                          event.stopWatching();
                      } else {
                          Logger.info("error", error);
                      }
                  });
              break;
      default:
          ss.showMessage(adminAddress, action, {
              from: adminAddress
          }, function(err, data) {
              Logger.info("message function: ", data);
              Logger.info("Hello: ", privateWeb3.fromAscii('Hello', 32));
              callback(err, data);
          });
          break;
  }

}


}

module.exports = new ContractMethordCall();
