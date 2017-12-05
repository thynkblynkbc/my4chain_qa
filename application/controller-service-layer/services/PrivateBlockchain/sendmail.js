var nodemailer = require('nodemailer');
var util = require('util');
var fs = require('fs');

var emailOptionsByCron = require(__dirname+'/../../../../configurations/emailConfig.js');
//var options=require("../configurations/emailConfig.js")();

class sendmail {
    constructor() {}
  EmailLogFile(recordObj, res, callback) {

    var options = global.SMTPdetail;
    if(!options)
    {
      options = emailOptionsByCron();
    };
    var mailReceiver ;
    if(options.receiver && recordObj.query && recordObj.query.email)
    {
      mailReceiver = options.receiver+","+ recordObj.query.email;
    }else if (options.receiver) {
      mailReceiver = options.receiver;
    }else if (recordObj.query && recordObj.query.email) {
        mailReceiver = recordObj.query.email;
    }else{mailReceiver ="neeraj.kumar@oodlestechnologies.com" }

    //console.log("============ " +util.inspect(recordObj)+"############" +mailReceiver);
    var mailAuthenticationCredentials = {
        host: options.host,//'smtp.gmail.com',
        port: options.port,
        secure: false, // upgrade later with STARTTLS
        auth: options.auth
    };

    var mailOptions = {
      from: options.sender,
      to: mailReceiver, //'neeraj.kumar@oodlestechnologies.com',//options.receiver,
      subject: options.subject,
      html: options.message
      //attachments: options.attachments
    };
    var attachedFiles=new Array();
    options.attachments.forEach(function(value,index){
      if(fs.existsSync(value.path))
      {
        attachedFiles.push(value);
      }
    });
    //console.log("============ " +util.inspect(attachedFiles)+"############" );
    if(attachedFiles.length>0)
    {
       mailOptions.attachments = attachedFiles;
    }

    var transporter = nodemailer.createTransport(mailAuthenticationCredentials);
    //console.log("========================="+util.inspect(transporter)+"##################");

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
          callback(null, "message:mail Sent Successfully");
      }
    });
  }
}
module.exports = new sendmail();
