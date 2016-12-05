var schemaPromise = knex.schema.createTableIfNotExists('Person', function (table) {
  table.increments('id').primary();
  table.string('firstName');
}).then(function(data){console.log("Person Table added");});

// Person model.
function Person() {
  Model.apply(this, arguments);
}

// Person.tableName = 'Person';
// Person.jsonSchema = {
//   type: 'object',
//   required: ['firstName'],
//
//   properties: {
//     id: {type: 'integer'},
//     parentId: {type: ['integer', 'null']},
//     firstName: {type: 'string', minLength: 1, maxLength: 255},
//
//     age: {type: 'number'}
//
//   }
// };
// Basic ES6 compatible prototypal inheritance.
Model.extend(Person);
module.exports =Person;
