const express = require('express'); // instance du serveur
const cors = require('cors'); // permet de faire des requetes entre serveurs
const app = express(); //cela permet de faire les requetes servers

// Appliquer CORS avant les autres middlewares
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { runSeeders } = require('./utils/seeders');
const authRoutes = require('./routes/Auth');
const { auth, checkRole } = require('./middleware/Auth');

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

// Router bookings
const bookingsRouter = require("./routes/Bookings");
app.use("/bookings", bookingsRouter);

// Router roles
const rolesRouter = require("./routes/Roles");
app.use("/roles", rolesRouter);

// Router sports
const sportsRouter = require('./routes/Sports');
app.use('/sports', sportsRouter);

// Router skis
const skisRouter = require('./routes/Skis');
app.use('/skis', skisRouter);

// Router randonnes
const randonnesRouter = require('./routes/Randonnes');
app.use('/randonnes', randonnesRouter);

// Router escalades
const escaladesRouter = require('./routes/Escalades');
app.use('/escalades', escaladesRouter);

// Routes publiques
app.use('/auth', authRoutes);

// Routes protégées par authentification
app.use('/bookings', auth, bookingsRouter);

// Ligne simplifiée pour les routes admin - accessible uniquement avec le roleId 3
app.use('/admin', auth, checkRole([3]), (req, res, next) => {
  // Simple vérification pour rediriger vers les bons contrôleurs
  const path = req.path.split('/')[1]; // Récupère le premier segment après /admin
  
  if (path === 'users') {
    require('./routes/User')(req, res, next);
  } else if (path === 'prestations') {
    require('./routes/Prestations')(req, res, next);
  } else {
    res.status(404).json({ error: "Route non trouvée" });
  }
});

// Initialisation de la base de données avec étapes détaillées
const initializeDatabase = async () => {
  try {
    console.log('🔄 Starting synchronization with the database...');
    // force = true, allows deleting existing tables and recreating them
    // alter = true, allows modifying tables
    // SET FOREIGN_KEY_CHECKS = 0; allows to disable foreign key checks when recreating tables
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await db.sequelize.sync({ force: true });
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
    console.log('🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵✅ Tables created successfully🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵🔵');
    
    // Check if seeders need to be executed
    console.log('🔍 Checking existing data...');

    // Vérifier si les tables existent et sont remplies
    try {
      // Vérifier si la table Roles existe et contient des données
      const roleCount = await db.sequelize.query(
        "SELECT COUNT(*) as count FROM Roles;",
        { type: db.sequelize.QueryTypes.SELECT }
      ).then(result => result[0].count);
      
      console.log(`   Roles found: ${roleCount}`);
      
      if (roleCount === 0) {
        console.log('   No roles found, executing seeders\n');
        try {
          const result = await runSeeders();
          console.log(`✅ Seeders executed successfully (Total time: ${result.totalTimeMs}ms)`);
        } catch (seedError) {
          console.error('❌ Error during seeding:', seedError.message);
          // Arrêter l'application si les seeders échouent
          process.exit(1);
        }
      } else {
        console.log('   Roles found, seeders not needed');
      }
    } catch (error) {
      // Si l'erreur est de type "table doesn't exist", c'est normal après un sync force
      if (error.message.includes("doesn't exist") || error.message.includes("no such table")) {
        console.log('   Tables not found (normal after force sync), executing seeders');
        try {
          const result = await runSeeders();
          console.log(`✅ Seeders executed successfully (Total time: ${result.totalTimeMs}ms)`);
        } catch (seedError) {
          console.error('❌ Error during seeding:', seedError.message);
          console.error('   Details:', seedError);
          // Arrêter l'application si les seeders échouent
          process.exit(1);
        }
      } else {
        // Autre type d'erreur (connexion, etc.)
        console.error('❌ Database error:', error.message);
        process.exit(1);
      }
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