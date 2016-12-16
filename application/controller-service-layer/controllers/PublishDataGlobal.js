module.exports = function () {


  var sendData = function (req,res,callback){
        	this.services.publishDataService.sendData(req,  callback);

    }
    return {
        sendData:sendData

    }

}
