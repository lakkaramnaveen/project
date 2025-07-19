const userService = require('../services/userService');

/**
 * Create a new user.
 * POST /api/users
 */
exports.createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    // Assuming validation errors throw with statusCode or default to 400
    const status = error.statusCode || 400;
    const message = error.message || 'Failed to create user';
    return res.status(status).json({ error: message });
  }
};

/**
 * Update user data by ID.
 * PUT /api/users/:id
 */
exports.updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    const status = error.statusCode || 400;
    const message = error.message || 'Failed to update user';
    return res.status(status).json({ error: message });
  }
};

/**
 * Get all users.
 * GET /api/users
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
};
