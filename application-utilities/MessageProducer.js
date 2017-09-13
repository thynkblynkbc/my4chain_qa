'use strict';
var Stomp = require('stomp-client');
var MessageProducer = function MessageProducer(){
  this._stompClient = null;
};


MessageProducer.prototype.init = function init(callback){
  this._stompClient = new Stomp('127.0.0.1', 61613, 'user', 'pw');
  this._stompClient.connect(function(sessionId){
    console.log('connected to ActiveMQ server and MessageProducer running with sessionId : ', sessionId);
  });
};

var txRetryQueue;
if (process.env.NODE_ENV == 'development') {
    txRetryQueue = 'transaction-retry-queue-dev';
} else if (process.env.NODE_ENV == 'production') {
    txRetryQueue = 'transaction-retry-queue-prod';
} else if (process.env.NODE_ENV == 'qa') {
    txRetryQueue = 'transaction-retry-queue-qa';
}

MessageProducer.prototype.sendMessage = function sendMessage(messageToPublish, scheduledTime, correlationId){
  console.log(' sendMessage function called ');

if (process.env.NODE_ENV == 'development') {
  this._stompClient.publish('/queue/transaction-retry-queue-dev', messageToPublish,{
    "AMQ_SCHEDULED_DELAY" : scheduledTime,
    "correlation-id" : correlationId
    });
  } else if(process.env.NODE_ENV == 'production')
  {
    this._stompClient.publish('/queue/transaction-retry-queue-prod', messageToPublish,{
      "AMQ_SCHEDULED_DELAY" : scheduledTime,
      "correlation-id" : correlationId
      });
  } else if(process.env.NODE_ENV == 'qa')
  {
    this._stompClient.publish('/queue/transaction-retry-queue-qa', messageToPublish,{
      "AMQ_SCHEDULED_DELAY" : scheduledTime,
      "correlation-id" : correlationId
      });
  }

  }

module.exports = new MessageProducer();
