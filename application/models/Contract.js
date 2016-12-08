var schemaPromise = knex.schema.createTableIfNotExists('Contract', function(table) {
    table.increments('id').primary();
    table.string('contractAddress');
    table.string('transactionHash');
    table.text('abi');


}).then(function(data) {
    console.log("Contract Table added ");
    knex.schema.hasColumn('Contract', 'ethAddress').then((isColumn) => {
         if (isColumn != true) {
             knex.schema.table('Contract', function(table) {
                table.string('ethAddress');
                table.foreign('ethAddress').references('User.ethAddress');
             }).then(function(data) {
                 console.log("ethAddress Column of Contract TAble as foreign key from User table");
             });
         }
    });
    knex.schema.hasColumn('Contract', 'bytecode').then((isColumn) => {
         if (isColumn != true) {
             knex.schema.table('Contract', function(table) {
                table.text('bytecode');
              }).then(function(data) {
                 console.log("bytecode Column added to Contract Table");
             });
         }
    });
});

// knex.schema.hasColumn('Contract', 'abi').then((isColumn) => {
//      if (isColumn != true) {
//          knex.schema.table('Contract', function(table) {
//             table.json('abi');
//           }).then(function(data) {
//              console.log("abi Column of Contract TAble added");
//          });
//      }
// });

// Contract model.
function Contract() {
    Model.apply(this, arguments);
}

Contract.tableName = 'Contract';
Contract.jsonSchema = {
  type: 'object',
  required: ['contractAddress','transactionHash','ethAddress','abi'],
  properties: {
    id: {type: 'integer'},
    contractAddress: {type: 'string'},
    transactionHash:{type:'string'},
    ethAddress:{type:'string'},
    abi:{type:'string'},
    bytecode:{type:'string'}
    }
};
// Basic ES6 compatible prototypal inheritance.
Model.extend(Contract);
module.exports = Contract;
