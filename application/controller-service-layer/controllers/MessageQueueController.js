module.exports = function() {

    var getMessageQueue = function(req, res, callback) {

        this.services.messageQueue.getFromQueue(callback);

    }
    var reciveMessageQueue = function(req, res, callback) {

        this.services.messageQueue.receiveFormQueue(callback);

    }
    var sendMessageQueue = function(req, res, callback) {

        this.services.messageQueue.sendToQueue(req,callback);

    }

    return {
        getMessageQueue: getMessageQueue,
        reciveMessageQueue: reciveMessageQueue,
        sendMessageQueue: sendMessageQueue

    }


}
