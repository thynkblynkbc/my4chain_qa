'use strict';

class PrivateBlockchainFunction{
constructor() {
  
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

}

module.exports =new PrivateBlockchainFunction();
