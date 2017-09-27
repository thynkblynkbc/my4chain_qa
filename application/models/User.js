var schemaPromise = knex.schema.createTableIfNotExists('User', function(table) {
    table.increments('id').primary();
    table.string('my4chainId');
    table.string('ethPassword');
    table.string('serverNode');
}).then(function(data) {
    console.log("User Table added ");
});
knex.schema.hasColumn('User', 'accountAddress').then((isColumn) => {
    if (isColumn != true) {
        knex.schema.table('User', function(table) {
            table.string('accountAddress');
            table.unique('accountAddress');
        }).then(function(data) {
            console.log("accountAddress Column added");
        });
    }
});
knex.schema.hasColumn('User', 'time').then((isColumn) => {
    if (isColumn != true) {
        knex.schema.table('User', function(table) {
            table.dateTime('time').defaultTo(knex.fn.now());
        }).then(function(data) {
            console.log("time Column added");
        });
    }
});
knex.schema.hasColumn('User', 'my4chainId').then((isColumn) => {
    if (isColumn != true) {
        knex.schema.table('User', function(table) {
            table.string('my4chainId');
        }).then(function(data) {
            console.log("my4chainId Column added");
        });
    }
});
knex.schema.hasColumn('User', 'fileWriteStatus').then((isColumn) => {
    if (isColumn != true) {
        knex.schema.table('User', function(table) {
            table.string('fileWriteStatus').defaultTo('N');
        }).then(function(data) {
            console.log("fileWriteStatus Column added");
        });
    }
});
knex.schema.hasColumn('User', 'privateKey').then((isColumn) => {
    if (isColumn != true) {
        knex.schema.table('User', function(table) {
            table.string('privateKey');
        }).then(function(data) {
            console.log("privateKey Column added");
        });
    }
});
knex.schema.hasColumn('User', 'serverNode').then((isColumn) => {
    if (isColumn != true) {
        knex.schema.table('User', function(table) {
            table.string('serverNode');
        }).then(function(data) {
            console.log("serverNode Column added");
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
    required: ['my4chainId', 'ethPassword', 'accountAddress', 'serverNode'],
    properties: {
        id: {
            type: 'integer'
        },
        my4chainId: {
            type: 'string',
            minLength: 1,
            maxLength: 255
        },
        ethPassword: {
            type: 'string',
            minLength: 1,
            maxLength: 255
        },
        accountAddress: {
            type: 'string'
        },
        privateKey: {
            type: 'string'
        },
        fileWriteStatus: {
            type: 'string'
        },
        serverNode: {
            type: 'string'
        },
    }
};
// Basic ES6 compatible prototypal inheritance.
Model.extend(User);
module.exports = User;
