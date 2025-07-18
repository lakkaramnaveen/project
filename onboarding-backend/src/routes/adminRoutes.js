const express = require('express');
const router = express.Router();
const adminService = require('../services/adminService');

// @route   GET /api/admin/config
// @desc    Fetch component configuration for onboarding UI
router.get('/', async (req, res) => {
  try {
    const config = await adminService.getConfig();
    res.json(config);
  } catch (error) {
    console.error('Error fetching config:', error);
    res.status(500).json({ message: 'Failed to fetch config' });
  }
});

// @route   POST /api/admin/config
// @desc    Update or insert configuration for components
router.post('/', async (req, res) => {
  const { components } = req.body;

  if (!Array.isArray(components)) {
    return res.status(400).json({ error: 'Invalid input: components must be an array' });
  }

  try {
    const results = await Promise.all(
      components.map(component => adminService.updateConfig(component))
    );
    res.status(200).json({ message: 'Config updated', data: results });
  } catch (err) {
    console.error('Error updating config:', err);
    res.status(500).json({ error: 'Failed to update config' });
  }
});

module.exports = router;
