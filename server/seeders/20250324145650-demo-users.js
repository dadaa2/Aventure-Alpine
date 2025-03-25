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
      console.time('Password hashing for fixed users');
      const adminPassword = await bcrypt.hash('password123', 10);
      const authorPassword = await bcrypt.hash('author', 10);
      const davidUserPassword = await bcrypt.hash('davidddd', 10);
      console.timeEnd('Password hashing for fixed users');

      const users = [];
      
      // Admin, auteur et utilisateur régulier avec mots de passe spécifiques
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

      users.push({
        id: uuidv1(),
        mail: 'david@example.com',
        pseudo: 'davidPseudo',
        password: davidUserPassword,
        firstName: 'Admin',
        lastName: 'User',
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        zipCode: faker.location.zipCode('#####'),
        roleId: 1,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // Génération en masse des utilisateurs réguliers avec mots de passe différents
      console.time('Users generation');
      
      // Vous pouvez réduire ce nombre en développement si nécessaire avec x : n ou x en dev et n en prod
      const userCount = process.env.NODE_ENV === 'production' ? 200 : 0;
      
      // Pré-générer les mots de passe pour traitement par lots
      console.time('Generate password list');
      // Générer une liste de mots de passe aléatoires
      const passwordList = Array.from({ length: userCount }, () => 
        faker.internet.password({ length: 8, memorable: true })
      );
      console.timeEnd('Generate password list');
      
      // Hasher tous les mots de passe en parallèle pour une meilleure performance
      console.time('Batch password hashing');
      // Utiliser un facteur de coût moins élevé pour les données de test
      const costFactor = process.env.NODE_ENV === 'production' ? 10 : 8;
      
      // Hasher tous les mots de passe en parallèle (Promise.all est plus rapide)
      const hashedPasswords = await Promise.all(
        passwordList.map(pwd => bcrypt.hash(pwd, costFactor))
      );
      console.timeEnd('Batch password hashing');
      
      // Création d'utilisateurs par lots pour une meilleure performance
      console.time('Users object creation');
      const now = new Date();
      
      for (let i = 0; i < userCount; i++) {
        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        
        users.push({
          id: uuidv1(),
          mail: faker.internet.email({ firstName, lastName }),
          pseudo: faker.internet.username({ firstName, lastName }).substring(0, 30),
          password: hashedPasswords[i], // Utiliser le hash unique pré-calculé
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
      console.timeEnd('Users object creation');
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