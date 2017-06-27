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


MessageProducer.prototype.sendMessage = function sendMessage(messageToPublish, scheduledTime, correlationId){

  console.log(' sendMessage function called ');
  this._stompClient.publish('/queue/transaction-retry-queue', messageToPublish,{
    "AMQ_SCHEDULED_DELAY" : scheduledTime,
    "correlation-id" : correlationId
    });
  }

module.exports = new MessageProducer();
