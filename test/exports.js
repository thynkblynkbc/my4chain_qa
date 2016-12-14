module.exports = {
   smartContract : require('./contract/smartContract.js'),
   ContractTestCases : require('./contract/ContractTestCases.js'),
   ContractReadTestCases : require('./contract/ContractReadTestCases.js'),
   ContractChildTestCases : require('./contract/childContract/ContractChildTestCases.js'),
   ContractReadChildTestCases : require('./contract/childContract/ContractReadChildTestCases.js'),
   ContractRemoveAction : require('./contract/ContractOperation/ContractRemoveAction.js'),
   ContractAssignAllRole : require('./contract/ContractOperation/ContractAssignAllRole.js'),
   ContractChangeState : require('./contract/ContractOperation/ContractChangeState.js'),
   ContractAcceptOrDecline : require('./contract/ContractOperation/ContractAcceptOrDecline.js'),
   ContractChildAssignAllRole : require('./contract/childContract/ContractChildAssignAllRole.js')
   /* some other modules you want */
};
