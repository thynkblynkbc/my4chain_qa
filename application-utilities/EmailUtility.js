/*var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: configurationHolder.config.emailFrom,
        pass: configurationHolder.config.emailPassword
    }
});
module.exports.email = function(fromEmail, toEmail, subject, emailBody) {
    transporter.sendMail({
        from: fromEmail,
        to: toEmail,
        subject: subject,
        text: emailBody
    })
}*/

var sendmail = require(__dirname+'/../application/controller-service-layer/services/PrivateBlockchain/sendmail.js');
var recordObj = {"query":{"email":"neeraj.kumar@oodlestechnologies.com"}};
//var recordObj = {"query":{}};
var logf = sendmail.EmailLogFile(recordObj,"",function(error,message){
  console.log(message);
})
