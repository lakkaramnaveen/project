const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Retrieves all component configurations ordered by page number ascending.
 * @returns {Promise<Array>} List of component configurations
 */
exports.getConfig = async () => {
  try {
    return await prisma.componentConfig.findMany({
      orderBy: { page: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching component configs:', error);
    throw new Error('Failed to fetch component configs');
  }
};

/**
 * Creates or updates a component configuration.
 * Uses Prisma upsert based on unique `name`.
 * @param {Object} param0 - Component configuration data
 * @param {string} param0.name - Unique component name
 * @param {number} param0.page - Page number (2 or 3)
 * @returns {Promise<Object>} Upserted component config
 * @throws Throws error if input validation fails or DB operation fails
 */
exports.updateConfig = async ({ name, page }) => {
  if (!name || typeof name !== 'string') {
    throw new Error('Invalid or missing component name');
  }
  if (typeof page !== 'number' || ![2, 3].includes(page)) {
    throw new Error('Page must be a number and either 2 or 3');
  }

  try {
    return await prisma.componentConfig.upsert({
      where: { name },
      update: { page },
      create: { name, page },
    });
  } catch (error) {
    console.error('Error upserting component config:', error);
    throw new Error('Failed to update component config');
  }
};
