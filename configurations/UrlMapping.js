	module.exports = function(app) {
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
					"/api/queue/getQueue": [{
							method: "GET",
							action: controllers.messageQueueController.getMessageQueue,
							views: {
									json: views.jsonView
							}
					}],
					"/api/queue/reciveMessageQueue": [{
							method: "GET",
							action: controllers.messageQueueController.reciveMessageQueue,
							views: {
									json: views.jsonView
							}
					}],
					"/api/queue/sendToQueue": [{
							method: "GET",
							action: controllers.messageQueueController.sendMessageQueue,
							views: {
									json: views.jsonView
							}
					}],
	        "/api/v1/publishdata": [{
	            method: "POST",
	            action: controllers.publishDataController.sendData,
	            views: {
	                json: views.jsonView
	            }
	        }],
					"/api/v1/getpublishdata": [{
	            method: "GET",
	            action: controllers.publishDataController.getData,
	            views: {
	                json: views.jsonView
	            }
	        }],
	        "/api/v1/contract/Balance": [{
	            method: "GET",
	            action: controllers.privateEthereumController.accountBalance,
	            views: {
	                json: views.jsonView
	            }
	        }],
	        "/api/v1/contract/functionexcute": [{
	            method: "POST",
	            action: controllers.privateEthereumController.sponsorContract,
	            middleware: [validater(validationFile.privateRunContract)],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        "/api/v1/contract/review": [{
	            method: "POST",
	            action: controllers.privateEthereumController.review,
	            middleware: [validater(validationFile.review)],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        "/api/v1/contract/revoke": [{
	            method: "POST",
	            action: controllers.privateEthereumController.revoke,
	            middleware: [validater(validationFile.revoke)],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        "/api/v1/contract/changestate": [{
	            method: "POST",
	            action: controllers.privateEthereumController.changestate,
	            middleware: [validater(validationFile.changestate)],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        "/api/v1/contract/userdetail": [{
	            method: "POST",
	            action: controllers.privateEthereumController.userdetail,
	            middleware: [validater(validationFile.userdetail)],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        "/api/v1/contract/log": [{
	            method: "POST",
	            action: controllers.privateEthereumController.log,
	            middleware:[validater(validationFile.log)],
	            views: {
	                json: views.jsonView
	            }
	        }],
					"/api/v1/contract/fileModifylog": [{
	            method: "POST",
	            action: controllers.privateEthereumController.fileModifylog,
	            middleware:[validater(validationFile.log)],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        "/api/v1/contract/createcontract": [{
	            method: "POST",
	            action: controllers.privateEthereumController.smartContract,
	            middleware: [validater(validationFile.privateCreateContract)],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        "/api/v1/contract/sendether/:requestid": [{
	            method: "POST",
	            action: controllers.privateEthereumController.privateSendether,
	            middleware: [validater(validationFile.privateSendether)],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        "/api/v1/contract/createaccount": [{
	            method: "POST",
	            action: controllers.privateEthereumController.createAccount,
	            middleware: [validater(validationFile.createAccount)],
	            views: {
	                json: views.jsonView
	            }
	        }],
	        "/api/v1/contract/txconfirmations": [{
	            method: "GET",
	            action: controllers.privateEthereumController.transactionConfirmations,
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

	        "/api/v1/contract/transactiondetail": [{
	                method: "GET",
	                action: controllers.privateEthereumController.transactionDetail,
	                views: {
	                    json: views.jsonView
	                }
	            }]
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
