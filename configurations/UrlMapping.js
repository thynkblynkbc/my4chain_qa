	module.exports = function(app) {
	    var controllers = app.controllers,
	        views = app.views;

	    return {

	    // ------------ Create Account
	        // create account of the system
	        "/api/v1/contract/createaccount": [{
	            method: "POST",
	            action: controllers.privateEthereumController.createAccount,
	            middleware: [validater(validationFile.createAccount)],
	            views: {
	                json: views.jsonView
	            }
	        }],
 /* ---------------------------------------------------------------------------- */
		// transaction confirmation and detail
	        // It tell about confirmation of the contract
	        "/api/v1/contract/txconfirmations": [{
	            method: "GET",
	            action: controllers.privateEthereumController.transactionConfirmations,
	            views: {
	                json: views.jsonView
	            }
	        }],
	        // get the transaction detail
	        "/api/v1/contract/transactiondetail": [{
	            method: "GET",
	            action: controllers.privateEthereumController.transactionDetail,
	            views: {
	                json: views.jsonView
	            }
	        }],
 /* ----------------------------------------------------------------------------------  */
	    // ----------- contract api

				  // create contract
				  "/api/v1/contract/createcontract": [{
				      method: "POST",
				      action: controllers.privateEthereumController.smartContract,
				      middleware: [validater(validationFile.privateCreateContract)],
				      views: {
				          json: views.jsonView
				      }
				    }],
	        // excute the function of contract
	        "/api/v1/contract/assignandremove": [{
	            method: "POST",
	            action: controllers.privateEthereumController.assignandremove,
	            middleware: [validater(validationFile.privateRunContract)],
	            views: {
	                json: views.jsonView
	            }
	        }],

	        // review the contract
	        "/api/v1/contract/review": [{
	            method: "POST",
	            action: controllers.privateEthereumController.review,
	            middleware: [validater(validationFile.review)],
	            views: {
	                json: views.jsonView
	            }
	        }],

	        // revoke the contract
	        "/api/v1/contract/revoke": [{
	            method: "POST",
	            action: controllers.privateEthereumController.revoke,
	            middleware: [validater(validationFile.revoke)],
	            views: {
	                json: views.jsonView
	            }
	        }],

	        // change state of contract ACK , DECLINE ,
	        "/api/v1/contract/changestate": [{
	            method: "POST",
	            action: controllers.privateEthereumController.changestate,
	            middleware: [validater(validationFile.changestate)],
	            views: {
	                json: views.jsonView
	            }
	        }],
					// ,
	        "/api/v1/contract/sendHashIntransaction": [{
	            method: "POST",
	            action: controllers.privateEthereumController.sendHashIntransaction,
	            middleware: [validater(validationFile.sendHashIntransaction)],
	            views: {
	                json: views.jsonView
	            }
	        }],
					// change state of contract ACK , DECLINE ,
					"/api/v1/contract/getHashIntransaction": [{
							method: "GET",
							action: controllers.privateEthereumController.getHashIntransaction,
							middleware: [],
							views: {
									json: views.jsonView
							}
					}],
	        // get the detail of the contract
	        "/api/v1/contract/userdetail": [{
	            method: "POST",
	            action: controllers.privateEthereumController.userdetail,
	            middleware: [validater(validationFile.userdetail)],
	            views: {
	                json: views.jsonView
	            }
	        }],

	        // log for the contract
	        "/api/v1/contract/log": [{
	            method: "POST",
	            action: controllers.privateEthereumController.log,
	            middleware: [validater(validationFile.log)],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        // log for file modify in the contract
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

	        // use for fetch data for the user
	        "/api/v1/contractPublish/fetchData": [{
	            method: "GET",
	            action: controllers.publishDataController.fetchData,
	            views: {
	                json: views.jsonView
	            }
	        }],
	        // get detail of batch id  (batchid is a  id given when transaction is publish)
	        "/api/v1/contractPublish/batchData/:id": [{
	            method: "GET",
	            action: controllers.publishDataController.batchData,
	            views: {
	                json: views.jsonView
	            }
	        }],

	  /* --------------------------------------------------------------------------------------- */
	      // get data from the message queue

	        // used when we have azure message queue to receive the message
	        "/api/v1/queue/reciveMessageQueue": [{
	            method: "GET",
	            action: controllers.messageQueueController.reciveMessageQueue,
	            views: {
	                json: views.jsonView
	            }
	        }],

	        // used to  send the data to the azure message queue
	        "/api/v1/queue/sendToQueue": [{
	            method: "GET",
	            action: controllers.messageQueueController.sendMessageQueue,
	            views: {
	                json: views.jsonView
	            }
	        }],

	    /* ------------------------------------------------------------------------------------ */

	        // find the balance of account
	        "/api/v1/contract/Balance": [{
	            method: "GET",
	            action: controllers.privateEthereumController.accountBalance,
	            views: {
	                json: views.jsonView
	            }
	        }],


	        // send ether to other account
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
	            // dummy api just for developer to assign balance in multiple account . not for production
	        "/api/v1/insertBalance": [{
	            method: "GET",
	            action: controllers.privateEthereumController.insertBalance,
	            views: {
	                json: views.jsonView
	            }
	        }],
	        // don't need it in production
	        "/api/v1/publishdata": [{
	            method: "POST",
	            action: controllers.publishDataController.sendData,
	            views: {
	                json: views.jsonView
	            }
	        }],
	        "/api/v1/contract/testContract": [{
	            method: "GET",
	            action: controllers.privateEthereumController.testContract,
	            views: {
	                json: views.jsonView
	            }
	        }],
	        "/api/v1/requestconfirmation/:requestid": [{
	            method: "GET",
	            action: controllers.privateEthereumController.requestConfirmation,
	            views: {
	                json: views.jsonView
	            }
	        }],
	        "/api/v1/chain/latestBlockdata": [{
	                method: "GET",
	                action: controllers.privateEthereumController.latestBlock,
	                views: {
	                    json: views.jsonView
	                }

	            }]
	            // "/api/v1/getpublishdata": [{
	            //     method: "GET",
	            //     action: controllers.publishDataController.getData,
	            //     views: {
	            //         json: views.jsonView
	            //     }
	            // }],
	            // "/api/v1/checkForRequest": [{
	            // 		method: "GET",
	            // 		action: controllers.privateEthereumController.checkForRequest,
	            // 		views: {
	            // 				json: views.jsonView
	            // 		}
	            // }],
	            // ,"/api/coinbase/balance": [{
	            //     method: "GET",
	            //     action: controllers.coinbaseController.notifications,
	            //     views: {
	            //         json: views.jsonView
	            // }]
	            //     }
	            // ,	"/api/v1/sendether": [{
	            // 		method: "POST",
	            // 		action: controllers.ethereumController.createTransaction,
	            // 		views: {
	            // 			json: views.jsonView
	            // 		}
	            // 	}
	            // ]
	            // 		,
	            // "/api/coinbase/accounts": [{
	            // 				method: "GET",
	            // 				action: controllers.coinbaseController.notifications,
	            // 				views: {
	            // 										 json: views.jsonView
	            // 								}
	            // 			 }],
	            //
	            //
	            // "/api/coinbase/createAccount": [{
	            // 			 method: "GET",
	            // 			 action: controllers.coinbaseController.createAccount,
	            // 			 views: {
	            // 								json: views.jsonView
	            // 							}
	            // 				}]
	            // 			,"/api/v1/balance": [{
	            // 	method: "POST",
	            // 	action: controllers.ethereumController.accountBalance,
	            // 	views: {
	            // 		json: views.jsonView
	            // 	}
	            // }
	            // ],
	            // "/api/v1/coinbaseBalance": [{
	            // 	method: "GET",
	            // 	action: controllers.privateEthereumController.coinbaseBalance,
	            // 	views: {
	            // 		json: views.jsonView
	            // 	}
	            // }
	            // ]
	            // ,"/api/v1/createaccount": [{
	            // 		method: "POST",
	            // 		action: controllers.ethereumController.createAccount,
	            // 		views: {
	            // 			json: views.jsonView
	            // 		}
	            // 	}
	            // ]
	            // ,
	            // "/api/v1/saveFileAndGenerateHash": [{
	            // 		method: "POST",
	            // 		action: controllers.privateEthereumController.saveFileAndGenerateHash,
	            // 		views: {
	            // 			json: views.jsonView
	            // 		}
	            // 	}
	            // ]
	            // ,"/api/v1/txConfirmations": [{
	            // 		method: "POST",
	            // 		action: controllers.ethereumController.transactionConfirmations,
	            // 		views: {
	            // 			json: views.jsonView
	            // 		}
	            // 	}
	            // ]
	            // ,	"/api/v1/sendether": [{
	            // 		method: "POST",
	            // 		action: controllers.ethereumController.createTransaction,
	            // 		views: {
	            // 			json: views.jsonView
	            // 		}
	            // 	}
	            // ]
	            // ,	"/api/v1/transactionDetail": [{
	            // 			method: "POST",
	            // 			action: controllers.ethereumController.transactionDetail,
	            // 			views: {
	            // 				json: views.jsonView
	            // 			}
	            // 		}
	            // 	]
	            //,
	            // "/api/v1/privateImageHashGenerate": [{
	            // 		method: "POST",
	            // 		action: controllers.privateEthereumController.privateImageHashGenerate,
	            // 		middleware: [multipartMiddleware],
	            // 		views: {
	            // 				json: views.jsonView
	            // 		}
	            // }],
	            // "/api/v1/privateImageHashtoContract": [{
	            // 		method: "POST",
	            // 		action: controllers.privateEthereumController.privateImageHashtoContract,
	            // 		middleware: [multipartMiddleware],
	            // 		views: {
	            // 				json: views.jsonView
	            // 		}
	            // }]
	    };
	};
