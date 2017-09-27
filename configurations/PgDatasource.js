  const pg = require('pg');
  var getDbConnection = function() {
      switch (process.env.NODE_ENV) {
          case 'production':
              var db = process.env.DATABASE_URL || 'postgres://oodles:oodles@10.0.0.4:5432/my4chain';
              return checkMongooseConnection(db)
          case 'qa':
              var db = process.env.DATABASE_URL || 'postgres://oodles:oodles@10.0.0.4:5432/my4chainqa';
              return checkMongooseConnection(db)
          case 'development':
              var db = process.env.DATABASE_URL || 'postgres://oodles:oodles@10.0.0.4:5432/my4chain';
              return checkMongooseConnection(db)
          case 'test':
              var db = process.env.DATABASE_URL || 'postgres://oodles:oodles@localhost:5432/my4chain';
              return checkMongooseConnection(db)
      }
  }

  function checkMongooseConnection(db) {
      const client = new pg.Client(db);
      client.connect(function(err) {
          if (err) throw err;
          client.query('SELECT $1::text as name', ['brianc'], function(err, result) {
              Logger.info(result.rows[0]);
          });
      });
  }
  module.exports.getDbConnection = getDbConnection;
