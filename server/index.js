const express = require('express'); // instance du serveur
const app = express(); //cela permet de faire les requetes servers
const cors = require('cors') // permet de faire des requetes entre serveurs

app.use(cors());
app.use(express.json());

const db = require('./models'); 

// Router users
const usersRouter = require("./routes/User");
app.use("/users", usersRouter);

// Router articles
const articlesRouter = require("./routes/Articles");
app.use("/articles", articlesRouter);








//Lance le serveur sur port 3002, crée une instance de sequelize et synchronise la base de données

db.sequelize.sync(
  { force: true }
    ).then(() => {  
  app.listen(3002, () => {
    console.log('Server is running on port 3002 and database is synchronized'); 
  });
  
}); 