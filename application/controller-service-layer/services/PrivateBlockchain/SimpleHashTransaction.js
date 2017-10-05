'use strict';
var utility = require('./PrivateEthereumUtilities');
var broadcast = require('../../../../application-utilities/BroadcastTransactions.js');
class SimpleHashTransaction {
    constructor() {}
    // send file hash in transaction
    sendRawHashIntransaction(req, res, callback) {
        Logger.info("data in transaction", req.body, privateWeb3.toHex(6))
        let resData = {};
        var Tx = require('ethereumjs-tx')
        var crypto = require('crypto')
        var privateKey = privateKey = Buffer.from('e331b6d69882b4cb4ea581d88e0b604039a3de5967688d3dcffdd2270c0fd109', 'hex')
        var gasPrice = privateWeb3.eth.gasPrice;
        var gasPriceHex = privateWeb3.toHex(gasPrice);
        var nonce = privateWeb3.eth.getTransactionCount(req.body.fromAddress);
        var nonceHex = privateWeb3.toHex(nonce);
        var rawTx = {
            from: req.body.fromAddress,
            nonce: nonceHex,
            gasPrice: gasPriceHex,
            gasLimit: '0x2710000000',
            gas: privateWeb3.toHex(1000000),
            to: req.body.toAddress,
            from: req.body.fromAddress,
            data: '0x7f7465737432000000000000000000000000000000000000000000000000000000600057',
            chainId: privateWeb3.toHex(6)
        }
        Logger.info("rawTx in transaction", rawTx)
        var tx = new Tx(rawTx)
        console.log(tx);
        tx.sign(privateKey)
        var serializedTx = tx.serialize()
        console.log(serializedTx.toString('hex'), tx)
        privateWeb3.eth.sendRawTransaction(serializedTx.toString('hex'), function(err, hash) {
            console.log("hiii", err, hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
            callback(err, hash);
        });
    }
    broadcastTransactions(req, res, callback) {
        var resData = {};
        resData.message = 'sent'
        Logger.info('in broadcastTransactions function');
        broadcast(req)
        callback(null, resData);
    }
    // send file hash in raw  transaction
    sendHashIntransaction(req, res, callback) {
        let resData = {};
        var message = {
            fileHash: req.body.fileHash,
            fromAddress: req.body.fromAddress,
            password: req.body.password,
            toAddress: req.body.toAddress,
            transactionId: req.body.transactionId
        }
        var txRequestTopic;
        if (process.env.NODE_ENV == 'development') {
            txRequestTopic = 'transaction-request-queue-dev';
        } else if (process.env.NODE_ENV == 'production') {
            txRequestTopic = 'transaction-request-queue-prod';
        } else if (process.env.NODE_ENV == 'qa') {
            txRequestTopic = 'transaction-request-queue-qa';
        } else if (process.env.NODE_ENV == 'local') {
            txRequestTopic = 'transaction-request-queue-local';
        }
        azureQueue.sendTopicMessage(txRequestTopic, JSON.stringify(message), (error) => {
            if (error) {
                Logger.info('Error in sending transaction to transaction-request-queue');
                callback(error, null);
            } else {
                Logger.info('Transaction sent to transaction-request-queue');
                resData.message = 'Transaction sent to request-queue';
                callback(null, resData);
            }
        })
    }
    // get hash data from transaction
    getHashIntransaction(req, res, callback) {
        let resData = {};
        privateWeb3.eth.getTransaction(req.query.tranxHash, function(error, blockByHash) {
            if (!error) {
                if (blockByHash != null) {
                    resData.fileHash = privateWeb3.toAscii(blockByHash.input);
                    resData.blockNumber = blockByHash.blockNumber;
                    resData.hash = blockByHash.hash;
                    if (!blockByHash.blockNumber) {
                        resData.message = "Block is not created";
                    } else {
                        resData.message = "Block is created";
                    }
                    callback(null, resData);
                } else {
                    resData.message = "Block hash not genrated"
                    callback(null, resData);
                }
            } else {
                resData = new Error(configurationHolder.errorMessage.blockchainIssue);
                resData.status = 500;
                callback(resData, null);
            }
        });
    }
}
module.exports = new SimpleHashTransaction();
