const { Loan, Equipment, User } = require('../models');

exports.showLoans = async (req, res) => {
  const loans = await Loan.findAll({
    include: [Equipment, User]
  });
  res.render('loanList', { loans });
};

exports.newLoanForm = async (req, res) => {
  const equipmentList = await Equipment.findAll();
  const users = await User.findAll();
  res.render('newLoan', { equipmentList, users });
};

exports.createLoan = async (req, res) => {
  const { equipment_id, user_id, date_out, date_in, location, purpose, units, comments } = req.body;

  await Loan.create({
    equipment_id,
    user_id,
    date_out,
    date_in,
    location,
    purpose,
    units,
    comments
  });

  res.redirect('/loans');
};
