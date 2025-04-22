const express = require('express');
const router = express.Router();
const path = require('path');
const inventoryController = require('../controllers/equipmentInventoryController');

router.get('/equipment', inventoryController.showInventory);
router.get('/equipment/search', inventoryController.searchEquipment);
router.post('/equipment/toggle-status', inventoryController.toggleEquipmentStatus);

module.exports = router;
