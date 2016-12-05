module.exports.contractExcute = function(){

function selectContactFormDataBase(cb){
    domain.Contract.query().orderBy('id', 'desc').limit(1).select().then(function(data) {
      //  console.log("Inserted data: ", data);
        let contData =  JSON.parse(JSON.stringify(data));
    //  console.log("new data: ", contData[0]);
        cb(contData[0]);
    });
  }
describe('Contract Transaction', function() {

    describe('Exceute transaction', function() {
        it('should assign role in the contract', function(done) {

            this.timeout(100000);
          selectContactFormDataBase((selectData) =>{
                let tableData=selectData;
                console.log(tableData.contractAddress);
            chai.request(server)
                .post('/api/v1/privateRunContract')
                .send({
                    "contractAddress": tableData.contractAddress,
                    "adminAddress": "0x872ea563b2194f6b5362b3e85ac8dcc6970268e8",
                    "password": "nivi11yogi77",
                    "accountAddress": "0x913acf833866dd1b0e90981b3ce08544cbc4b504",
                    "action": "CAN_REVOKE",
                    "method": "assignAction",
                    "val": 4,
                    "textValue": "Hello"
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.error.should.equal(false);
                    res.body.object.should.be.a('object');
                    res.body.object.should.have.property('txnHash');
                    done();
                });

              });

        });
        it('should assign second role in the contract', function(done) {

            this.timeout(100000);
            selectContactFormDataBase((selectData) =>{
                  let tableData=selectData;
            chai.request(server)
                .post('/api/v1/privateRunContract')
                .send({
                    "contractAddress":  tableData.contractAddress,
                    "adminAddress": "0x872ea563b2194f6b5362b3e85ac8dcc6970268e8",
                    "password": "nivi11yogi77",
                    "accountAddress": "0x913acf833866dd1b0e90981b3ce08544cbc4b504",
                    "action": "CAN_ACCEPT",
                    "method": "assignAction",
                    "val": 4,
                    "textValue": "Hello"
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                    res.body.should.be.a('object');
                    res.body.error.should.equal(false);
                    res.body.object.should.be.a('object');
                    res.body.object.should.have.property('txnHash');
                    done();
                });

              });

        });
        it('should get user role in the contract', function(done) {

            this.timeout(100000);
          selectContactFormDataBase((selectData) =>{
                let tableData=selectData;
            chai.request(server)
                .post('/api/v1/privateRunContract')
                .send({
                    "contractAddress": tableData.contractAddress,
                    "adminAddress": "0x872ea563b2194f6b5362b3e85ac8dcc6970268e8",
                    "password": "nivi11yogi77",
                    "accountAddress": "0x913acf833866dd1b0e90981b3ce08544cbc4b504",
                    "method": "getUserAction",
                    "val": 4,
                    "textValue": "Hello"
                })
                .end(function(err, res) {
                    res.should.have.status(200);
                    res.should.be.json;
                  //  res.body.should.be.a('object');
                    res.body.error.should.equal(false);
                  //  res.body.object.should.be.a('object');
                  console.log("res.body",res.body);
                    res.body.object[0].should.equal('CAN_REVOKE,CAN_ACCEPT');
                    done();
                });

            });

        });

    });

});

};
