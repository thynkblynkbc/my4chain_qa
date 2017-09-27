var schemaPromise = knex.schema.createTableIfNotExists('Contract', function(table) {
    table.increments('id').primary();
    table.string('contractAddress');
    table.string('transactionHash');
    table.text('abi');
}).then(function(data) {
    console.log("Contract Table added ");
    knex.schema.hasColumn('Contract', 'senderAddress').then((isColumn) => {
        if (isColumn != true) {
            knex.schema.table('Contract', function(table) {
                table.string('senderAddress'); // ethereum account address of contract creator/sender(first party admin)
            }).then(function(data) {
                console.log("senderAddress Column of Contract Table as foreign key from User(accountAddress) table");
            });
        }
    });
    knex.schema.hasColumn('Contract', 'fileHash').then((isColumn) => {
        if (isColumn != true) {
            knex.schema.table('Contract', function(table) {
                table.string('fileHash'); // ethereum account address of contract creator/sender(first party admin)
            }).then(function(data) {
                console.log("fileHash Column of Contract Table ");
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
    knex.schema.hasColumn('Contract', 'receipentAddress').then((isColumn) => {
        if (isColumn != true) {
            knex.schema.table('Contract', function(table) {
                table.text('receipentAddress'); // ethereum account address of contract receipent(second party admin)
            }).then(function(data) {
                console.log("receipentAddress Column added to Contract Table");
            });
        }
    });
    knex.schema.hasColumn('Contract', 'salt').then((isColumn) => {
        if (isColumn != true) {
            knex.schema.table('Contract', function(table) {
                table.text('salt');
            }).then(function(data) {
                console.log("salt Column added to Contract Table");
            });
        }
    });
    knex.schema.hasColumn('Contract', 'createdAt').then((isColumn) => {
        if (isColumn != true) {
            knex.schema.table('Contract', function(table) {
                table.dateTime('createdAt').defaultTo(knex.fn.now());
            }).then(function(data) {
                console.log("createdAt Column added to Contract Table");
            });
        }
    });
    knex.schema.hasColumn('Contract', 'startTime').then((isColumn) => {
        if (isColumn != true) {
            knex.schema.table('Contract', function(table) {
                table.dateTime('startTime'); // start time of contract
            }).then(function(data) {
                console.log("startTime Column added to Contract Table");
            });
        }
    });
    knex.schema.hasColumn('Contract', 'endTime').then((isColumn) => {
        if (isColumn != true) {
            knex.schema.table('Contract', function(table) {
                table.dateTime('endTime'); // expiry/end time of contract
            }).then(function(data) {
                console.log("endTime Column added to Contract Table");
            });
        }
    });
});
knex.schema.hasColumn('Contract', 'Published').then((isColumn) => {
    if (isColumn != true) {
        knex.schema.table('Contract', function(table) {
            table.string('Published').default("n"); // ethereum account address of contract creator/sender(first party admin)
        }).then(function(data) {
            console.log("Published row in table");
        });
    }
});
knex.schema.hasColumn('Contract', 'publishedAddress').then((isColumn) => {
    if (isColumn != true) {
        knex.schema.table('Contract', function(table) {
            table.string('publishedAddress'); // ethereum account address of contract creator/sender(first party admin)
        }).then(function(data) {
            console.log("publishedAddress row in table");
        });
    }
});
knex.schema.hasColumn('Contract', 'checkAddressCount').then((isColumn) => {
    if (isColumn != true) {
        knex.schema.table('Contract', function(table) {
            table.string('checkAddressCount'); // ethereum account address of contract creator/sender(first party admin)
        }).then(function(data) {
            console.log("checkAddressCount row in table");
        });
    }
});

function Contract() {
    Model.apply(this, arguments);
}
Contract.tableName = 'Contract';
Contract.jsonSchema = {
    type: 'object',
    required: ['contractAddress', 'transactionHash', 'senderAddress', 'abi'],
    properties: {
        id: {
            type: 'integer'
        },
        contractAddress: {
            type: 'string'
        },
        transactionHash: {
            type: 'string'
        },
        senderAddress: {
            type: 'string'
        },
        abi: {
            type: 'string'
        },
        bytecode: {
            type: 'string'
        },
        receipentAddress: {
            type: 'string'
        },
        salt: {
            type: 'string'
        },
        createdAt: {
            type: 'dateTime'
        },
        startTime: {
            type: 'dateTime'
        },
        endTime: {
            type: 'dateTime'
        },
        Published: {
            type: 'string'
        },
        fileHash: {
            type: 'string'
        },
        publishedAddress: {
            type: 'string'
        },
        checkAddressCount: {
            type: 'integer'
        }
    }
};
// Basic ES6 compatible prototypal inheritance.
Model.extend(Contract);
module.exports = Contract;
