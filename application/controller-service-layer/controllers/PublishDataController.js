module.exports = function() {
    var sendData = function(req, res, callback) {
        this.services.publishDataService.sendData(req, res, callback);
    }

    var fetchData = function(req, res, callback) {
        //	var password=req.body.password;

        this.services.publishDataService.getData(req, res, callback);
    }
    var batchData = function(req, res, callback) {
        //	var password=req.body.password;

        this.services.publishDataService.batchData(req, res, callback);
    }
    return {
        sendData: sendData,
        fetchData: fetchData,
        batchData: batchData
    }
}
