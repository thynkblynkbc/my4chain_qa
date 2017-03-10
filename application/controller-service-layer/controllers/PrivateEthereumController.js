var encrypt = require('../../../application-utilities/EncryptionUtility');
var publishData = require('../../../application-utilities/cron/PromisePublishContractData');
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
        this.services.accounts.createAccount(req.body, res, callback);
    }
    var createimportAccount = function(req, res, callback) {
        //	var password=req.body.password;
        // var one=this.services.createAccount.createUserIndatabase(req.body);
        // console.log(one);
        this.services.accounts.createimportAccount(req.body, res, callback);
    }
   // function to test contract for developer
    var testContract = function(req,res,callback){
        publishData.callFunction(callback);

    }
    // function to get block detail
    var latestBlock = function(req, res, callback){
      return callback(null,privateWeb3.eth.getBlock(req.query.block));
    }

   // function to create smart contract
    var smartContract = function(req, res, callback) {
        Logger.info("inside controller contract");
        Logger.info(req.body.startfrom);
         req.body.Raw = false;
        this.services.privateEthereumService.smartContract(req, res, callback);
    }
    // function to create smart contract
     var smartRawContract = function(req, res, callback) {
         Logger.info("inside controller contract");
         req.body.Raw = true;
         Logger.info(req.body.startfrom);
         this.services.privateEthereumService.smartContract(req, res, callback);
     }

  // assign and remove action from user
    var assignandremove = function(req, res, callback) {
      Logger.info("inside assignandremove contract role");
      Logger.info(new Date());
        if (req.params) {
            req.body.requestId = req.params.requestId;
        } else {
            req.body.requestId = 0;
        }
        this.services.privateEthereumService.assignandremove(req, res, callback);
        // call the azure message queue
    }

    // review the functions detail
    var review = function(req, res, callback) {
        if (req.params) {
            req.body.requestId = req.params.requestId;
        } else {
            req.body.requestId = 0;
        }
        this.services.privateEthereumService.review(req, res, callback);
        // call the message queue
    }

    // revoke the contract
    var revoke = function(req, res, callback) {

        this.services.privateEthereumService.revoke(req, res, callback);
        // call the message queue
    }

     // change state of contract
    var changestate = function(req, res, callback) {
        if (req.params) {
            req.body.requestId = req.params.requestId;
        } else {
            req.body.requestId = 0;
        }
        this.services.privateEthereumService.changestate(req, res, callback);
        // call the message queue
    }


    var userdetail = function(req, res, callback) {
        Logger.info("userdetail");
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
        this.services.accounts.privateSendether(req, res, callback);
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
    var sendHashIntransaction = function(req,res,callback){
         this.services.simpleHashTransaction.sendHashIntransaction(req, res, callback);


    }
    var sendRawHashIntransaction = function(req,res,callback){
         this.services.simpleHashTransaction.sendRawHashIntransaction(req, res, callback);


    }
    var getHashIntransaction = function(req,res,callback){
      this.services.simpleHashTransaction.getHashIntransaction(req, res, callback);

    }

    var saveFileAndGenerateHash = function(req, res, callback) {
        var myaccount = req.body.myAddress;
        var toAccount = req.body.toAddress;
        this.services.privateEthereumService.saveFileAndGenerateHash(toAccount, myaccount, req, res, callback);

    }
    var coinbaseBalance = function(req, res, callback) {

        this.services.privateEthereumDetail.coinbaseBalance(res, callback);


    }



    return {
    //    insertBalance: insertBalance,
      //  checkForRequest: checkForRequest,
        coinbaseBalance: coinbaseBalance,
        accountBalance: accountBalance,
        sendHashIntransaction : sendHashIntransaction,
        sendRawHashIntransaction : sendRawHashIntransaction,
        getHashIntransaction : getHashIntransaction,
        // privateImageHashGenerate: privateImageHashGenerate,
        contractForAssets: contractForAssets,
        saveFileAndGenerateHash: saveFileAndGenerateHash,
        createAccount: createAccount,
        privateSendether: privateSendether,
        transactionDetail: transactionDetail,
        transactionConfirmations: transactionConfirmations,
        assignandremove: assignandremove,
        smartContract: smartContract,
        // privateImageHashtoContract: privateImageHashtoContract,
        // smartPartyContract: smartPartyContract,
        // sponsorPartyContract: sponsorPartyContract,
        review: review,
        fileModifylog: fileModifylog,
        revoke: revoke,
        changestate: changestate,
        userdetail: userdetail,
        log: log,
        latestBlock: latestBlock,
        requestConfirmation: requestConfirmation,
        testContract:testContract,
        createimportAccount : createimportAccount

    }
};
