var encrypt = require('../../../application-utilities/EncryptionUtility');
module.exports = function() {

    var accountBalance = function(req, res, callback) {
        var address = req.query.address;
        Logger.info("address", address);
        this.services.privateEthereumDetail.accountBalance(address, res, callback);

        //ethereumService
    }

    var createAccount = function(req, res, callback) {
        //	var password=req.body.password;
        // var one=this.services.createAccount.createUserIndatabase(req.body);
        // console.log(one);
        this.services.privateEthereumService.createAccount(req.body, res, callback);
    }

    var smartContract = function(req, res, callback) {

        this.services.privateEthereumService.smartContract(req, res, callback);
    }
    var smartPartyContract = function(req, res, callback) {
        this.services.privateEthereumPartyService.smartPartyContract(req, res, callback);

    }
    var sponsorPartyContract = function(req, res, callback) {

        this.services.privateEthereumPartyService.sponsorPartyContract(req, res, callback);
       // call the azure message queue
    }

    var sponsorContract = function(req, res, callback) {
          if(req.params){
          req.body.requestId = req.params.requestId;
        }else{
          req.body.requestId =0;
        }
        this.services.privateEthereumService.sponsorContract(req, res, callback);
        // call the azure message queue
    }
    var review = function(req, res, callback) {
      if(req.params){
      req.body.requestId = req.params.requestId;
    }else{
      req.body.requestId =0;
    }
        this.services.privateEthereumService.review(req, res, callback);
        // call the message queue
    }
    var revoke = function(req, res, callback) {

        this.services.privateEthereumService.revoke(req, res, callback);
        // call the message queue
    }

    var changestate = function(req, res, callback) {
      if(req.params){
      req.body.requestId = req.params.requestId;
    }else{
      req.body.requestId =0;
    }
        this.services.privateEthereumService.changestate(req, res, callback);
        // call the message queue
    }

    var userdetail = function(req, res, callback) {
        console.log("userdetail");
        this.services.privateEthereumService.userdetail(req, res, callback);

    }
    var log = function(req, res, callback) {

        this.services.privateEthereumService.log(req, res, callback);

    }
    var fileModifylog = function(req, res, callback) {

        this.services.privateEthereumService.fileModifylog(req, res, callback);

    }
    var privateSendether = function(req, res, callback) {
        var reqData = req.body;
        this.services.privateEthereumService.privateSendether(req, res, callback);
    }

    var transactionConfirmations = function(req, res, callback) {
        var tranxHash = req.query.tranxHash;
        this.services.privateEthereumDetail.transactionConfirmations(tranxHash, res, callback);
    }

    var requestConfirmation = function(req, res, callback) {
        this.services.privateEthereumDetail.requestConfirmation(req, res, callback);
    }
    var transactionDetail = function(req, res, callback) {
        var tranxHash = req.query.tranxHash;
        this.services.privateEthereumDetail.transactionDetail(tranxHash, res, callback);
    }

    var contractForAssets = function(req, res, callback) {
        var tranxHash = req.body.tranxHash;
        this.services.privateEthereumService.contractForAssets(tranxHash, res, callback);

    }

    var saveFileAndGenerateHash = function(req, res, callback) {
        var myaccount = req.body.myAddress;
        var toAccount = req.body.toAddress;
        this.services.privateEthereumService.saveFileAndGenerateHash(toAccount, myaccount, req, res, callback);

    }
    var coinbaseBalance = function(req, res, callback) {

        this.services.privateEthereumDetail.coinbaseBalance(res, callback);


    }
    var privateImageHashGenerate = function(req, res, callback) {
        this.services.privateEthereumService.privateImageHashGenerate(req, res, callback);
    }
    var privateImageHashtoContract = function(req, res, callback) {
        this.services.privateEthereumService.privateImageHashtoContract(req, res, callback);
    }
    return {

        coinbaseBalance: coinbaseBalance,
        accountBalance: accountBalance,
        privateImageHashGenerate: privateImageHashGenerate,
        contractForAssets: contractForAssets,
        saveFileAndGenerateHash: saveFileAndGenerateHash,
        createAccount: createAccount,
        privateSendether: privateSendether,
        transactionDetail: transactionDetail,
        transactionConfirmations: transactionConfirmations,
        sponsorContract: sponsorContract,
        smartContract: smartContract,
        privateImageHashtoContract: privateImageHashtoContract,
        smartPartyContract: smartPartyContract,
        sponsorPartyContract: sponsorPartyContract,
        review: review,
        fileModifylog : fileModifylog,
        revoke: revoke,
        changestate: changestate,
        userdetail: userdetail,
        log: log,
        requestConfirmation:requestConfirmation

    }
};
