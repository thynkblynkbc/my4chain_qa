'use strict';
class MessageQueue {


    constructor() {
        this.azure = require('azure');
        this.nameSpace = "futuron.servicebus.windows.net/blockchaintest";
      //  this.accessKey = "Endpoint=sb://futuron.servicebus.windows.net/;SharedAccessKeyName=RootManageSharedAccessKey;SharedAccessKey=hfASZmV9Wc5A+i42JqJuW/RIOpUQzqhw8VPxhIdqtbg=";
      this.accessKey =configurationHolder.config.azureQueue;
       this.azureObject = this.azure.createServiceBusService(this.accessKey);
       this.createAqueue();
    }
    createAqueue(){

      this.azureObject.createQueueIfNotExists('my4chain', function(error){
            if(!error){
               // Queue exists
                  Logger.info("create a queue")
               Logger.info("Successfull",error);
             }else {
                 Logger.info("create a queue1")
               Logger.info("Error in creating queue",error);
             }
         });

    }
    sendToQueue(req,callback) {
Logger.info("inside sendQueue");
      var message = {
            body: "request Data",
            customProperties: {
              resultproperty: req.body
            }};
            console.log("req.body1",req.body);
              this.azureObject.sendQueueMessage('my4chain', message, (error) => {
                  if(!error){
                    //  callback(null,{message:JSON.stringify(error)});
                      // message sent
                    }else{

                    //  callback(null,{message:error});
                    }
                });

    }
    receiveFormQueue(callback) {
      this.azureObject.receiveQueueMessage('my4chain', (error, lockedMessage) =>{
          if(!error){
           console.log("lockedMessage",lockedMessage);
            callback(null,{message:lockedMessage});
              // Message received and locked
        //         this.azureObject.deleteMessage(lockedMessage, function (deleteError){
        //             if(!deleteError){
        //    // Message deleted
        //  }
        // });
      }else{
          //console.log(error,"lockedMessage",lockedMessage)
        callback(null,{message:"no data"});
      }
          });

    }
    deleteInQueue() {


    }
    getFromQueue(callback) {

        this.azureObject.getQueue('my4chain', (error, queue)=> {
            if (!error) {
                this.azureObject.createQueueIfNotExists('my4chain', (error, queue) => {
                    if (!error){
                    callback(null,{message:JSON.stringify(queue)});
                        Logger.info("created startup queue 1: " + JSON.stringify(queue) + "\n");
                    }else{
                        Logger.info("don't got startup queue 1: " + JSON.stringify(error) + "\n");
                      }
                });
            } else {
                Logger.info("we got data");
                  callback(error,{message:JSON.stringify(queue)});
            }
        });

    }

}

module.exports = new MessageQueue();
