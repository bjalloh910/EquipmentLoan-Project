const mysql = require('mysql2');

const connection = mysql.createConnection({
  socketPath: '/tmp/mysql.sock',
  user: 'root',
  password: 'kL3pq-$bi255',
  database: 'sal_db'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Successfully connected to MySQL!');
  
  // Test query
  connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return;
    }
    console.log('Test query result:', results[0].solution);
    
    // Close the connection
    connection.end();
  });
}); 