'use strict';
class PrivateEthereumUtilities{
  constructor() {

  }
  unlockAccount(owner, password, duration, cb) {
      privateWeb3.personal.unlockAccount(owner, password, 120, function(error, result) {
          cb(error, result);
      });
  }
  estimateGas(account, bytecode, cb) {
          privateWeb3.eth.estimateGas({
              from: account,
              data: bytecode
          }, function(error, gas) {
              Logger.info("gas: ", error, gas);
              cb(error, gas);
          });
      }
  selectForDataBase(contractAddress, cb) {
              domain.Contract.query().where({
                  'contractAddress': contractAddress
              }).select().then(function(data) {
                  let contData = data;
                  cb(contData[0].abi, contData[0].bytecode, contData[0].salt);
              });
  }
      //  convert abi defination of contract
  convertToAbi(cb) {
    fs.readFile(__dirname + '/solidity/NumberContract.sol', 'utf8', function(err, solidityCode) {
          if (err) {
              console.log("error in reading file: ", err);
              return;
          } else {
              Logger.info("File Path: ", __dirname + '/solidity/NumberContract.sol');
              Logger.info(new Date());
              Logger.info("-----compling solidity code ----------");
              Logger.info(new Date());
              var compiled = solc.compile(solidityCode, 1).contracts.documentAccessMapping;
              Logger.info("-----complile complete ----------");
              Logger.info(new Date());
              const abi = JSON.parse(compiled.interface);
              // fs.writeFile('./solidity/abi.json', compiled.interface, (err) => {
              //   console.log("errrrr",err)
              //
              // });
              Logger.info("bytecode: ", typeof compiled.bytecode, compiled.bytecode.length);
              const bytecode =compiled.bytecode;
              var smartSponsor = privateWeb3.eth.contract(abi);
              cb(bytecode, smartSponsor, abi);
          }
      });
  //      var smartSponsor = privateWeb3.eth.contract(solAbi);
  //    cb(solBytecode,smartSponsor,solAbi);

  }
  decryptBuffer(buffer, password) {
      var decipher = crypto.createDecipher('aes-256-cbc', password)
      var dec = Buffer.concat([decipher.update(buffer), decipher.final()]);
      return dec;
  }
  encryptBuffer(buffer, password) {
      var cipher = crypto.createCipher('aes-256-cbc', password)
      var crypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
      return crypted;
  }
  saveToDb(contract, abi, recordObj, bytecode, gas, callback) {
      domain.Contract.query().insert({
          contractAddress: contract.address,
          transactionHash: contract.transactionHash,
          abi: JSON.stringify(abi),
          senderAddress: recordObj.owner,
          bytecode: bytecode,
          salt: recordObj.salt,
          receipentAddress: recordObj.recipient,
          startTime:knex.fn.now(),
          endTime:knex.fn.now()
      }).then(function(databaseReturn) {
          //Logger.info("Inserted data: ", databaseReturn);
          var arr = {};
          arr.contractAddress = contract.address;
          arr.txnHash = contract.transactionHash;
          arr.gasUsed = gas;
          //arr.tranHash = transactionHash;
          Logger.info("contractAddress: ", arr.contractAddress);
          callback(null, arr);
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

module.exports =new PrivateEthereumUtilities();
