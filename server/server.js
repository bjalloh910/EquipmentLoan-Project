const express = require('express');
const path = require('path');
const { sequelize } = require('./models'); // assuming index.js in models exports sequelize
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// Example API
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend' });
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  try {
    await sequelize.authenticate();
    console.log('Database connected ✅');
  } catch (err) {
    console.error('Database error ❌:', err);
  }
});
