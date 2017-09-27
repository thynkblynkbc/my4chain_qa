'use strict';
class PrivateEthereumUtilities {
    constructor() {}
    unlockAccount(owner, password, count, cb) {
        privateWeb3.personal.unlockAccount(owner, password, function(error, result) {
            cb(error, result);
            return;
        });
    }
    estimateGas(account, bytecode, cb) {
        privateWeb3.eth.estimateGas({
            from: account,
            data: bytecode
        }, function(error, gas) {
            Logger.info("gas: ", error, gas);
            cb(error, gas);
            return;
        });
    }
    checkUserAuth(userAddress, password, cb) {
        Logger.info("data --");
        Logger.info(new Date());
        domain.User.query().where({
            'accountAddress': userAddress,
            'ethPassword': password
        }).select().then(function(data) {
            if (data.length > 0) {
                Logger.info(new Date());
                cb(true);
                return;
            } else {
                cb(false);
                return;
            }
        });
    }
    selectForDataBase(contractAddress, cb) {
        Logger.info("Inside selectForDataBase ", contractAddress);
        domain.Contract.query().where({
            'contractAddress': contractAddress
        }).select().then(function(data) {
            let contData = data;
            cb(contData[0].abi, contData[0].bytecode, contData[0].salt);
            return;
        });
    }
    //  convert abi defination of contract
    convertToAbi(cb) {
        var web3x = privateWeb3;
        let smartSponsor = web3x.eth.contract(solAbi);
        let resData = {};
        resData.bytecode = "0x" + solBytecode;
        resData.smartSponsor = smartSponsor;
        resData.abi = solAbi;
        resData.web3x = web3x;
        cb(null, resData);
        return;
    }
    decryptBuffer(buffer, password) {
        var decipher = crypto.createDecipher('aes-128-cbc', password)
        var dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
        return dec;
    }
    encryptBuffer(buffer, password) {
        var cipher = crypto.createCipher('aes-128-cbc', password)
        var crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
        return crypted;
    }
    saveToTransactionData(data) {
        domain.TransactionDataLog.query().insert({
            sendAddress: data.senderAddress,
            reciveAddress: data.reciverAddress,
            transactionHash: data.transactionHash,
            data: data.data,
            transactionId: data.transactionId
        }).then(function(databaseReturn) {
            Logger.info("Transaction saved to DB", databaseReturn);
            return;
        });
    }
    saveToDb(contract, abi, recordObj, bytecode, gas, callback) {
        domain.Contract.query().insert({
            contractAddress: "NaN",
            transactionHash: contract.transactionHash,
            abi: JSON.stringify(abi),
            senderAddress: recordObj.owner,
            bytecode: bytecode,
            salt: recordObj.salt,
            receipentAddress: recordObj.recipient,
            startTime: knex.raw("'" + moment.utc(recordObj.startDate).format("YYYY-MM-DD hh:mm:ss.s") + "'"),
            endTime: knex.raw("'" + moment.utc(recordObj.expireDate).format("YYYY-MM-DD hh:mm:ss.s") + "'"),
            fileHash: recordObj.encryptHash
        }).then(function(databaseReturn) {
            return;
        });
    }
    updateToDb(contract, abi, recordObj, bytecode, gas, callback) {
        domain.Contract.query().patch({
                contractAddress: contract.address
            })
            .where('transactionHash', '=', contract.transactionHash)
            .then(function(databaseReturn) {
                var arr = {};
                arr.contractAddress = contract.address;
                arr.txnHash = contract.transactionHash;
                domain.ContractLog.query().insert({
                    contractAddress: contract.address,
                    transactionHash: contract.transactionHash,
                    callerAddress: recordObj.owner,
                    action: "contract_create"
                }).then(function(databaseReturn) {});
                Logger.info("contractAddress: ", arr.contractAddress);
                return;
            });
    }
    encrypt(text, from, to, password) {
        var cipher = crypto.createCipher('aes-256-cbc', password);
        var crypted = cipher.update(text, from, to);
        crypted += cipher.final(to);
        return crypted;
    }
    decrypt(text, from, to, password) {
        var decipher = crypto.createDecipher('aes-256-cbc', password);
        var dec = decipher.update(text, from, to)
        dec += decipher.final(to);
        return dec;
    }
}
module.exports = new PrivateEthereumUtilities();
