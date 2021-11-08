const mysql = require('mysql');


const dbConn = mysql.createConnection({
    host: "localhost",
    database: "p7base",
    user: "root",
    password: ""
});

dbConn.connect(function(error){
  if (error){
    throw error;
  }else{
    console.log("Connexion à mySql réussie !");
  }
});

/*dbConn.query('SELECT id_user, email, password from users', function(error, results, fields){
  if(error)
  throw error;
  results.forEach(result => {
    console.log(result)
  });
})*/

//connexion.end();

module.exports = dbConn;