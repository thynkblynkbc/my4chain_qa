'use strict';
global.chai = require('chai');
global.chaiHttp = require('chai-http');
global.server = require('../app');
global.should = chai.should();

    chai.use(chaiHttp);
    let fileExports= require('./exports.js');
    console.log(fileExports,process.env.TEST_CASE);
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
           }
        else{

        Console.log("YOU HAVE NOT SELECTED ANY TEST CASES");
    }
