const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Creates a new user if email doesn't exist, otherwise returns existing user.
 * @param {Object} payload - Object containing email and password
 * @returns {Promise<Object>} Created or existing user
 */
exports.createUser = async ({ email, password }) => {
  if (!email || !password) {
    throw new Error('Email and password are required');
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });

  if (existingUser) {
    return existingUser;
  }

  return prisma.user.create({
    data: {
      email,
      password, // Consider hashing in production
    },
  });
};

/**
 * Updates user onboarding data for steps 2 & 3.
 * @param {string|number} id - User ID
 * @param {Object} data - Partial user fields to update
 * @returns {Promise<Object>} Updated user object
 */
exports.updateUser = async (id, data) => {
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    throw new Error('Invalid user ID');
  }

  // Optional: whitelist fields that are allowed to be updated
  return prisma.user.update({
    where: { id: userId },
    data,
  });
};

/**
 * Fetches all users for admin view or data table.
 * @returns {Promise<Array>} List of users
 */
exports.getAllUsers = async () => {
  return prisma.user.findMany();
};
