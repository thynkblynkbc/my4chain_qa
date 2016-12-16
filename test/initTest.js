'use strict';
global.chai = require('chai');
global.chaiHttp = require('chai-http');
global.server = require('../app');
global.should = chai.should();

    chai.use(chaiHttp);
    let fileExports= require('./exports.js');
    console.log("Test case",fileExports,process.env.TEST_CASE);
    if(process.env.TEST_CASE == "first")
        {
        fileExports.smartContract.smartContract();
        }else if(process.env.TEST_CASE == "second"){

        fileExports.ContractTestCases.contractExcute();
        }else  if(process.env.TEST_CASE == "third"){

        fileExports.ContractReadTestCases.getContract();

        }else if(process.env.TEST_CASE == "fourth"){

              fileExports.ContractChildTestCases.getContract();

        }else if(process.env.TEST_CASE == "fifth"){

         fileExports.ContractReadChildTestCases.getContract();
        }else if(process.env.TEST_CASE == "six"){
         fileExports.ContractRemoveAction.removeActionContract();

        }
        else if(process.env.TEST_CASE == "seven"){
                   fileExports.ContractReadTestCases.getContract();
                    fileExports.ContractReadChildTestCases.getContract();
                }
        else if(process.env.TEST_CASE == "eight"){
               fileExports.ContractAssignAllRole.getContract();

          }
          else if(process.env.TEST_CASE == "nine"){
                        fileExports.ContractReadTestCases.getContract();
                     //    fileExports.ContractReadChildTestCases.getContract();
                    }
          else if(process.env.TEST_CASE == "ten"){
               fileExports.ContractChangeState.getContract();
                                         //    fileExports.ContractReadChildTestCases.getContract();
                 }
           else if(process.env.TEST_CASE == "eleven"){
                fileExports.ContractReadTestCases.getContract();
                                                          //    fileExports.ContractReadChildTestCases.getContract();
           }else if(process.env.TEST_CASE == "twelve"){
         // for decline sol


              fileExports.ContractAcceptOrDecline.changeStateContract(); // decline state
           }else if(process.env.TEST_CASE == "thirteen"){  /// check state of contract
            fileExports.ContractReadTestCases.getContract();

           }else if(process.env.TEST_CASE == "fourteen"){  /// assign role to child
            fileExports.ContractChildAssignAllRole.getContract();

           }else if(process.env.TEST_CASE == "fifteen"){   // read role

            fileExports.ContractReadChildTestCases.getContract();
           }
        else{

        console.log("YOU HAVE NOT SELECTED ANY TEST CASES");
    }
