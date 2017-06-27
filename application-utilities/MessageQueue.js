var azure = require('azure');
var nameSpace = "futuron.servicebus.windows.net/blockchaintest";
var accessKey = "Endpoint=sb://chaintrailbc.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=yparn5aR8P7T5WMMBT6n69K3MGRg0nDDr+Ndc96vilY=";
var serviceBusService = azure.createServiceBusService(accessKey);

module.exports = function() {

    var createTopicAndSubs = function(topic, subscription) {
      Logger.info('I am in create topic function');
        serviceBusService.createTopicIfNotExists(topic, function(error) {
            if (!error) {
                // Queue exists
                Logger.info(topic+" Topic created ");

              serviceBusService.createSubscription(topic, subscription, function(error) {
                            if (!error) {
                                // subscription created
                                Logger.info( subscription+' subscription created under '+topic);
                            } else
                            {
                              Logger.info(' error in creating '+subscription+' subscription under '+topic+' topic',error);
                            }
                        });
            } else {
                Logger.info("Error in creating topic "+topic, error);
            }
        });

    }

    var sendTopicMessage = function(topic, message, callback) {
        serviceBusService.sendTopicMessage(topic, message, function(error) {
            if (error) {
                callback(error);
            } else {
                callback(null);
            }
        })
    }

    var listTopics = function() {
        serviceBusService.listTopics(function(error, result, response) {
            if (error) {
                console.log(' error in getting list of topics ', error);
            } else {
                console.log(' result ', JSON.stringify(result, null, 2));
                console.log(' response ', JSON.stringify(response, null, 2));
            }
        })
    }

    var deleteTopic = function (topicName) {
        serviceBusService.deleteTopic(topicName, function(error) {
            if (error) {
                console.log('error in deleting ', topicName, error);
            } else {
                console.log(topicName, ' deleted ');
            }
        });
    }

    var listSubscriptions = function () {
        serviceBusService.listSubscriptions(function(error, result, response) {
            if (error) {
                console.log(' error in getting list of subscriptions ', error);
            } else {
                console.log(' result ', JSON.stringify(result, null, 2));
                console.log(' response ', JSON.stringify(response, null, 2));
            }
        })
    }

    var receiveSubscriptionMessage = function(topic, subscription, callback) {
        serviceBusService.receiveSubscriptionMessage(topic, subscription,{
            isPeekLock: true
        }, function(error, receivedMessage) {
            if (error) {
                callback(error, null);
            } else {
                callback(null, receivedMessage);
            }
        })
    }

    var deleteMessage = function(lockedMessage, callback) {
        serviceBusService.deleteMessage(lockedMessage, function(deleteError) {
            if (deleteError) {
                callback(deleteError, null);
            } else {
                callback(null, 'message has been deleted');
            }
        })
    }

    return {
        createTopicAndSubs: createTopicAndSubs,
        sendTopicMessage: sendTopicMessage,
        listTopics: listTopics,
        deleteTopic: deleteTopic,
        listSubscriptions: listSubscriptions,
        receiveSubscriptionMessage: receiveSubscriptionMessage,
        deleteMessage: deleteMessage
    }
}()
;