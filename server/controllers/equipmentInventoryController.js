const { Equipment } = require('../models');
const { Op } = require('sequelize');

exports.showInventory = async (req, res) => {
    try {
        const totalEquipmentList = await Equipment.findAll(); // get all the equipment from the DB
        res.render('equipmentInventory', {equipment: totalEquipmentList});
    } catch (error) {
        console.error(error);
        res.status(500).send('Failed to load inventory')
    }
}

exports.searchEquipment = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.redirect('/equipment');
        }

        const searchResults = await Equipment.findAll({
            where: {
                [Op.or]: [
                    { model: { [Op.like]: `%${query}%` } },
                    { make: { [Op.like]: `%${query}%` } },
                    { serial_code: { [Op.like]: `%${query}%` } },
                    { equip_type: { [Op.like]: `%${query}%` } }
                ]
            }
        });

        res.render('equipmentInventory', { 
            equipment: searchResults,
            searchQuery: query
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).send('Failed to perform search');
    }
}

exports.toggleEquipmentStatus = async (req, res) => {
    try {
        const { serialCode, newStatus } = req.body;

        // Validate the input
        if (!serialCode || !newStatus) {
            return res.status(400).json({ error: 'Serial code and new status are required' });
        }

        // Validate status value
        if (newStatus.toLowerCase() !== 'available' && newStatus.toLowerCase() !== 'in use') {
            return res.status(400).json({ error: 'Status must be either "Available" or "in use"' });
        }

        // Find the equipment by serial code
        const equipment = await Equipment.findOne({ where: { serial_code: serialCode } });

        if (!equipment) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        // Update the status
        await equipment.update({ checkout_status: newStatus });

        res.json({ 
            success: true, 
            message: 'Status updated successfully',
            equipment: {
                serialCode: equipment.serial_code,
                status: equipment.checkout_status
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update status' });
    }
}