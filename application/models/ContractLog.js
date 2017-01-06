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

    knex.schema.hasColumn('ContractLog', 'confirmation').then((isColumn) => {
         if (isColumn != true) {
             knex.schema.table('ContractLog', function(table) {
                table.boolean('confirmation').defaultTo(false);; // ethereum account address of contract creator/sender(first party admin)
                }).then(function(data) {
                 console.log("confirmation Column of ContractLog Table ");
             });
         }
    });
    knex.schema.hasColumn('ContractLog', 'confirmationCount').then((isColumn) => {
         if (isColumn != true) {
             knex.schema.table('ContractLog', function(table) {
                table.integer('confirmationCount').defaultTo(0);; // ethereum account address of contract creator/sender(first party admin)
                }).then(function(data) {
                 console.log("confirmationCount Column of ContractLog table ");
             });
         }
    });



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
    confirmation:{type:'boolean'},
    confirmationCount:{type:'integer'}
  }
};
// Basic ES6 compatible prototypal inheritance.
Model.extend(ContractLog);
module.exports = ContractLog;
