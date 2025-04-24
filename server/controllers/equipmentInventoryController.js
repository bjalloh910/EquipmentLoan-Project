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
        const { serial_code, newStatus } = req.body;

        // Validate the input
        if (!serial_code || !newStatus) {
            return res.status(400).json({ error: 'Serial code and new status are required' });
        }

        // Validate status value
        if (newStatus.toLowerCase() !== 'available' && newStatus.toLowerCase() !== 'in use') {
            return res.status(400).json({ error: 'Status must be either "Available" or "in use"' });
        }

        // Find the equipment by serial code
        const equipment = await Equipment.findOne({ where: { serial_code: serial_code } });

        if (!equipment) {
            return res.status(404).json({ error: 'Equipment not found' });
        }

        // Update the status
        await equipment.update({ checkout_status: newStatus });

        res.json({ 
            success: true, 
            message: 'Status updated successfully',
            equipment: {
                serial_code: equipment.serial_code,
                status: equipment.checkout_status
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update status' });
    }
}

// Add new equipment logic
exports.addEquipment = async (req, res) => {
    try {
        const {
            serial_code, 
            model, 
            make, 
            equip_type, 
            purchase_date, 
            checkout_status, 
            health,
            firmware_update,
            total_days_inuse,
            notes
        } = req.body;

        // Validate required fields
        if (!serial_code || !model || !make || !equip_type) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if equipment already exists
        const existingEquipment = await Equipment.findOne({ where: { serial_code } });
        if (existingEquipment) {
            return res.status(400).json({ error: 'Equipment with this serial code already exists' });
        }
        
        // Create new equipment
        const newEquipment = await Equipment.create({
            serial_code,
            model,
            make,
            equip_type,
            purchase_date,
            checkout_status,
            health,
            firmware_update,
            total_days_inuse: total_days_inuse === null ? null : parseInt(total_days_inuse),
            notes
        });

        res.status(201).json({
            success: true,
            message: 'Equipment added successfully',
            equipment: newEquipment
        });
        
    } catch (error) {
        console.error('Error adding equipment:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add equipment',
            error: error.message
        });
    }
}

exports.deleteEquipment = async (req, res) => {
    try {
        const equipmentId  = req.params.id;

        console.log('Going to delete equipment with ID:', equipmentId);

        await Equipment.destroy({ where: {id: equipmentId}});

        res.json({ 
            success: true, 
            message: 'Equipment deleted successfully' 
        });
    } catch (error) {
        console.error('Error deleting equipment:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to delete equipment',
            error: error.message 
        });
    }
};

exports.updateEquipment = async (req, res) => {
    const { serial_code } = req.params;
    const updateData = req.body;
    
    console.log('Update request received for serial_code:', serial_code);
    console.log('Update data:', updateData);

    try {
        const equipment = await Equipment.findOne({ where: { serial_code } });
        
        if (!equipment) {
            console.log('Equipment not found for serial_code:', serial_code);
            return res.status(404).json({ message: 'Equipment not found' });
        }

        // Update the equipment with the new data
        await equipment.update(updateData);
        console.log('Equipment updated successfully');

        res.json({ message: 'Equipment updated successfully', equipment });
    } catch (error) {
        console.error('Error updating equipment:', error);
        res.status(500).json({ message: 'Failed to update equipment', error: error.message });
    }
};

module.exports = {
    showInventory: exports.showInventory,
    searchEquipment: exports.searchEquipment,
    toggleEquipmentStatus: exports.toggleEquipmentStatus,
    addEquipment: exports.addEquipment,
    deleteEquipment: exports.deleteEquipment,
    updateEquipment: exports.updateEquipment,
};