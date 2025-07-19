const express = require('express');
const router = express.Router();
const adminService = require('../services/adminService');

/**
 * @route   GET /api/admin/config
 * @desc    Fetch component configuration for onboarding UI
 * @access  Public (adjust as needed)
 */
router.get('/', async (req, res) => {
  try {
    const config = await adminService.getConfig();
    return res.status(200).json(config);
  } catch (error) {
    console.error('Error fetching config:', error);
    return res.status(500).json({ error: 'Failed to fetch config' });
  }
});

/**
 * @route   POST /api/admin/config
 * @desc    Update or insert configuration for components
 * @access  Public (adjust as needed)
 */
router.post('/', async (req, res) => {
  const { components } = req.body;

  if (!Array.isArray(components)) {
    return res.status(400).json({ error: 'Invalid input: components must be an array' });
  }

  try {
    // Update each component configuration concurrently
    const results = await Promise.all(
      components.map((component) => adminService.updateConfig(component))
    );

    return res.status(200).json({
      message: 'Configuration updated successfully',
      data: results,
    });
  } catch (error) {
    console.error('Error updating config:', error);
    return res.status(500).json({ error: 'Failed to update config' });
  }
});

module.exports = router;
