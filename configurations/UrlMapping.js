	module.exports = function(app) {
	    var controllers = app.controllers,
	        views = app.views;
	    return {
	        // 1 Create Account
	        "/api/v1/contract/createaccount": [{
	            method: "POST",
	            action: controllers.privateEthereumController.createAccount,
	            middleware: [validater(validationFile.createAccount)],
	            views: {
	                json: views.jsonView
	            }
	        }],
					// 2 find the balance of account
	        "/api/v1/contract/Balance": [{
	            method: "GET",
	            action: controllers.privateEthereumController.accountBalance,
	            views: {
	                json: views.jsonView
	            }
	        }],
					// 3	Send hash in transaction
					"/api/v1/contract/sendHashIntransaction": [{
							method: "POST",
							action: controllers.privateEthereumController.sendHashIntransaction,
							middleware: [validater(validationFile.sendHashIntransaction)],
							views: {
									json: views.jsonView
							}
					}],
					// 4	get the transaction detail
	        "/api/v1/contract/transactiondetail": [{
	            method: "GET",
	            action: controllers.privateEthereumController.transactionDetail,
	            views: {
	                json: views.jsonView
	            }
	        }],
	        // 5	transaction confirmation and detail
	        "/api/v1/contract/txconfirmations": [{
	            method: "GET",
	            action: controllers.privateEthereumController.transactionConfirmations,
	            views: {
	                json: views.jsonView
	            }
	        }],
	        // 6	create contract
	        "/api/v1/contract/createcontract": [{
	            method: "POST",
	            action: controllers.privateEthereumController.smartContract,
	            middleware: [validater(validationFile.privateCreateContract)],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        // 7	excute the function of contract
	        "/api/v1/contract/assignandremove": [{
	            method: "POST",
	            action: controllers.privateEthereumController.assignandremove,
	            middleware: [validater(validationFile.privateRunContract)],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        // 8	review the contract
	        "/api/v1/contract/review": [{
	            method: "POST",
	            action: controllers.privateEthereumController.review,
	            middleware: [validater(validationFile.review)],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        // 9	revoke the contract
	        "/api/v1/contract/revoke": [{
	            method: "POST",
	            action: controllers.privateEthereumController.revoke,
	            middleware: [validater(validationFile.revoke)],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        // 10	change state of contract ACK , DECLINE ,
	        "/api/v1/contract/changestate": [{
	            method: "POST",
	            action: controllers.privateEthereumController.changestate,
	            middleware: [validater(validationFile.changestate)],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        // 11	change state of contract ACK , DECLINE ,
	        "/api/v1/contract/getHashIntransaction": [{
	            method: "GET",
	            action: controllers.privateEthereumController.getHashIntransaction,
	            middleware: [],
	            views: {
	                json: views.jsonView
	            }
	        }],

// -------------------------------------------------------------------------------------------------------------//

//   Below APIs currently not being used
	        // 1 	log for the contract
	        "/api/v1/contract/log": [{
	            method: "POST",
	            action: controllers.privateEthereumController.log,
	            middleware: [validater(validationFile.log)],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        // 2	log for file modify in the contract
	        "/api/v1/contract/fileModifylog": [{
	            method: "POST",
	            action: controllers.privateEthereumController.fileModifylog,
	            middleware: [validater(validationFile.log)],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        /* --------------------------------------------------------------------------------------- */
	        // explorer api
	        // 3	se for fetch data for the user
	        "/api/v1/contractPublish/fetchData": [{
	            method: "GET",
	            action: controllers.publishDataController.fetchData,
	            views: {
	                json: views.jsonView
	            }
	        }],
	        // 4	get detail of batch id  (batchid is a  id given when transaction is publish)
	        "/api/v1/contractPublish/batchData/:id": [{
	            method: "GET",
	            action: controllers.publishDataController.batchData,
	            views: {
	                json: views.jsonView
	            }
	        }],
	        /* --------------------------------------------------------------------------------------- */
	        // get data from the message queue
	        // 5	used when we have azure message queue to receive the message
	        "/api/v1/queue/reciveMessageQueue": [{
	            method: "GET",
	            action: controllers.messageQueueController.reciveMessageQueue,
	            views: {
	                json: views.jsonView
	            }
	        }],
	        // 6	used to  send the data to the azure message queue
	        "/api/v1/queue/sendToQueue": [{
	            method: "GET",
	            action: controllers.messageQueueController.sendMessageQueue,
	            views: {
	                json: views.jsonView
	            }
	        }],
	        /* ------------------------------------------------------------------------------------ */
	        // 7	send ether to other account
	        "/api/v1/contract/sendether/:requestid": [{
	            method: "POST",
	            action: controllers.privateEthereumController.privateSendether,
	            middleware: [validater(validationFile.privateSendether)],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        /* -------------------------------------------------------------------------------------- */
	        // developer use
	        // 8	dummy api just for developer to assign balance in multiple account . not for production
	        "/api/v1/insertBalance": [{
	            method: "GET",
	            action: controllers.privateEthereumController.insertBalance,
	            views: {
	                json: views.jsonView
	            }
	        }],
	        // 9	don't need it in production
	        "/api/v1/publishdata": [{
	            method: "POST",
	            action: controllers.publishDataController.sendData,
	            views: {
	                json: views.jsonView
	            }
	        }],
					// 10
	        "/api/v1/contract/testContract": [{
	            method: "GET",
	            action: controllers.privateEthereumController.testContract,
	            views: {
	                json: views.jsonView
	            }
	        }],
					// 11	get the detail of the contract
	        "/api/v1/contract/userdetail": [{
	            method: "POST",
	            action: controllers.privateEthereumController.userdetail,
	            middleware: [validater(validationFile.userdetail)],
	            views: {
	                json: views.jsonView
	            }
	        }],
					// 12
	        "/api/v1/requestconfirmation/:requestid": [{
	            method: "GET",
	            action: controllers.privateEthereumController.requestConfirmation,
	            views: {
	                json: views.jsonView
	            }
	        }],
					// 13
	        "/api/v1/chain/latestBlockdata": [{
	            method: "GET",
	            action: controllers.privateEthereumController.latestBlock,
	            views: {
	                json: views.jsonView
	            }
	        }],
					// 14	create account of the system
					"/api/v1/contract/createimportAccount": [{
							method: "POST",
							action: controllers.privateEthereumController.createimportAccount,
							middleware: [validater(validationFile.createAccount)],
							views: {
									json: views.jsonView
							}
					}],
	        // 15	create RAW contract
	        "/api/v1/contract/createrawcontract": [{
	            method: "POST",
	            action: controllers.privateEthereumController.smartRawContract,
	            middleware: [validater(validationFile.privateCreateContract)],
	            views: {
	                json: views.jsonView
	            }
	        }],
					// 16
	        "/api/v1/contract/broadcastTransactions": [{
	            method: "POST",
	            action: controllers.privateEthereumController.broadcastTransactions,
	            middleware: [],
	            views: {
	                json: views.jsonView
	            }
	        }]
	    };
	};
