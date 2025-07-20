const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Finds or creates a user by email (step 1).
 * @param {Object} payload - email & password
 * @returns {Object} existing or new user
 * @throws {Error} if missing email/password
 */
exports.createUser = async ({ email, password }) => {
  if (!email || !password) {
    const err = new Error('Email and password are required');
    err.statusCode = 400;
    throw err;
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return existingUser;
  }

  return prisma.user.create({
    data: {
      email,
      password, // hash in production 🛡
      step: 1,
    },
  });
};

/**
 * Updates user data (steps 2 & 3).
 * @param {string} id - user ID
 * @param {Object} data - fields to update
 * @returns {Object} updated user
 * @throws {Error} on invalid ID
 */
exports.updateUser = async (id, data) => {
  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    const err = new Error('Invalid user ID');
    err.statusCode = 400;
    throw err;
  }

  // Convert birthdate string to Date object if it exists
  if (data.birthdate) {
    // If it's already a Date object, this does nothing harmful
    data.birthdate = new Date(data.birthdate);

    // Check if invalid date
    if (isNaN(data.birthdate.getTime())) {
      const err = new Error('Invalid birthdate format');
      err.statusCode = 400;
      throw err;
    }
  }

  return prisma.user.update({
    where: { id: userId },
    data: {
      ...data,
      // optionally ensure step updates or keep as is
      step: data.step ?? undefined,
    },
  });
};

/**
 * Retrieves all users.
 * @returns {Array<Object>}
 */
exports.getAllUsers = async () => {
  return prisma.user.findMany({ select: { id: true, email: true } });
};
