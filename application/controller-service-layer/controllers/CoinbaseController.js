
module.exports = function () {

	var notifications = function (req, res,callback) {

			this.services.coinbaseService.notifications(callback);

			//ethereumService
	}
	var accounts = function (req, res,callback) {

    			this.services.coinbaseService.accounts(callback);

    			//ethereumService
    	}
    var createAccount = function (req, res,callback) {

        	this.services.coinbaseService.createAccount(callback);

        			//ethereumService
        	}
  	return {

		notifications  :notifications,
		accounts : accounts,
		createAccount : createAccount
	}
};
