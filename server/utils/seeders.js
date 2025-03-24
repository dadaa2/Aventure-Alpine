const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Exécute les seeders de la base de données de manière asynchrone
 * @returns {Promise} Une promesse résolue lorsque les seeders sont terminés
 */
const runSeeders = async () => {
  console.log('🌱 Starting seeders...');
  const totalStartTime = Date.now();
  
  try {
    // Trouver tous les fichiers de seed
    const seedersDir = path.join(__dirname, '..', 'seeders');
    const seedFiles = fs.readdirSync(seedersDir).filter(file => 
      file.endsWith('.js') && !file.startsWith('.')
    ).sort();
    
    // Exécuter les seeders un par un
    for (const seedFile of seedFiles) {
      console.log(`📥 Running seeder: ${seedFile}`);
      const startTime = Date.now();
      
      try {
        const output = execSync(`npx sequelize-cli db:seed --seed ${seedFile}`, { 
          encoding: 'utf-8' 
        });
        
        const elapsedMs = Date.now() - startTime;
        console.log(`✅ Seeder ${seedFile} completed successfully (Elapsed time: ${elapsedMs}ms)\n`);
      } catch (seedError) {
        const elapsedMs = Date.now() - startTime;
        console.error(`❌ Error in seeder ${seedFile} (Elapsed time: ${elapsedMs}ms):`, seedError.message);
        if (seedError.stderr) console.error('   Details:', seedError.stderr);
        throw new Error(`Seeder ${seedFile} failed: ${seedError.message}`);
      }
    }
    
    const totalElapsedMs = Date.now() - totalStartTime;
    return { success: true, totalTimeMs: totalElapsedMs };
  } catch (error) {
    const totalElapsedMs = Date.now() - totalStartTime;
    console.error(`❌ Error while running seeders (Total time: ${totalElapsedMs}ms):`, error.message);
    throw error;
  }
};

module.exports = {
  runSeeders
};