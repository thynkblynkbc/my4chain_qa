var schemaPromise = knex.schema.createTableIfNotExists('User', function(table) {
    table.increments('id').primary();
   table.string('my4chainId');
    table.string('ethPassword');


}).then(function(data) {
    console.log("User Table added ");
});
knex.schema.hasColumn('User', 'accountAddress').then((isColumn) => {
    if (isColumn != true) {
        knex.schema.table('User', function(table) {
            table.string('accountAddress'); // ethereum account address
            table.unique('accountAddress');
        }).then(function(data) {
            console.log("accountAddress Column added");
        });
    }
});
knex.schema.hasColumn('User', 'my4chainId').then((isColumn) => {
    if (isColumn != true) {
        knex.schema.table('User', function(table) {
            table.string('my4chainId'); // ethereum account address
          //  table.unique('accountAddress');
        }).then(function(data) {
            console.log("my4chainId Column added");
        });
    }
});

knex.schema.hasColumn('User', 'fileWriteStatus').then((isColumn) => {
    if (isColumn != true) {
        knex.schema.table('User', function(table) {
            table.string('fileWriteStatus').defaultTo('N');; // ethereum account address
          //  table.unique('fileWriteStatus');
        }).then(function(data) {
            console.log("fileWriteStatus Column added");
        });
    }
});
knex.schema.hasColumn('User', 'privateKey').then((isColumn) => {
    if (isColumn != true) {
        knex.schema.table('User', function(table) {
            table.string('privateKey'); // ethereum account address

        }).then(function(data) {
            console.log("privateKey Column added");
        });
    }
});
// User model.
function User() {
    Model.apply(this, arguments);
}

User.tableName = 'User';
User.jsonSchema = {
  type: 'object',
  required: ['my4chainId','ethPassword','accountAddress'],
  properties: {
    id: {type: 'integer'},
    my4chainId: {type: 'string', minLength: 1, maxLength: 255},
    ethPassword:{type:'string',minLength:1,maxLength:10},
    accountAddress:{type:'string'},
    privateKey:{type:'string'},
    fileWriteStatus:{type:'string'}
    //parentId: {type: ['integer', 'null']},
    //age: {type: 'number'},
  }
};
// Basic ES6 compatible prototypal inheritance.
Model.extend(User);
module.exports = User;
