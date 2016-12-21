module.exports.smartContract = function(){

    describe('A Transaction', function() {
        //it('should list ALL blobs on /blobs GET');
        // it('should list a SINGLE blob on /blob/<id> GET');
        // it('should add a SINGLE blob on /blobs POST');
        // it('should update a SINGLE blob on /blob/<id> PUT');
        console.log("inside smartcontract TestSuite");
        it('should list balance of coinbase /coinbaseBalance GET', function(done) {

            chai.request(server)
                .get('/api/v1/coinbaseBalance')
                .end(function(err, res) {
                    res.should.have.status(200);
                    done();
                });
        });
        describe('SmartContract', function() {
            it('should create contract /privateCreateContract POST', function(done) {
                this.timeout(200000);

         domain.User.query().orderBy('id', 'asc').limit(2).select().then(function(Usdata) {

        let UserData =  JSON.parse(JSON.stringify(Usdata));
        console.log("UserData[0]==",UserData[0]);

                chai.request(server)
                    .post('/api/v1/privateCreateContract')
                    .send({
                        "owner": UserData[0].ethAddress,
                        "password": UserData[0].password,
                        "to":UserData[1].ethAddress,
	                      "fileHash":"0x944f36ea5c4756017ad632d4d7661b9bbf2b62cf"
                    })
                    .end(function(err, res) {
                        res.should.have.status(200);
                        res.should.be.json;
                        res.body.should.be.a('object');
                        res.body.error.should.equal(false);
                        res.body.object.should.be.a('object');
                        res.body.object.should.have.property('contractAddress');
                        res.body.object.should.have.property('txnHash');
                        done();
                    });
            });

            });

        });

    });

};
