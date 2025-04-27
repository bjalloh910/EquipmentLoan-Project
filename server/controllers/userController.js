const { User } = require('../models');
const { Op } = require('sequelize');

exports.showUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.render('usersList', { users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Failed to load users');
    }
}

exports.searchUsers = async (req, res) => {
    res.set('Cache-Control', 'no-store'); // Prevent caching so you can see the latest results
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.redirect('/users');
        }

        // Split the query into words to search for each word separately
        const searchTerms = query.split(/\s+/).filter(term => term.length > 0);

        // Create an array of conditions for each search term
        const conditions = searchTerms.map(term => ({
            [Op.or]: [
                { personnel_name: { [Op.like]: `%${term}%` } },
                { contact_type: { [Op.like]: `%${term}%` } },
                { email: { [Op.like]: `%${term}%` } },
                { personnel_number: { [Op.like]: `%${term}%` } }
            ]
        }));

        // Use AND between all terms (all terms must match)
        const searchResults = await User.findAll({
            where: {
                [Op.and]: conditions
            }
        });

        res.render('usersList', { 
            users: searchResults,
            searchQuery: query
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).send('Failed to perform search');
    }
}

exports.createUser = async (req, res) => {
    try {
        const {
            user_name,
            contact_type,
            custom_contact_type,
            email,
            user_number,
        } = req.body;

        // Validate required fields
        if (!user_name || !contact_type || !email || !user_number) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        // Check if user already exists 
        const existingUser = await User.findOne({ 
            where: {
                [Op.or]: [
                    { email: email },
                    { personnel_number: user_number }
                ]
            }
        });

        if (existingUser) {
            return res.status(400).json({ error: 'User with this email or 99 number already exists' });
        }

        // Use custom contact type if provided
        const finalContactType = (contact_type === 'Other' && custom_contact_type) 
            ? custom_contact_type 
            : contact_type;

        // Create new user in database
        const newUser = await User.create({
            personnel_name: user_name,
            contact_type: finalContactType,
            email: email,
            personnel_number: user_number
        });

        return res.status(201).json({ 
            success: true, 
            message: 'User created successfully',
            user: newUser
        });
    } catch (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ 
            success: false, 
            error: 'Failed to create user',
            message: error.message
        });
    }
}

exports.updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);

        if(!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        const {
            user_name,
            contact_type,
            custom_contact_type,
            email,
            user_number
        } = req.body;

        // Use custom contact type if provided
        const finalContactType = (contact_type === 'Other' && custom_contact_type) 
            ? custom_contact_type 
            : contact_type;

        // Update user with the new data
        await user.update({
            personnel_name: user_name,
            contact_type: finalContactType,
            email: email,
            personnel_number: user_number
        });

        // send the updated user data as json
        return res.json({
            success: true,
            message: 'User updated successfully',
            user: user
        });
    } catch (error) {
        console.error('Error updating user:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to update user',
            message: error.message
        });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);

        if(!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        await User.destroy({ where: {id: userId}});
        return res.json({
            success: true,
            message: 'User deleted successfully'
        });   
    } catch (error) {
        console.error('Error deleting user:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to delete user',
            message: error.message
        });
    }
}

exports.getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                error: 'User not found'
            });
        }

        return res.json(user);
    } catch (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({
            success: false,
            error: 'Failed to fetch user',
            message: error.message
        });
    }
};

module.exports = {
    showUsers: exports.showUsers,
    searchUsers: exports.searchUsers,
    createUser: exports.createUser,
    updateUser: exports.updateUser,
    deleteUser: exports.deleteUser,
    getUserById: exports.getUserById
}

