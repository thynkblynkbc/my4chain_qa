module.exports.getContract = function(){

function selectContactFormDataBase(cb){
    domain.Contract.query().orderBy('id', 'desc').limit(1).select().then(function(data) {
         domain.User.query().orderBy('id', 'asc').limit(4).select().then(function(Usdata) {
      //  console.log("Inserted data: ", data);
        let contData =  JSON.parse(JSON.stringify(data));
        let UserData =  JSON.parse(JSON.stringify(Usdata));
    //  console.log("new data: ", contData[0]);
        cb(contData[0],UserData);
        });
    });
  }

describe('GET USER ACTION', function() {

    describe('View Action', function() {

        it('should get user role of the contract', function(done) {

            this.timeout(100000);
          selectContactFormDataBase((selectData,userInfo) =>{
                let tableData=selectData;
            chai.request(server)
                .post('/api/v1/contract/userdetail')
                .send({
                     "contractAddress": tableData.contractAddress,
                    "accountAddress": userInfo[0].ethAddress
                })
                .end(function(err, res) {

                    res.should.have.status(200);
                    res.should.be.json;
                  //  res.body.should.be.a('object');
                    res.body.error.should.equal(false);
                  //  res.body.object.should.be.a('object');
                  console.log("res.body",res.body);
                  if(process.env.TEST_CASE == "seven"){
                   res.body.object.userdetail[0].should.equal('CAN_ASSIGN,CAN_ACK');
                  } else if(process.env.TEST_CASE == "nine"){
                      res.body.object.userdetail[0].should.equal('CAN_ASSIGN,CAN_REVOKE,CAN_ACCEPT,CAN_DECLINE,CAN_REVIEW,CAN_ACK');
                     }else if(process.env.TEST_CASE == "eleven"){
                     res.body.object.userdetail[1].should.equal('ACK');
                     }else if(process.env.TEST_CASE == "thirteen"){
                      res.body.object.userdetail[1].should.equal('ACCEPT');
                     }
                  else{
                    Logger.info("case",process.env.TEST_CASE);
                    res.body.object.userdetail[0].should.equal('CAN_ASSIGN,CAN_REVOKE,CAN_ACCEPT,CAN_DECLINE,CAN_REVIEW,CAN_ACK');
                    }
                    done();
                });

            });
              });
          if(process.env.TEST_CASE == "third"){
            it('should get  user role in the contract for second step assign by admin', function(done) {

                this.timeout(100000);
              selectContactFormDataBase((selectData,userInfo) =>{
                    let tableData=selectData;
                chai.request(server)
                    .post('/api/v1/contract/userdetail')
                    .send({
                         "contractAddress": tableData.contractAddress,
                        "accountAddress":  userInfo[3].ethAddress
                    })
                    .end(function(err, res) {

                        res.should.have.status(200);
                        res.should.be.json;
                      //  res.body.should.be.a('object');
                        res.body.error.should.equal(false);
                      //  res.body.object.should.be.a('object');
                      console.log("res.body",res.body);


                        res.body.object.userdetail[0].should.equal('CAN_REVOKE,CAN_ASSIGN,CAN_ACK');

                        done();
                    });

                });

            });
            it('should get third user role in the contract assigned on contract creation time for admin of contarc', function(done) {

                this.timeout(100000);
              selectContactFormDataBase((selectData,userInfo) =>{
                    let tableData=selectData;
                chai.request(server)
                    .post('/api/v1/contract/userdetail')
                    .send({
                         "contractAddress": tableData.contractAddress,
                        "accountAddress":"0x9e6941252069c9e34bdfd499fbf0284e501fad74"
                    })
                    .end(function(err, res) {

                        res.should.have.status(200);
                        res.should.be.json;
                      //  res.body.should.be.a('object');
                        res.body.error.should.equal(false);
                      //  res.body.object.should.be.a('object');
                      console.log("res.body",res.body);


                        res.body.object.userdetail[0].should.equal('CAN_REVOKE,CAN_ACK');

                        done();
                    });

                });

            });
            it('should get third user role in the contract assigned on contract creation time for secondParty of contarc', function(done) {

                this.timeout(100000);
              selectContactFormDataBase((selectData,userInfo) =>{
                    let tableData=selectData;
                chai.request(server)
                    .post('/api/v1/contract/userdetail')
                    .send({
                         "contractAddress": tableData.contractAddress,
                        "accountAddress": "0x9e6941252069c9e34bdfd499fbf0284e501fad97"
                    })
                    .end(function(err, res) {

                        res.should.have.status(200);
                        res.should.be.json;
                      //  res.body.should.be.a('object');
                        res.body.error.should.equal(false);
                      //  res.body.object.should.be.a('object');
                      console.log("res.body",res.body);


                        res.body.object.userdetail[0].should.equal('CAN_REVOKE,CAN_ASSIGN');

                        done();
                    });

                });

            });
          }





    });

});

};
