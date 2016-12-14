module.exports.getContract = function(){

function selectContactFormDataBase(cb){
    domain.Contract.query().orderBy('id', 'desc').limit(1).select().then(function(data) {
         domain.User.query().orderBy('id', 'asc').limit(3).select().then(function(Usdata) {
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

        it('should get user role in the contract', function(done) {

            this.timeout(100000);
          selectContactFormDataBase((selectData,userInfo) =>{
                let tableData=selectData;
            chai.request(server)
                .post('/api/v1/privateRunContract')
                .send({
                     "contractAddress": tableData.contractAddress,
                    "adminAddress": userInfo[1].ethAddress,
                    "password": userInfo[1].password,
                    "accountAddress": userInfo[2].ethAddress,
                    "action": "NAN",
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
                  console.log("res.body",process.env.TEST_CASE);
                  if(process.env.TEST_CASE == "seven"){
                        res.body.object[0].should.equal('CAN_ASSIGN');

                   }else if(process.env.TEST_CASE == "nine"){

                        res.body.object[0].should.equal('CAN_ASSIGN,CAN_REVOKE,CAN_ACCEPT,CAN_DECLINE,CAN_REVIEW,CAN_ACK');

                   } else if(process.env.TEST_CASE == "fifteen"){

                        res.body.object[0].should.equal('CAN_ASSIGN');

                   }
                   else{

                        res.body.object[0].should.equal('CAN_REVOKE,CAN_ASSIGN');
                  }
                    done();
                });

            });

        });

    });

});

};
