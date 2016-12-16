'use strict';
class CoinbaseService {

    constructor(){
        this.Client = require('coinbase').Client;
    }

     notifications(callback){



        let client = new this.Client({'apiKey': 'tyrJcuOM6fz3d2d6',
                                 'apiSecret': 'oIGUVV12S6oxemQCDMMpZB0Z68TQCwD0'});

        client.getNotifications({}, function(err, notifications) {
          Logger.info(notifications);
          callback(err,notifications)
        });
     }
     accounts(callback){

      let client = new this.Client({'apiKey': 'tyrJcuOM6fz3d2d6',
                                      'apiSecret': 'oIGUVV12S6oxemQCDMMpZB0Z68TQCwD0'});

            client.getAccounts({}, function(err, accounts) {
              console.log(accounts);
               callback(err,accounts)
            });


     }
      createAccount(callback){


        let client = new this.Client({'apiKey': 'tyrJcuOM6fz3d2d6',
                                 'apiSecret': 'oIGUVV12S6oxemQCDMMpZB0Z68TQCwD0'});

        client.createAccount({name: 'New Wallet1'}, function(err, account) {
          console.log(account);
            callback(err,account)
        });
      }


}

module.exports = new CoinbaseService();