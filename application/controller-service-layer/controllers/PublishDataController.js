module.exports = function() {
    var sendData = function(req, res, callback) {
        this.services.publishDataService.sendData(req, res, callback);
    }
    var getData = function(req, res, callback) {
        this.services.publishDataService.getData(req, res, callback);
    }
    return {
        sendData: sendData,
        getData: getData
    }
}
