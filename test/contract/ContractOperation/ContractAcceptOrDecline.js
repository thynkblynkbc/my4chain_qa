module.exports.changeStateContract = function(){

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

describe('STATE CHANGE ACTION', function() {

    describe('Change the state', function() {

        it('should decline  contract', function(done) {

            this.timeout(100000);
          selectContactFormDataBase((selectData,userInfo) =>{
                let tableData=selectData;
            chai.request(server)
            .post('/api/v1/contract/changestate')
            .send({
                 "contractAddress": tableData.contractAddress,
                "accountAddress": userInfo[2].ethAddress,
                "password": userInfo[2].ethPassword,
                "action": "sign"
            })
                .end(function(err, res) {
                console.log( err,res.body);
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
        it('should decline  contract', function(done) {

            this.timeout(100000);
          selectContactFormDataBase((selectData,userInfo) =>{
                let tableData=selectData;
            chai.request(server)
            .post('/api/v1/contract/changestate')
            .send({
                 "contractAddress": tableData.contractAddress,
                "accountAddress": userInfo[3].ethAddress,
                "password": userInfo[3].ethPassword,
                "action": "sign"
            })
                .end(function(err, res) {
            console.log( err);
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


    });

});

};
