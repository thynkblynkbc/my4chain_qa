var nodemailer = require('nodemailer');
var util = require('util');
var emailOptionsByCron = require(__dirname+'/../../../../configurations/emailConfig.js');
//var options=require("../configurations/emailConfig.js")();

class sendmail {
    constructor() {}
  EmailLogFile(recordObj, res, callback) {

    var options = global.SMTPdetail;
    if(!options)
    {
      options = emailOptionsByCron;
    };
    var mailReceiver = recordObj.query.emails;
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
      html: options.message,
      attachments: options.attachments
    };
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
