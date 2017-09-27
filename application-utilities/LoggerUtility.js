var logger = null;
var errlogger = null;
  if (process.env.NODE_ENV === 'test') {
    console.log("Test logging framwork");
    logger = new (winston.Logger)({
         transports: [
          //  new (winston.transports.Console)({prettyPrint: false}),
           new (winston.transports.File)({ filename: 'testInfo.log' ,json:true,timeStamp:new Date()})
         ],
         exitOnError: false
       });
       errlogger = new (winston.Logger)({
            transports: [
              new (winston.transports.Console)({ handleExceptions: true,
              json: true,timeStamp:new Date()}),
              new (winston.transports.File)({ filename: 'seedInfoerr.log' ,json:true,timeStamp:new Date()})
            ],
            exitOnError: false
          });
}else{
  console.log("Live logging framwork");
 logger = new (winston.Logger)({
      transports: [
        new (winston.transports.Console)({ handleExceptions: true,
        json: true,timeStamp:new Date()}),
        new (winston.transports.File)({ filename: 'seedInfo.log' ,json:true,timeStamp:new Date()})
      ],
      exitOnError: false
    });
    errlogger = new (winston.Logger)({
         transports: [
           new (winston.transports.Console)({ handleExceptions: true,
           json: true,timeStamp:new Date()}),
           new (winston.transports.File)({ filename: 'seedInfoerr.log' ,json:true,timeStamp:new Date()})
         ],
         exitOnError: false
       });
}
module.exports.logger = logger;
module.exports.errlogger = errlogger;
