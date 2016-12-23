var encrypt = require('../../../application-utilities/EncryptionUtility');
module.exports = function() {

    var accountBalance = function(req, res, callback) {
        var address = req.body.address;
        this.services.ethereumService.accountBalance(address, res, callback);

        //ethereumService
    }

    var createAccount = function(req, res, callback) {
        var password = req.body.password;
        this.services.ethereumService.createAccount(password, res, callback);
    }

    var createTransaction = function(req, res, callback) {
        var reqData = req.body;
        this.services.ethereumService.createTransaction(reqData, res, callback);
    }

    var transactionConfirmations = function(req, res, callback) {
        var tranxHash = req.body.tranxHash;
        this.services.ethereumService.transactionConfirmations(tranxHash, res, callback);
    }

    var transactionDetail = function(req, res, callback) {
        var tranxHash = req.body.tranxHash;
        this.services.ethereumService.transactionDetail(tranxHash, res, callback);
    }
    return {
        accountBalance: accountBalance,
        createAccount: createAccount,
        createTransaction: createTransaction,
        transactionDetail: transactionDetail,
        transactionConfirmations: transactionConfirmations
    }
};
