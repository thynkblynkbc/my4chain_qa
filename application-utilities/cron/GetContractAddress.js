'use strict';
class GetContractAddress {
    contractAddress() {
      let resData={};

        domain.Contract.query().
        where("contractAddress", "=", "NaN").limit(400).then((databaseReturn) => {
            if (!databaseReturn) {
                Logger.info("error in data");
                resData.message = "No data found";

            } else {
          //     Logger.info("Data is found", databaseReturn.length);
                this.checkForAddress(JSON.parse(JSON.stringify(databaseReturn)));

                resData.message = "data found";

            }

        });

    }

    checkForAddress(contractData) {
      let contract ={};
        async.forEach(contractData, (data,done) => {
                    privateWeb3.eth.getTransactionReceipt(data.transactionHash, function(e, receipt) {
                        if (receipt) {

                            privateWeb3.eth.getCode(receipt.contractAddress, function(e, code) {
                                /*jshint maxcomplexity: 6 */

                                if (!code)
                                    return;

                                if (code.length > 3) {

                                    // console.log('Contract code deployed!');

                                    contract.address = receipt.contractAddress;

                                    // attach events and methods again after we have
                                  //  addFunctionsToContract(contract);
                                  //  addEventsToContract(contract);

                                    // call callback for the second time

                                    console.log(null, contract);
                                    domain.Contract.query().patch({contractAddress: contract.address})
                                      .where('transactionHash', '=', data.transactionHash)
                                      .then(function(databaseReturn) {
                                        //Logger.info("Inserted data: ", databaseReturn);

                                        Logger.info("contractAddress: ");
                                       return ;
                                    });

                                } else {

                                    console.log('The contract code couldn\'t be stored, please check your gas amount.');
                                }
                            });
                        }
                    });

            },
            function(err) {


            })

    }
 }

module.exports = new GetContractAddress();
