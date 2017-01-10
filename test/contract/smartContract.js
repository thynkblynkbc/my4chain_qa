module.exports.smartContract = function(){

    describe('A Transaction', function() {
        //it('should list ALL blobs on /blobs GET');
        // it('should list a SINGLE blob on /blob/<id> GET');
        // it('should add a SINGLE blob on /blobs POST');
        // it('should update a SINGLE blob on /blob/<id> PUT');
        console.log("inside smartcontract TestSuite");
        it('should list balance of coinbase /coinbaseBalance GET', function(done) {

            chai.request(server)
                .get('/api/coinbase/balance')
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
                    .post('/api/v1/contract/createcontract')
                    .set('Content-Type', 'application/json')
                    .send({
                        "owner": UserData[0].ethAddress,
                        "password": UserData[0].ethPassword,
                        "recipient":UserData[1].ethAddress,
	                      "fileHash":"944f36ea5c4756017ad632d4d7661b9bbf2b62cf",
                        "startfrom": "1483360084",
                      	"expireDate":"1493360133",
                        "ownerMember":[
                      					{"address":"0x33aa12ac60cb8e9969657933bb6d35458b048141","action":["CAN_ASSIGN","CAN_ACK"]},
                      					{"address":"0x05ff607de99df54b1bf906e92b15a3947b7bbb43","action":["CAN_REVOKE","CAN_REVIEW","CAN_ACK"]},
                      					{"address":"0x9e6941252069c9e34bdfd499fbf0284e501fad71","action":["CAN_REVOKE","CAN_REVIEW"]},
                      					{"address":"0x9e6941252069c9e34bdfd499fbf0284e501fad72","action":["CAN_REVOKE","CAN_REVIEW","CAN_WRONG"]},
                      					{"address":"0x9e6941252069c9e34bdfd499fbf0284e501fad73","action":["CAN_REVOKE","CAN_REVIEW"]},
                      					{"address":"0x9e6941252069c9e34bdfd499fbf0284e501fad74","action":["CAN_REVOKE","CAN_ACK"]}
                      					],
                      	"recipientMember":[
                      					{"address":"0xc682096931f49aefe49ab09ded688dc18428c4b9","action":["CAN_REVIEW","CAN_REVOKE"]},
                      					{"address":"0xc682096931f49aefe49ab09ded688dc18428c4b0","action":["CAN_ACK","CAN_REVOKE"]},
                      					{"address":"0xa0cc6fbfc399156e9f6900ef24c53c4e2d818225","action":["CAN_REVOKE","CAN_REVIEW"]},
                      					{"address":"0x9e6941252069c9e34bdfd499fbf0284e501fad33","action":["CAN_REVOKE","CAN_REVIEW",""]},
                      					{"address":"0x9e6941252069c9e34bdfd499fbf0284e501fad97","action":["CAN_REVOKE","CAN_ASSIGN"]},
                                {"address":"0x9e6941252069c9e34bdfd499fbf0284e501fab77","action":["CAN_REVOKE","CAN_ACK"]}
                                     	]
                    })
                    .end(function(err, res) {
                    //  console.log(err)
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
