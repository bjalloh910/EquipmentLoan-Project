const express = require('express');
const router = express.Router();
const db = require('../models');

// GET /loans → list all loans
router.get('/', async (req, res) => {
  try {
    const loans = await db.Loan.findAll({
      include: [db.Equipment, db.User], // optional: shows related equipment/user
      order: [['createdAt', 'DESC']]
    });
    res.render('loans', { loans }); // render dynamic_views/loans.ejs
  } catch (err) {
    console.error('Error fetching loans:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
