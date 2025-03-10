const express = require('express'); // instance du serveur
const app = express(); 
//cela permet de faire les requetes servers

app.listen(3002, () => {
  console.log('Server is running on port 3002');
});
//cela permet de lancer le serveur sur le port 3002 et d'afficher un message dans la console
