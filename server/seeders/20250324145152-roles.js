'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [
      {
        id: 1,
        roleName: 'user',
        roleDescription: 'Regular user with basic privileges',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        roleName: 'editor',
        roleDescription: 'Can create and edit content',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        roleName: 'admin',
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
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
