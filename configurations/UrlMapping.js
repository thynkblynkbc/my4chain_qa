	module.exports = function (app) {
		var controllers = app.controllers,
			views = app.views;

		return {
		    "/api/coinbase/balance": [{
		        method: "GET",
                action: controllers.coinbaseController.notifications,
                views: {
                			json: views.jsonView
                	    }
		        }],
		    "/api/coinbase/accounts": [{
                method: "GET",
                action: controllers.coinbaseController.notifications,
                views: {
                             json: views.jsonView
                   	    }
               }],


        "/api/coinbase/createAccount": [{
               method: "GET",
               action: controllers.coinbaseController.createAccount,
               views: {
                        json: views.jsonView
                	    }
                }],
								"/api/v1/uploadToGlobalBlockchain": [{
				               method: "GET",
				               action: controllers.publishDataGlobal.sendData,
				               views: {
				                        json: views.jsonView
				                	    }
				                }],
			"/api/v1/balance": [{
					method: "POST",
					action: controllers.ethereumController.accountBalance,
					views: {
						json: views.jsonView
					}
				}
			],
			"/api/v1/coinbaseBalance": [{
					method: "GET",
					action: controllers.privateEthereumController.coinbaseBalance,
					views: {
						json: views.jsonView
					}
				}
			],
			"/api/v1/privateBalance": [{
					method: "GET",
					action: controllers.privateEthereumController.accountBalance,
					views: {
						json: views.jsonView
					}
				}
			],
			"/api/v1/createaccount": [{
					method: "POST",
					action: controllers.ethereumController.createAccount,
					views: {
						json: views.jsonView
					}
				}
			],
				"/api/v1/privateRunContract": [{
					method: "POST",
					action: controllers.privateEthereumController.sponsorContract,
						middleware:[validater(validationFile.privateRunContract)],
					views: {
						json: views.jsonView
					}
				}
			],
			"/api/v1/privateCreateContract": [{
					method: "POST",
					action: controllers.privateEthereumController.smartContract,
					middleware:[validater(validationFile.privateCreateContract)],
					views: {
						json: views.jsonView
					}
				}
			],
			"/api/v1/privateCreatePartyContract": [{
					method: "POST",
					action: controllers.privateEthereumController.smartPartyContract,
					middleware:[],
					views: {
						json: views.jsonView
					}
				}
			],
			"/api/v1/privateSponsorPartyContract": [{
					method: "POST",
					action: controllers.privateEthereumController.sponsorPartyContract,
					middleware:[],
					views: {
						json: views.jsonView
					}
				}
			],
			"/api/v1/privateSendether": [{
					method: "POST",
					action: controllers.privateEthereumController.privateSendether,
						middleware:[validater(validationFile.privateSendether)],
					views: {
						json: views.jsonView
					}
				}
			],
			"/api/v1/privatecreateaccount": [{
					method: "POST",
					action: controllers.privateEthereumController.createAccount,
					middleware:[validater(validationFile.createAccount)],
					views: {
						json: views.jsonView
					}
				}
			],
			"/api/v1/saveFileAndGenerateHash": [{
					method: "POST",
					action: controllers.privateEthereumController.saveFileAndGenerateHash,
					views: {
						json: views.jsonView
					}
				}
			],

			"/api/v1/sendether": [{
					method: "POST",
					action: controllers.ethereumController.createTransaction,
					views: {
						json: views.jsonView
					}
				}
			],
			"/api/v1/privatetxConfirmations": [{
					method: "GET",
					action: controllers.privateEthereumController.transactionConfirmations,
					views: {
						json: views.jsonView
					}
				}
			],
			"/api/v1/transactionDetail": [{
					method: "POST",
					action: controllers.ethereumController.transactionDetail,
					views: {
						json: views.jsonView
					}
				}
			],
			"/api/v1/privateTransactionDetail": [{
					method: "POST",
					action: controllers.privateEthereumController.transactionDetail,
					views: {
						json: views.jsonView
					}
				}
			],
			"/api/v1/txConfirmations": [{
					method: "POST",
					action: controllers.ethereumController.transactionConfirmations,
					views: {
						json: views.jsonView
					}
				}
			],
			"/api/v1/privateImageHashGenerate": [{
					method: "POST",
					action: controllers.privateEthereumController.privateImageHashGenerate,
					middleware: [multipartMiddleware],
					views: {
							json: views.jsonView
					}
			}]
		};
	};
