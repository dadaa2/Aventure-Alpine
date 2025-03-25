'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      {
        id: 1,
        roleName: 'User',
        roleDescription: 'Regular user with basic privileges',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        roleName: 'Editor',
        roleDescription: 'Can create and edit content',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        roleName: 'Admin',
        roleDescription: 'Has full access to all features',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
  },

  async down (queryInterface, Sequelize) {

  }
};
