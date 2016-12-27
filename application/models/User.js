var schemaPromise = knex.schema.createTableIfNotExists('User', function(table) {
    table.increments('id').primary();
    table.string('email');
    table.string('ethPassword');


}).then(function(data) {
    console.log("User Table added ");
});
knex.schema.hasColumn('User', 'ethAddress').then((isColumn) => {
    if (isColumn != true) {
        knex.schema.table('User', function(table) {
            table.string('ethAddress');
            table.unique('ethAddress');
        }).then(function(data) {
            console.log("ethAddress Column added");
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
  required: ['email','ethPassword','ethAddress'],
  properties: {
    id: {type: 'integer'},
    email: {type: 'string', minLength: 1, maxLength: 255},
    ethPassword:{type:'string',minLength:1,maxLength:100},
    ethAddress:{type:'string'}
    //parentId: {type: ['integer', 'null']},
    //age: {type: 'number'},
  }
};
// Basic ES6 compatible prototypal inheritance.
Model.extend(User);
module.exports = User;
