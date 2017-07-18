var http = require('http');
var querystring = require('querystring');
//const postData = querystring.stringify(body);

function byPassRequest(serverNode, path, body,callback) {
      var hostname = gethost()
      Logger.info(' body -- ',body);
      var resData = {};
      var stringifiedBody = querystring.stringify(body);
      Logger.info('I am in byPassRequest method');

      function gethost() {
          switch (serverNode) {
              case 'blkchain_server1':
                  return '10.0.0.4';
                  break;
              case 'blkchain_server2':
                  return '10.0.0.5';
                  break;
              case 'blkchain_server3':
                  return '10.0.1.4';
                  break;
              case 'blkchain_server4':
                  return '10.0.2.4';
                  break;
              default:
                  return 'localhost';
          }
      }

      const options = {
          hostname: hostname,
          port: 3000,
          path: path,
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(stringifiedBody)
          }
      };

    const req = http.request(options, (res) => {
    res.setEncoding('utf8');
    res.on('data', (chunk) => {
        console.log('body ', chunk);
        callback(chunk);
    });
    res.on('end', () => {
      //  console.log('No more data in response.');
    });
});
req.on('error', (e) => {
  //  console.error('problem with request:', e);
});
// write data to request body
req.write(stringifiedBody);
req.end()
}

module.exports = byPassRequest;
