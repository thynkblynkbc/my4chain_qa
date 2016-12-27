var schemaPromise = knex.schema.createTableIfNotExists('ContractLog', function(table) {
    table.increments('id').primary();
    table.string('contractAddress');
    table.string('transactionHash');
    table.dateTime('createdAt').defaultTo(knex.fn.now()); // calling time
    table.string('blockchain').defaultTo('Ethereum');
    table.string('callerAddress');// who call the contract
    table.string('action');//function of contract method
}).then(function(data) {
    console.log("ContractLog Table added ");

});
// Contract model.
function ContractLog() {
    Model.apply(this, arguments);
}

ContractLog.tableName = 'ContractLog';
ContractLog.jsonSchema = {
  type: 'object',
  required: ['contractAddress','transactionHash','callerAddress','action'],
  properties: {
    id: {type: 'integer'},
    contractAddress: {type: 'string'},
    transactionHash:{type:'string'},
    callerAddress:{type:'string'},
    action:{type:'string'},
  }
};
// Basic ES6 compatible prototypal inheritance.
Model.extend(ContractLog);
module.exports = ContractLog;
