const express = require('express');
const path = require('path');
const db = require('./models'); // Import the db object
const app = express();
const PORT = process.env.PORT || 3000;


// telling express where my EJS files are located
app.set('views', path.join(__dirname, 'dynamic_views'));
app.set('view engine', 'ejs');

// Import Routes here 
const indexRoutes = require('./routes/index');
const homeRoutes = require('./routes/home');
const inventoryRoutes = require('./routes/equipmentInventory');
const loanRoutes = require('./routes/loan');


// Log database configuration (without sensitive info)
console.log('Database Config:', {
  host: db.sequelize.config.host,
  port: db.sequelize.config.port,
  database: db.sequelize.config.database,
  username: db.sequelize.config.username,
  dialect: db.sequelize.config.dialect
});

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));


// Use Routes
app.use('/', indexRoutes);
app.use('/home', homeRoutes);
app.use('/', inventoryRoutes);
app.use('/loans', loanRoutes);


// Example API
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend' });
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  try {
    await db.sequelize.authenticate();
    console.log('Database connected ✅');
  } catch (err) {
    console.error('Database connection error ❌');
    console.error('Error details:', err.message);
    console.error('Error name:', err.name);
    if (err.parent) {
      console.error('Original error:', err.parent.message);
      console.error('Error code:', err.parent.code);
    }
  }
});
