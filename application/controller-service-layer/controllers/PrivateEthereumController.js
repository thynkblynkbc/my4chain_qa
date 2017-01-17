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
        if (req.params) {
            req.body.requestId = req.params.requestId;
        } else {
            req.body.requestId = 0;
        }
        this.services.privateEthereumService.sponsorContract(req, res, callback);
        // call the azure message queue
    }
    var review = function(req, res, callback) {
        if (req.params) {
            req.body.requestId = req.params.requestId;
        } else {
            req.body.requestId = 0;
        }
        this.services.privateEthereumService.review(req, res, callback);
        // call the message queue
    }
    var revoke = function(req, res, callback) {

        this.services.privateEthereumService.revoke(req, res, callback);
        // call the message queue
    }

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
    var insertBalance = function(req, res, callback) {
        var userArray = ["0x67b0a7666e48503913f5dd3e00a0575547405709", "0x9e6941252069c9e34bdfd499fbf0284e501fad77", "0x88abfaf45dcc35e09e5ba5cc09b65acf97cb8cb6", "0xc682096931f49aefe49ab09ded688dc18428c4b9", "0x6314a7697d47b4a3e553c301fc93ed76e8d24c60", "0x4f58c8ad29a2ac1296cf2729292582becc8d17d2", "0x05ff607de99df54b1bf906e92b15a3947b7bbb42", "0x6787b3ad21d6209226f2c95d49999a2604b3183a", "0xa0cc6fbfc399156e9f6900ef24c53c4e2d818225", "0x33aa12ac60cb8e9969657933bb6d35458b048141", "0x36e19085b5acd44e9d916e4ada00e3c97e90fec3"];

        async.forEach(userArray, function(item, next) {


            privateWeb3.personal.unlockAccount("0xe908c0a14ff6cc5e46c0ada652af2c193b1191b1", "mypasswd", function(error, result) {
                if (!error) {
                    Logger.info("Amount sent-->", privateWeb3.toWei(1, 'ether'));
                    privateWeb3.eth.sendTransaction({
                        from: "0xe908c0a14ff6cc5e46c0ada652af2c193b1191b1",
                        to: item,
                        value: privateWeb3.toWei(10, 'ether'),
                        gas: 21000
                    }, function(tx_error, tx_result) {
                        if (!tx_error) {
                            //  resData.transactionResult=tx_result;
                            next();
                            //    callback(null,resData);
                        } else {
                            next()
                                //  callback(tx_error);
                        }
                    });
                } else {
                    callback(error);
                }

            });

        }, function(err) {

            callback(null, {
                message: "balance filled"
            })
        })

    }

    var checkForRequest = function(req, res, callback) {

      //  var userArray = [ "0x9e6941252069c9e34bdfd499fbf0284e501fad77", "0x88abfaf45dcc35e09e5ba5cc09b65acf97cb8cb6", "0xc682096931f49aefe49ab09ded688dc18428c4b9", "0x6314a7697d47b4a3e553c301fc93ed76e8d24c60", "0x4f58c8ad29a2ac1296cf2729292582becc8d17d2", "0x05ff607de99df54b1bf906e92b15a3947b7bbb42", "0x6787b3ad21d6209226f2c95d49999a2604b3183a", "0xa0cc6fbfc399156e9f6900ef24c53c4e2d818225", "0x33aa12ac60cb8e9969657933bb6d35458b048141", "0x36e19085b5acd44e9d916e4ada00e3c97e90fec3"];
        var userArray =["0x9e6941252069c9e34bdfd499fbf0284e501fad77"];
        // var contractAddress = ["0x53f6f0967d3a5b77d6e287a89a4fe78132a27839", "0x17df5f918b80f1896b2750ab22a7abbc826dc7b2",
        //     "0x32879b5360b6c7b7648bb0a8580f925a23190a2c", "0x18d09c379e7f43f7411838a3aa12b655a90de02f",
        //     "0x3c68b611723faade46e74e7717024d9da0eff147", "0xa0d48d97c5b32380b417d124d5f2cea25ef04b69",
        //     "0x40336f974dcb1976d18fa95f2773c8bc4ed5b0e3", "0x8d9b0fcffd067fa09f711ec92890b2ede578b00d",
        //     "0x7e53316f2fb61686563d737a59880b2ccffee7c4",
        //     "0xf9510428f5e5faa405c340ef52ba0b6faae1d5a4", "0x416c5d64928c62b01c8bf050eaeb7f005ae6a986"
        // ];
        var contractAddress = ["0x53f6f0967d3a5b77d6e287a89a4fe78132a27839"];

        ///
        async.forEach(userArray, (item, next) => {
        //  var smartSponsor = privateWeb3.eth.contract(solAbi);
        //cb("0x"+solBytecode,smartSponsor,solAbi);
        let smartSponsor = privateWeb3.eth.contract(solAbi);

            async.forEach(contractAddress, (contractitem, innerNext) => {
              privateWeb3.personal.unlockAccount(item, "nivi11yo",  function(error, result) {
                    var ss = smartSponsor.at(contractitem);
                ss.assignAction.estimateGas(item, ["CAN_REVIEW"], {
                    from: item
                }, (err, gasActual) => {
                    console.log("gasActual: ", gasActual);
                    if (!err) {
                        ss.assignAction(item, intArray, {
                            from: item,
                            gas: gasActual
                        }, (err, data) => {
                            if (!err) {
                                //console.log("err",err,"data",data)
                                innerNext();
                                resData.txnHash = data;
                                recordObj.txnHash = data;
                                //  this.contractLogSaveToDb(recordObj);
                                //callback(null, resData);
                            } else {
                                resData = new Error(err);
                                resData.status = 403;
                                innerNext();
                                //callback(resData)
                            }
                            //this.MethodCallBack(err, data, ss, callback, "assignAction");
                        });

                    } else {
                        innerNext();

                    }

                });

              });
            },function(err){
              console.log("contract finish");
              next();

            });
        },function(err){
          console.log("user END");
        });

    }
    return {
        insertBalance: insertBalance,
        checkForRequest: checkForRequest,
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
        fileModifylog: fileModifylog,
        revoke: revoke,
        changestate: changestate,
        userdetail: userdetail,
        log: log,
        requestConfirmation: requestConfirmation

    }
};
