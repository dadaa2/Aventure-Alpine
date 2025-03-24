'use strict';
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const { v1: uuidv1 } = require('uuid');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Utiliser une transaction pour accélérer le processus
    const transaction = await queryInterface.sequelize.transaction();

    try {
      // Pré-hachage des mots de passe communs (opération coûteuse)
      console.time('Password hashing');
      const adminPassword = await bcrypt.hash('password123', 10);
      const authorPassword = await bcrypt.hash('author', 10);
      const userPassword = await bcrypt.hash('password123', 10);
      console.timeEnd('Password hashing');

      const users = [];
      
      // Admin et auteur
      users.push({
        id: uuidv1(),
        mail: 'admin@example.com',
        pseudo: 'admin',
        password: adminPassword,
        firstName: 'Admin',
        lastName: 'User',
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        zipCode: faker.location.zipCode('#####'),
        roleId: 3, // Admin role
        createdAt: new Date(),
        updatedAt: new Date()
      });

      users.push({
        id: uuidv1(),
        mail: 'author@example.com',
        pseudo: 'author',
        password: authorPassword,
        firstName: 'Author',
        lastName: 'User',
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        zipCode: faker.location.zipCode('#####'),
        roleId: 2, // Author role
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Génération en masse des utilisateurs réguliers
      console.time('Users generation');
      // Vous pouvez réduire ce nombre en développement si nécessaire
      const userCount = process.env.NODE_ENV === 'production' ? 100 : 20;
      
      // Création d'utilisateurs par lots pour une meilleure performance
      const now = new Date();
      
      for (let i = 0; i < userCount; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        
        users.push({
          id: uuidv1(),
          mail: faker.internet.email({ firstName, lastName }),
          pseudo: faker.internet.username({ firstName, lastName }).substring(0, 30), // Limite à 30 caractères
          password: userPassword, // Utilisation du hash pré-calculé
          firstName,
          lastName,
          street: faker.location.streetAddress(),
          city: faker.location.city(),
          zipCode: faker.location.zipCode('#####'),
          roleId: 1, // Regular user role
          createdAt: now,
          updatedAt: now
        });
      }
      console.timeEnd('Users generation');

      // Insertion avec logs de performance
      console.time('Users insertion');
      await queryInterface.bulkInsert('Users', users, { transaction });
      console.timeEnd('Users insertion');
      
      await transaction.commit();
      console.log(`✅ ${users.length} users seeded successfully`);
      
      return Promise.resolve();
    } catch (error) {
      await transaction.rollback();
      console.error('❌ User seeding failed:', error.message);
      return Promise.reject(error);
    }
  },

  async down (queryInterface, Sequelize) {
    // Optimisation de la suppression
    console.time('Users deletion');
    await queryInterface.bulkDelete('Users', null, {});
    console.timeEnd('Users deletion');
  }
};
