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
  coinbaseBalance( res, callback) {
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


// transaction conformation for a block
   transactionConfirmations(tranxHash, res, callback) {
      // var dummytxHash="0x19a36234629a6a5692083438fbe2cc4b97eb98e42a9ed0211ff227f2a5dca32a";
      var resData = {};
      Logger.info("transaction---", privateWeb3.eth.blockNumber - privateWeb3.eth.getTransaction(tranxHash).blockNumber);
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
                          resData.latest = bestBlock.number;
                          callback(null, resData);
                      } else {
                          resData.message = "cant get blockByHash";
                          //resData.block = blockByHash;
                          resData.latest = bestBlock.number;
                          callback(resData);
                      }
                  } else {
                      callback(error);
                  }
              });
          } else {
              callback(err);
          }
      });
  }

// can get a transaction detail for the user
  transactionDetail(tranxHash, res, callback) {
      // var dummytxHash="0x19a36234629a6a5692083438fbe2cc4b97eb98e42a9ed0211ff227f2a5dca32a";
      var resData = {};
      privateWeb3.eth.getTransaction(tranxHash, function(error, result) {
          if (!error) {
              if (result != null) {
                  Logger.info("Result--->", result);
                  resData.transactionDetail = result;
                  callback(null, resData);
              } else {
                  resData.message = "cant get blockByHash";
                  callback(resData);
              }
          } else {
              callback(error);
          }
      });

  }

}

module.exports =  new PrivateEthereumDetail();
