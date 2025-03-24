const { exec } = require('child_process');

/**
 * Exécute les seeders de la base de données de manière asynchrone
 * @returns {Promise} Une promesse résolue lorsque les seeders sont terminés
 */
const runSeeders = () => {
  return new Promise((resolve, reject) => {
    console.log('🌱 Starting seeders...');
    exec('npx sequelize-cli db:seed:all', (error, stdout, stderr) => {
      if (error) {
      console.error('❌ Error while running seeders:');
      console.error(`   Message: ${error.message}`);
      if (stderr) console.error(`   Details: ${stderr}`);
      reject(error);
      return;
      }
      console.log('✅ Seeders executed successfully:');
      console.log(stdout);
      resolve();
    });
  });
};

module.exports = {
  runSeeders
};