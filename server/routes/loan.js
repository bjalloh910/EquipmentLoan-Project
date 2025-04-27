const express = require('express');
const router = express.Router();
const db = require('../models');
const loanController = require('../controllers/loanController');

// GET /loans/history/search → search loan history
router.get('/history/search', loanController.searchLoanHistory);

// GET /loans/history → show loan history
router.get('/history', loanController.showLoans);

// GET /loans/current/search → search current loans
router.get('/current/search', loanController.searchCurrentLoans);

// GET /loans/current → show current loans
router.get('/current', loanController.showCurrentLoans);

// GET /loans → list all loans (current loans)
router.get('/', async (req, res) => {
  try {
    const loans = await db.Loan.findAll({
      include: [db.Equipment, db.User],
      order: [['createdAt', 'DESC']]
    });
    res.render('loans', { loans });
  } catch (err) {
    console.error('Error fetching loans:', err);
    res.status(500).send('Server error');
  }
});

// POST /loans → create a new loan
router.post('/create', loanController.createLoan);

// POST /loans/:id/return → return a loan
router.post('/:id/return', loanController.returnLoan);

// DELETE /loans/:id → delete a loan
router.delete('/:id', loanController.deleteLoan);

module.exports = router;
