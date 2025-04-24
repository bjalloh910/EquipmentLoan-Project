const express = require('express');
const router = express.Router();
const path = require('path');
const inventoryController = require('../controllers/equipmentInventoryController');

router.get('/', inventoryController.showInventory);
router.get('/search', inventoryController.searchEquipment);
router.post('/toggle-status', inventoryController.toggleEquipmentStatus);
router.post('/add', inventoryController.addEquipment);
router.delete('/delete/:serial_code', inventoryController.deleteEquipment);
router.put('/update/:serial_code', inventoryController.updateEquipment);

module.exports = router;
