// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const userService = require('../services/userService');

/**
 * POST /api/users
 * Step 1: email & password
 * Returns 409 if user already exists (step > 1)
 */
router.post('/', async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    if (user.step && user.step > 1) {
      return res.status(409).json({ error: 'User already exists', user });
    }
    return res.status(201).json(user);
  } catch (err) {
    console.error('POST /api/users error', err);
    const status = err.statusCode || 500;
    return res.status(status).json({ error: err.message });
  }
});

/**
 * PUT /api/users/:id
 * Steps 2 & 3: update user data
 */
router.put('/:id', async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    return res.status(200).json(user);
  } catch (err) {
    console.error('PUT /api/users/:id error', err);
    const status = err.statusCode || 400;
    return res.status(status).json({ error: err.message });
  }
});

/**
 * GET /api/users
 * Return all users (admin use)
 */
router.get('/', async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (err) {
    console.error('GET /api/users error', err);
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
