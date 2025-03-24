const express = require('express'); // instance du serveur
const app = express(); //cela permet de faire les requetes servers
const cors = require('cors') // permet de faire des requetes entre serveurs
const { runSeeders } = require('./utils/seeders');

app.use(cors());
app.use(express.json());

const db = require('./models'); 

// Router users
const usersRouter = require("./routes/User");
app.use("/users", usersRouter);

// Router articles
const articlesRouter = require("./routes/Articles");
app.use("/articles", articlesRouter);

// Router prestations
const prestationsRouter = require("./routes/Prestations");
app.use("/prestations", prestationsRouter);

// Initialisation de la base de données avec étapes détaillées
const initializeDatabase = async () => {
  try {
    console.log('🔄 Starting synchronization with the database...');
    // force = true, allows deleting existing tables and recreating them
    // alter = true, allows modifying tables
    await db.sequelize.sync({ force: true });
    console.log('✅ Tables created successfully');
    
    // Check if seeders need to be executed
    console.log('🔍 Checking existing data...');
    try {
      const roleCount = await db.Role.count();
      console.log(`   Roles found: ${roleCount}`);
      
      if (roleCount === 0) {
      console.log('   No roles found, executing seeders');
      await runSeeders();
      } else {
      console.log('   Roles found, seeders not needed');
      }
    } catch (error) {
      console.error('❌ Error checking roles:', error.message);
      // If the Role table does not exist yet despite synchronization
      console.log('   Trying even with error...');
      await runSeeders();
    }
    
    // Start the server
    console.log('🚀 Starting server...');
    app.listen(3002, () => {
      console.log('✅ Server running on port: 3002');
      console.log('🌐 Application is live!');
    });
    
    } catch (error) {
    console.error('❌ Fatal error during initialization:', error.message);
    process.exit(1);
  }
};

// Lancer l'initialisation
console.log('🔰 Starting  Aventure-Alpine...');
initializeDatabase();