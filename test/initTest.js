'use strict';
global.chai = require('chai');
global.chaiHttp = require('chai-http');
global.server = require('../app');
global.should = chai.should();

chai.use(chaiHttp);
let fileExports= require('./exports.js');
console.log(fileExports);
fileExports.smartContract.smartContract();
fileExports.ContractTestCases.contractExcute();
