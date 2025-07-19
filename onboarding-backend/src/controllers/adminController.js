const adminService = require('../services/adminService');

/**
 * Controller to handle fetching all onboarding component configurations.
 * GET /api/admin/config
 */
exports.getComponents = async (req, res) => {
  try {
    const components = await adminService.getAll();
    return res.status(200).json(components);
  } catch (error) {
    console.error('Error fetching components:', error);
    return res.status(500).json({ error: 'Failed to fetch components' });
  }
};

/**
 * Controller to handle creating or updating onboarding component configurations.
 * POST /api/admin/config
 * Expected body: { components: ComponentConfig[] }
 */
exports.setComponent = async (req, res) => {
  try {
    // Validation can be added here or inside service
    const updated = await adminService.setComponent(req.body);
    return res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating component:', error);
    // Send 400 for client errors, 500 for unexpected errors
    const status = error.statusCode || 400;
    const message = error.message || 'Failed to update component configuration';
    return res.status(status).json({ error: message });
  }
};
