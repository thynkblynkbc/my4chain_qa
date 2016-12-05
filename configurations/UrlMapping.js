	module.exports = function (app) {
		var controllers = app.controllers,
			views = app.views;

		return {
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
					method: "POST",
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
					views: {
						json: views.jsonView
					}
				}
			],
			"/api/v1/privateCreateContract": [{
					method: "POST",
					action: controllers.privateEthereumController.smartContract,
					views: {
						json: views.jsonView
					}
				}
			],
			"/api/v1/privateSendether": [{
					method: "POST",
					action: controllers.privateEthereumController.privateSendether,
					views: {
						json: views.jsonView
					}
				}
			],
			"/api/v1/privatecreateaccount": [{
					method: "POST",
					action: controllers.privateEthereumController.createAccount,
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
					method: "POST",
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
			]
		};
	};
