'use strict';
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const { v1: uuidv1 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const user = [];
    user.push({
      id: uuidv1(),
      mail: 'admin@example.com',
      pseudo: 'admin',
      password: await bcrypt.hash('password123', 10),
      firstName: 'Admin',
      lastName: 'User',
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      zipCode: faker.location.zipCode('#####'),
      roleId: 3, // Admin role
      createdAt: new Date(),
      updatedAt: new Date()
    });

    user.push({
      id: uuidv1(),
      mail: 'author@example.com',
      pseudo: 'author',
      password: await bcrypt.hash('author', 10),
      firstName: 'Author',
      lastName: 'User',
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      zipCode: faker.location.zipCode('#####'),
      roleId: 2, // Author role
      createdAt: new Date(),
      updatedAt: new Date()
    });



    /* Création de 100 utilisateurs réguliers */
    for (let i = 0; i < 100; i++) {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      
      user.push({
        id: uuidv1(),
        mail: faker.internet.email({ firstName, lastName }),
        pseudo: faker.internet.userName({ firstName, lastName }),
        password: await bcrypt.hash('password123', 10),
        firstName,
        lastName,
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        zipCode: faker.location.zipCode('#####'),
        roleId: 1, // Regular user role
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }
    await queryInterface.bulkInsert('Users', user, {});
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
    await queryInterface.bulkDelete('Users', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
