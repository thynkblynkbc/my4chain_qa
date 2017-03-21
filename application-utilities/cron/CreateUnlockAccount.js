'use strict';

class CreateUnlockAccount {


    constructor() {
        // this.bPromise = require('bluebird');
        // this.fs = this.bPromise.promisifyAll(require('fs'));

    }
    // find user from database
    findFromDataBase() {
        return new Promise(function(resolve , reject) {
          domain.User.query().where({'fileWriteStatus':'N'}).select()
          .then((userData) => {
              if(userData.length > 0){
                    resolve(userData);
                  }else{
                    reject({err:true});
                  }

            })

        })
    }
    updateTheDatabase(userIds){
      return new Promise((resolve, reject) => {
        try{
        let resData ={};


        domain.User.query()
         .patch({'fileWriteStatus':'Y'})
        .where('accountAddress','in', userIds).then((databaseReturn) => {
          if(!databaseReturn){
            resData = {data:databaseReturn};
            resolve(resData);
          }else{
            resData = {message:"data not updated"};
            reject(resData)
          }
        });
      }catch(e){
        console.log("error in updating ",e)
      }
      });

    }
    checkForFile() {
        return new Promise((resolve , reject) => {
          console.log("fileName--> ",this);
            fs.exists(this.fileName, (exists) => {
                if (exists) {
                    console.log("exists",this.fileName);
                  resolve({exist:true});
                } else {
                    fs.open(this.fileName, 'wx', (err, fd) => {
                      console.log(err,fd);
                        if (err) {
                         reject(err);
                        }else{
                          resolve({exist:true});
                        }
                    });
                }
            });
        })
    }

    writeInFile(userData) {
        return new Promise(function(resolve ,reject) {
          let  fileAppend ="";
          let userId =[];
          Logger.info("length of file",userData.length);
          try{
            async.forEach(userData, (item, done)=> {
              fileAppend =  fileAppend + 'personal.unlockAccount("'+item.accountAddress+'","'+item.ethPassword+'",0)\n';
              userId.push(item.accountAddress);
              done()

            }, (err)=> {

              fs.appendFile("unlock.js", fileAppend,  (err,success)=> {
                        if(err){
                          reject({message:"file failed write"});
                        }else{

                          resolve({message:"file successfully write",userIds:userId});
                        }
                  });


            })
          }catch(e){
            console.log("error",e)
          }

        })

    }

    excuteFunction(){
       var file ={
         fileName:"unlock.js"
       };

          this.checkForFile.bind(file)().then((data) => {
            ///  console.log("data in write: ",data)
              return this.findFromDataBase();
          }).
          then((data) =>{
            console.log("data in write: ",data.length)

            return this.writeInFile.bind(file)(data);
          }).catch((e) =>{
                console.log("error in write file",e);
          }).then((data) =>{
            return this.updateTheDatabase.bind(file)(data.userIds);
            Logger.info("Data successfully appended");
          })
          .then((data) =>{

            Logger.info("User successfully Updated");
          }).
          catch((e) =>{
            Logger.info("error in file open1",e)
          });

    }



}

module.exports = new CreateUnlockAccount();
