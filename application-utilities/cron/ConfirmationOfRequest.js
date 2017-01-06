'use strict';
var MessageQueue = require("../../application/controller-service-layer/services/messageQueue/MessageQueue");
class ConfirmRequest {
    confirmRequestCRON() {

        domain.ContractLog.query().
        where("confirmation", "=", false).then((databaseReturn) => {

            Logger.info("dataReturn", databaseReturn.length)
            Logger.info("dataReturn", databaseReturn[1]);
            async.forEach(databaseReturn, (item, next) => {
                    // console.log("data",item)
                    this.checkConfirmation(item.transactionHash, (err, confirm) => {
                        if (err) {
                            next();
                            console.log("error for transhash", confirm);
                        } else {
                          if(confirm.totalConfirmations >= 2){
                            domain.ContractLog
                                .query()
                                .patch({
                                    confirmationCount: confirm.totalConfirmations,
                                    confirmation : true
                                })
                                .where('transactionHash', '=', item.transactionHash)
                                .then((numUpdated) => {
                                  let msg={};
                                  msg.body=item;
                                    MessageQueue.sendToQueue(msg,{});
                                    console.log(numUpdated, 'confirmation updateded were updated');
                                })
                                .catch((err) => {
                                    console.log(err.stack);
                                });
                            next();
                            console.log("result for tranxhash", confirm);
                          }else{
                              next();
                             Logger.info("NOt confirmed yet",confirm.totalConfirmations);

                          }
                        }
                    });

                },
                function(err) {
                    console.log("Task finnish");

                });

        });
    }

    checkConfirmation(tranxHash, cb) {
        var resData = {};
        privateWeb3.eth.getBlock('latest', (err, bestBlock) => {
            if (!err) {
                //   Logger.info("bestBlock--->", bestBlock);

                privateWeb3.eth.getTransaction(tranxHash, (error, blockByHash) => {
                    if (!error) {
                        if (blockByHash != null) {
                    //        Logger.info("blockByHash", blockByHash.blockNumber, "  jjjjjjj  ", bestBlock.number);
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

}

module.exports = new ConfirmRequest();
