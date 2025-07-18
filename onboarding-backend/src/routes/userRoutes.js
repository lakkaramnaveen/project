// routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const userService = require('../services/userService');

// @route   POST /api/users
// @desc    Create a new user (onboarding step 1)
router.post('/', async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// @route   PUT /api/users/:id
// @desc    Update existing user onboarding data (steps 2 & 3)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const {
    email,
    password,
    aboutMe,
    birthdate,
    street,
    city,
    state,
    zip,
    step,
  } = req.body;

  const dataToUpdate = {};
  if (email !== undefined) dataToUpdate.email = email;
  if (password !== undefined) dataToUpdate.password = password;
  if (aboutMe !== undefined) dataToUpdate.aboutMe = aboutMe;
  if (birthdate !== undefined) dataToUpdate.birthdate = new Date(birthdate);
  if (street !== undefined) dataToUpdate.street = street;
  if (city !== undefined) dataToUpdate.city = city;
  if (state !== undefined) dataToUpdate.state = state;
  if (zip !== undefined) dataToUpdate.zip = zip;
  if (step !== undefined) dataToUpdate.step = step;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: dataToUpdate,
    });

    res.json(updatedUser);
  } catch (error) {
    console.error('Update error:', error);
    res.status(400).json({ error: 'Failed to update user' });
  }
});

// @route   GET /api/users
// @desc    Fetch all users (for data table)
router.get('/', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
