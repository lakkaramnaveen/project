const adminService = require('../services/adminService');

/**
 * Get all component configurations.
 */
exports.getComponents = async (req, res) => {
  try {
    const components = await adminService.getAll();
    res.json(components);
  } catch (error) {
    console.error('Error fetching components:', error);
    res.status(500).json({ error: 'Failed to fetch components' });
  }
};

/**
 * Create or update a component configuration.
 */
exports.setComponent = async (req, res) => {
  try {
    const updated = await adminService.setComponent(req.body);
    res.json(updated);
  } catch (error) {
    console.error('Error updating component:', error);
    res.status(400).json({ error: error.message });
  }
};
