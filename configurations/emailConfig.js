module.exports=function(){
  var newDate = new Date();
  var year = newDate.getFullYear();
  var month = newDate.getMonth()+1;
  var day = newDate.getDate();
  var ErrorLogfileName = "CreateAccountFailureLog_" + day +"_"+month+"_"+year+".log";
  var SuccessLogfileName = "CreateAccountSuccessLog_" + day +"_"+month+"_"+year+".log";

  return {
      auth:{
          user: 'my4chainblockchain@gmail.com',
          pass: 'my4chain@blockchain'
      },
      sender:'my4chainblockchain@gmail.com',
      subject:"my4chain // log file // ",
      message:"<HTML><HEAD><Title></title></head><Body><p>Dear Sir/Madam</p><p>Greetings of the day.</p>" +
              "<p>Please find the log file attached here for my4chain.</p>" +
              "<p>Thanking you.</p><p>Regards</p><p>my4chain</p><p>&nbsp;</p>" +
              "<p><strong>&nbsp;</strong></p></body>",
      attachments:
      [
          {   // filename and content type is derived from path
              path:__dirname+'/../'+ErrorLogfileName
          },
          {   // filename and content type is derived from path
              path:__dirname+'/../'+SuccessLogfileName
          }
      ],
      host:'smtp.gmail.com',
      port:587
   }
};
