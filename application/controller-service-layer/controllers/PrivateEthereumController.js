var encrypt = require('../../../application-utilities/EncryptionUtility');
module.exports = function () {

	var accountBalance = function (req, res,callback) {
			var address=req.query.address;
			Logger.info(	"address",address);
			this.services.privateEthereumDetail.accountBalance(address, res, callback);

			//ethereumService
	}

  var createAccount = function (req, res,callback) {
	//	var password=req.body.password;
		// var one=this.services.createAccount.createUserIndatabase(req.body);
		// console.log(one);
		this.services.privateEthereumService.createAccount(req.body, res, callback);
	}

var smartContract = function (req, res,callback) {

		this.services.privateEthereumService.smartContract(req, res, callback);
  }


	var sponsorContract = function (req, res,callback) {

		this.services.privateEthereumService.sponsorContract(req, res, callback);

  }
  var privateSendether = function (req, res,callback) {
    var reqData=req.body;
		this.services.privateEthereumService.privateSendether(reqData, res, callback);
  }

  var transactionConfirmations = function (req, res,callback) {
    var tranxHash=req.query.tranxHash;
		this.services.privateEthereumDetail.transactionConfirmations(tranxHash,res,callback);
  }

  var transactionDetail = function (req, res,callback) {
		var tranxHash=req.body.tranxHash;
		this.services.privateEthereumDetail.transactionDetail(tranxHash,res,callback);
  }

	var contractForAssets = function (req , res ,callback){
		var tranxHash=req.body.tranxHash;
		this.services.privateEthereumService.contractForAssets(tranxHash,res,callback);


	}

	var saveFileAndGenerateHash = function (req , res ,callback){
     var myaccount = req.body.myAddress;
     var toAccount = req.body.toAddress;
      	this.services.privateEthereumService.saveFileAndGenerateHash(toAccount,myaccount,req,res,callback);

	}
	var coinbaseBalance = function (req , res ,callback){

			 this.services.privateEthereumDetail.coinbaseBalance(res,callback);

 }
 var privateImageHashGenerate=function (req,res,callback){
	 this.services.privateEthereumService.privateImageHashGenerate(req,res,callback);
 }
 var privateImageHashtoContract=function (req,res,callback){
	this.services.privateEthereumService.privateImageHashtoContract(req,res,callback);
 }
  	return {

		coinbaseBalance  :coinbaseBalance,
		accountBalance: accountBalance,
		privateImageHashGenerate:privateImageHashGenerate,
		contractForAssets: contractForAssets,
		saveFileAndGenerateHash: saveFileAndGenerateHash,
    createAccount: createAccount,
    privateSendether:privateSendether,
    transactionDetail:transactionDetail,
    transactionConfirmations:transactionConfirmations,
		sponsorContract:sponsorContract,
		smartContract:smartContract,
		privateImageHashtoContract:privateImageHashtoContract
	}
};
