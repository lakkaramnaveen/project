// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const userService = require('../services/userService');

/**
 * @route   POST /api/users
 * @desc    Create a new user (onboarding step 1)
 * @access  Public (adjust with auth if needed)
 */
router.post('/', async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    // Return 400 for validation or known errors
    const status = error.statusCode || 400;
    const message = error.message || 'Failed to create user';
    return res.status(status).json({ error: message });
  }
});

/**
 * @route   PUT /api/users/:id
 * @desc    Update existing user onboarding data (steps 2 & 3)
 * @access  Public (adjust with auth if needed)
 */
router.put('/:id', async (req, res) => {
  const { id } = req.params;

  // Build update payload with only provided fields
  const allowedFields = [
    'email',
    'password',
    'aboutMe',
    'birthdate',
    'street',
    'city',
    'state',
    'zip',
    'step',
  ];

  const dataToUpdate = {};

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      dataToUpdate[field] = field === 'birthdate' ? new Date(req.body[field]) : req.body[field];
    }
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id, 10) },
      data: dataToUpdate,
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(400).json({ error: 'Failed to update user' });
  }
});

/**
 * @route   GET /api/users
 * @desc    Fetch all users (for data table)
 * @access  Public (adjust with auth if needed)
 */
router.get('/', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
