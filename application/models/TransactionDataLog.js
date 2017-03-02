var schemaPromise = knex.schema.createTableIfNotExists('TransactionDataLog', function(table) {
    table.increments('id').primary();
    table.string('data');
    table.string('sendAddress');
    table.string('reciveAddress');
    table.string('transactionHash');
    table.dateTime('time').defaultTo(knex.fn.now());// who call the contract
    table.string('status');//function of contract method

}).then(function(data) {
    console.log("TransactionDataLog Table added ");




});
// Contract model.
function TransactionDataLog() {
    Model.apply(this, arguments);
}

TransactionDataLog.tableName = 'TransactionDataLog';
TransactionDataLog.jsonSchema = {
  type: 'object',
  required: ['sendAddress','reciveAddress','data'],
  properties: {
    id: {type: 'integer'},
    sendAddress: {type: 'string'},
    reciveAddress:{type:'string'},
    transactionHash:{type:'string'},
    status:{type:'string'},
    data:{type:'string'}
  }
};
// Basic ES6 compatible prototypal inheritance.
Model.extend(TransactionDataLog);
module.exports = TransactionDataLog;
