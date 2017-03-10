'use strict';

class SimpleHashTransaction {

    constructor() {

    }

    // send file hash in transaction
    sendRawHashIntransaction(req, res, callback) {
        Logger.info("data in transaction", req.body, privateWeb3.toHex(6))
        let resData = {};

        var Tx = require('ethereumjs-tx')
        var crypto = require('crypto')
            //    var privateKey = crypto.randomBytes(32)
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
            //  if (!err)

            console.log("hiii", err, hash); // "0x7f9fade1c0d57a7af66ab4ead79fade1c0d57a7af66ab4ead7c2c2eb7b11a91385"
            callback(err, hash);
        });

    }

    // send file hash in raw  transaction
    sendHashIntransaction(req, res, callback) {

        Logger.info("data in transaction", req.body.data)
        let resData = {};
        privateWeb3.eth.sendTransaction({
            from: req.body.fromAddress,
            to: req.body.toAddress,
            //  value: privateWeb3.toWei(1, 'ether'),
            data: privateWeb3.fromAscii(req.body.data) // req.body.data
        }, (tx_error, tx_result) => {
            if (!tx_error) {
                resData.transactionResult = tx_result;
                let result = {};
                result.senderAddress = req.body.fromAddress;
                result.reciverAddress = req.body.toAddress;
                result.transactionHash = tx_result;
                result.data = req.body.data;
                utility.saveToTransactionData(result);
                callback(null, resData);
            } else {
                callback(tx_error);
            }
        });
    }

    // get hash data from transaction
    getHashIntransaction(req, res, callback) {
        //  Logger.info("data in transaction",req.body.data)
        let resData = {};
        privateWeb3.eth.getTransaction(req.query.tranxHash, function(error, blockByHash) {
            if (!error) {
                if (blockByHash != null) {
                    //  console.log("blockhash----> ",blockByHash);
                    //  resData = blockByHash;
                    resData.originalData = privateWeb3.toAscii(blockByHash.input);
                    resData.blockNumber = blockByHash.blockNumber;
                    resData.hash = blockByHash.hash;
                    resData.input = blockByHash.input;
                    if (!blockByHash.blockNumber) {

                        resData.message = "Block is not created";

                    } else {
                        resData.message = "Block is created";
                    }
                    //  resData.block = blockByHash;
                    //resData.latest = bestBlock.number;
                    callback(null, resData);
                    //callback(null, resData);
                } else {
                    //  resData.totalConfirmations = 0;
                    resData.message = "Block hash not genrated"
                        //resData = new Error(error);
                        //resData.status = 500;
                    callback(null, resData);
                    //callback(resData,null);

                }
            } else {

                resData = new Error(configurationHolder.errorMessage.blockchainIssue);
                resData.status = 500;
                callback(resData, null);
                // callback(resData,null);
            }
        });
    }

}
module.exports = new SimpleHashTransaction();
