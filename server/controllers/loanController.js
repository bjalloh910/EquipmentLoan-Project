const { Loan, Equipment, User } = require('../models');
const { Op } = require('sequelize');
const { Sequelize } = require('sequelize');

exports.showLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      include: [
        { model: User, attributes: ['personnel_name', 'personnel_number'] },
        { model: Equipment, attributes: ['model', 'serial_code'] }
      ],
      order: [['date_out', 'DESC']]
    });
    res.render('loanHistory', { loans });
  } catch (error) {
    console.error('Error fetching loans:', error);
    res.status(500).send('Error fetching loans');
  }
};

// logic to show current loans
exports.showCurrentLoans = async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: { date_in: null },
      include: [
        { model: User, attributes: ['personnel_name', 'personnel_number'] },
        { model: Equipment, attributes: ['model', 'serial_code', 'equip_type'] }
      ],
      order: [['date_out', 'DESC']]
    });
    const equipmentList = await Equipment.findAll();
    const userList = await User.findAll();
    res.render('currentLoans', { loans, equipmentList, userList});
  } catch (error) {
    console.error('Error fetching current loans:', error);
    res.status(500).send('Error fetching current loans');
  }
};

exports.searchCurrentLoans = async (req, res) => {
    res.set('Cache-Control', 'no-store'); // Prevent caching so you can see the latest results
    try {
      const { query } = req.query;

      if (!query) {
        return res.redirect('/loans/current');
      }

      const searchTerms = query.split(/\s+/).filter(term => term.length > 0);

      const conditions = searchTerms.map(term => ({
        [Op.or]: [
          { '$User.personnel_name$': { [Op.like]: `%${term}%` } },
          { '$User.personnel_number$': { [Op.like]: `%${term}%` } },
          { '$Equipment.model$': { [Op.like]: `%${term}%` } },
          { '$Equipment.serial_code$': { [Op.like]: `%${term}%` } },
          { '$Equipment.equip_type$': { [Op.like]: `%${term}%` } }
        ]
      }));

    const loans = await Loan.findAll({
      where: {
        date_in: null,
        [Op.and]: conditions
      },
      include: [
        { model: User },
        { model: Equipment }
      ],
      order: [['date_out', 'DESC']]
    });
    const equipmentList = await Equipment.findAll();
    const userList = await User.findAll();
    res.render('currentLoans', {
      loans,
      searchQuery: query,
      equipmentList,
      userList,
      title: 'Current Loans - Search Results'
    });
  } catch (error) {
    console.error('Error searching current loans:', error);
    res.status(500).send('Error searching loans');
  }
};

exports.createLoan = async (req, res) => {
  try {
    const { equipmentId, userId, dateOut, location, purpose, units, comments } = req.body;

    await Loan.create ({
      equipment_id: equipmentId,
      user_id: userId,
      location,
      purpose,
      date_out: dateOut,
      units,
      comments
    });
    res.json({ success: true, message: 'Loan created successfully!' });
  } catch (error) {
    console.error('Error creating loan:', error);
    res.status(500).json({ success: false, message: 'Error creating loan' });
  } 
};

exports.deleteLoan = async (req, res) => {
  try {
    const { id } = req.params;
    await Loan.destroy({ where: { id } });
    res.json({ success: true, message: 'Loan deleted successfully!' });
  } catch (error) {
    console.error('Error deleting loan:', error);
    res.status(500).json({ success: false, message: 'Error deleting loan' });
  }
};

exports.returnLoan = async (req, res) => {
  try{
    const { id } = req.params;
    const { returnDate} = req.body;

    const loan = await Loan.findByPk(id);
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }
    loan.date_in = returnDate || new Date();
    await loan.save();

    res.json({ success: true, message: 'Loan returned successfully!' });
  } catch (error) {
    console.error('Error returning loan:', error);
    res.status(500).json({ success: false, message: 'Error returning loan' });
  }
};

exports.searchLoanHistory = async (req, res) => {
    res.set('Cache-Control', 'no-store'); // Prevent caching so you can see the latest results
    try {
      const { query } = req.query;

      if (!query) {
        return res.redirect('/loans/history');
      }

      const searchTerms = query.split(/\s+/).filter(term => term.length > 0);

      const conditions = searchTerms.map(term => ({
        [Op.or]: [
          { '$User.personnel_name$': { [Op.like]: `%${term}%` } },
          { '$User.personnel_number$': { [Op.like]: `%${term}%` } },
          { '$Equipment.model$': { [Op.like]: `%${term}%` } },
          { '$Equipment.serial_code$': { [Op.like]: `%${term}%` } },
          { '$Equipment.equip_type$': { [Op.like]: `%${term}%` } },
          { purpose: { [Op.like]: `%${term}%` } },
          { location: { [Op.like]: `%${term}%` } }
        ]
      }));

      const loans = await Loan.findAll({
        where: {
          [Op.and]: conditions
        },
        include: [
          { model: User },
          { model: Equipment }
        ],
        order: [['date_out', 'DESC']]
      });
      
      res.render('loanHistory', {
        loans,
        searchQuery: query,
        title: 'Loan History - Search Results'
      });
    } catch (error) {
      console.error('Error searching loan history:', error);
      res.status(500).send('Error searching loan history');
    }
};