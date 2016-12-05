var BaseService = require('./BaseService');

EthereumService = function (app) {
	this.app = app;
};

EthereumService.prototype = new BaseService();

EthereumService.prototype.accountBalance =function(address,res, callback){
		// dummyAddress="d275c1fe34f30713bdd2c7fa35475b4aa52e21ed";

			Logger.info("address=------>",address);

		web3.eth.getBalance(address, function(error, result){
					if(!error){
						var resData={};
						resData.Balance=result.toNumber();
						callback(null,resData);
					}
					else{
						callback(error)
					}
		});

}

EthereumService.prototype.createAccount =function(password,res, callback){
//	Logger.info("web3.personal",web3.personal.newAccount);
		web3.personal.newAccount(password,function(error,result){
					if(!error){
						var resData={};
						resData.key="password";
						resData.address=result;
						callback(null,resData);
					}
					else{
						callback(error);
					}
		});
}

EthereumService.prototype.createTransaction =function(reqData,res, callback){
	var fromAddress=reqData.fromAddress;
	var toAddress=reqData.toAddress;
	var password=reqData.password;
	var amount=reqData.amount;
	var duration=30;
	var resData={};
		web3.personal.unlockAccount(fromAddress,password,duration,function(error,result){
			if(!error){
				 Logger.info("Amount sent-->",web3.toWei(1, 'ether'));
					web3.eth.sendTransaction({from: fromAddress, to: toAddress, value: web3.toWei(amount, 'ether'),gas:21000},function(tx_error,tx_result){
						if(!tx_error){
								resData.transactionResult=tx_result;
								callback(null,resData);
						}
						else{
								callback(tx_error);
						}
					});
			}
			else{
				callback(error);
			}

		});
}

EthereumService.prototype.transactionConfirmations =function(tranxHash,res, callback){
	// var dummytxHash="0x19a36234629a6a5692083438fbe2cc4b97eb98e42a9ed0211ff227f2a5dca32a";
		var resData={};
		web3.eth.getBlock('latest',function(err,bestBlock){
			if(!err){
				Logger.info("bestBlock--->",bestBlock);

				web3.eth.getTransaction(tranxHash ,function(error,blockByHash){
					if(!error){
							if(blockByHash!=null){
								Logger.info("blockByHash",blockByHash);
								var result=bestBlock.number-blockByHash.blockNumber;
								resData.totalConfirmations=result;
								callback(null,resData);
							}
							else{
								resData.message="cant get blockByHash";
								callback(resData);
							}
					}
					else{
						  callback(error);
					}
				});
			}
			else{
					callback(err);
			}
		});
}

EthereumService.prototype.transactionDetail = function(tranxHash,res,callback){
	// var dummytxHash="0x19a36234629a6a5692083438fbe2cc4b97eb98e42a9ed0211ff227f2a5dca32a";
	var resData={};
	web3.eth.getTransaction(tranxHash ,function(error,result){
		if(!error){
				if(result!=null){
					Logger.info("Result--->",result);
					resData.transactionDetail=result;
					callback(null,resData);
				}
				else{
					resData.message="cant get blockByHash";
					callback(resData);
				}
		}
		else{
				callback(error);
		}
	});

}

module.exports = function(app) {
    return new EthereumService(app);
};
