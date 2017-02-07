'use strict';
class PrivateEthereumUtilities{
  constructor() {

  }
  unlockAccount(owner, password,count, cb) {
    console.log("unlock function utitlies",owner,password)
      privateWeb3.personal.unlockAccount(owner, password,  function(error, result) {
        console.log("result",result)
          cb(error, result);
          return;
      });
  }
  estimateGas(account, bytecode, cb) {
  //  console.log("account ",account,bytecode);
          privateWeb3.eth.estimateGas({
              from: account,
              data: bytecode
          }, function(error, gas) {
              Logger.info("gas: ", error, gas);
              cb(error, gas);
              return;
          });
      }
  selectForDataBase(contractAddress, cb) {
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

    // fs.readFile(__dirname + '/solidity/NumberContract.sol', 'utf8', (err, solidityCode)=> {
    //       if (err) {
    //           console.log("error in reading file: ", err);
    //           cb(err,null);
    //           return;
    //       } else {
    //           try{
    //           Logger.info("File Path: ", __dirname + '/solidity/NumberContract.sol');
    //           Logger.info(new Date());
    //           Logger.info("-----compling solidity code ----------");
    //           Logger.info(new Date());
    //           var compiled = solc.compile(solidityCode, 1).contracts.documentAccessMapping;
    //           Logger.info("-----complile complete ----------");
    //           Logger.info(new Date());
    //
    //           const abi = JSON.parse(compiled.interface);
    //
    //           // fs.writeFile('./solidity/abi.json', compiled.interface, (err) => {
    //           //   console.log("errrrr",err)
    //           //
    //           // });
    //           Logger.info("bytecode: ", typeof compiled.bytecode, compiled.bytecode.length);
    //           const bytecode =compiled.bytecode;
    //           var smartSponsor = privateWeb3.eth.contract(abi);
    //           let resData = {};
    //           resData.bytecode="0x"+bytecode;
    //           resData.smartSponsor=smartSponsor; resData.abi=abi;
    //           cb(null ,resData);
    //           return;
    //         }catch(err){
    //           Logger.info("Exception in project:",err)
    //           cb(err,null);
    //           return;
    //         }
    //       }
    //   });
       let smartSponsor = privateWeb3.eth.contract(solAbi);
    let resData = {};
    resData.bytecode="0x"+solBytecode;
    resData.smartSponsor=smartSponsor; resData.abi=solAbi;
     cb(null,resData);
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
  saveToDb(contract, abi, recordObj, bytecode, gas, callback) {
      domain.Contract.query().insert({
          contractAddress: contract.address,
          transactionHash: contract.transactionHash,
          abi: JSON.stringify(abi),
          senderAddress: recordObj.owner,
          bytecode: bytecode,
          salt: recordObj.salt,
          receipentAddress: recordObj.recipient,
          startTime:knex.fn.now(recordObj.startfrom*1000),
          endTime:knex.fn.now(recordObj.expireDate*1000),
          fileHash:recordObj.encryptHash
      }).then(function(databaseReturn) {
          //Logger.info("Inserted data: ", databaseReturn);
          var arr = {};
          arr.contractAddress = contract.address;
          arr.txnHash = contract.transactionHash;
           //arr.gasUsed = gas;
          //arr.tranHash = transactionHash;
        //  callback(null ,arr)
          Logger.info("contractAddress: ", arr.contractAddress);
         return ;
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
