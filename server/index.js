const express = require('express'); // instance du serveur
const app = express(); //cela permet de faire les requetes servers
app.use(express.json());

const db = require('./models'); 

// Router
const usersRouter = require("./routes/Users");
app.use("/users", usersRouter);

//Lance le serveur sur port 3002, crée une instance de sequelize et synchronise la base de données
db.sequelize.sync().then(() => {  
  app.listen(3002, () => {
    console.log('Server is running on port 3002');
  });
});