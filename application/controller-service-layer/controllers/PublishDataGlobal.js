module.exports = function () {


  var sendData = function (req,res,callback){
        	this.services.publicDataService.sendData(req,  callback);

    }
    return {
        sendData:sendData

    }

}
