const express = require('express');
const router = express.Router();
const path = require('path');

router.get('/', (req, res) => {
    res.sendFile('client/views/home.html', { root: path.join(__dirname, '../..') });
});

module.exports = router;