var schemaPromise = knex.schema.createTableIfNotExists('Person', function(table) {
    table.increments('id').primary();
    table.string('firstName');
}).then(function(data) {
    console.log("Person Table added");
});

function Person() {
    Model.apply(this, arguments);
};
// Basic ES6 compatible prototypal inheritance.
Model.extend(Person);
module.exports = Person;
