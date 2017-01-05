'use strict';
class MessageQueue {

    constructor() {
        this.azure = require('azure');
      //  this.azureObject = this.azure.createServiceBusService(config.serviceBusNamespace, config.serviceBusAccessKey*);

    }
    sendToQueue() {


    }
    updateInQueue() {


    }
    deleteInQueue() {


    }
    getFromQueue() {

        // this.azureObject.getQueue('startup', function(error, queue) {
        //     if (!error) {
        //         this.azureObject.createQueueIfNotExists('startup', function(error, queue) {
        //             if (!error)
        //                 Logger.info("created startup queue 1: " + JSON.stringify(queue) + "\n");
        //             else
        //                 Logger.info("don't got startup queue 1: " + JSON.stringify(error) + "\n");
        //         });
        //
        //     } else {
        //         Logger.info("we got data");
        //     }
        // });

    }

}

module.exports = new MessageQueue();
