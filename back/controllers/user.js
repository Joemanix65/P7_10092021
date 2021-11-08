const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const dbConn = require("../config/db");
const fs = require("fs");
require("dotenv").config();

exports.signup = async (req, res, next) => {
  const password = req.body.password;
  const encryptedPassword = await bcrypt.hash(password, saltRounds);
  let users = {
    nom: req.body.nom,
    prenom: req.body.prenom,
    fonction: req.body.fonction,
    email: req.body.email,
    password: encryptedPassword,
    photo_url: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  };
  //console.log(users);
  dbConn.query(
    "INSERT INTO users SET ?",
    users,
    function (error, results, fields) {
      if (error) {
        res.send({
          code: 400,
          failed: "Problème lors de l'inscription !",
          error: error,
        });
      } else {
        res.send({
          code: 200,
          success: "Utilisateur créé !",
        });
      }
    }
  );
};

exports.login = async function (req, res, next) {
  const email = req.body.email;
  const password = req.body.password;
  //const id_user = '';
  dbConn.query(
    "SELECT id_user, email, password from users WHERE email = ?",
    [email],
    async function (error, results, fields) {
      if (error) {
        res.send({
          code: 400,
          failed: "error ocurred",
        });
      } else {
        if (results.length > 0) {
          const comparision = await bcrypt.compare(
            password,
            results[0].password
          );
          //console.log(results[0].id_user);
          if (comparision) {
            res.status(200).json({
              userId: results[0].id_user,
              token: jwt.sign(
                { userId: results[0].id_user },
                process.env.TOKEN_SECRET,
                { expiresIn: "24h" }
              ),
            });
          } else {
            res.send({
              code: 204,
              success: "Email and password does not match",
            });
          }
        } else {
          res.send({
            code: 206,
            success: "Email does not exits",
          });
        }
      }
    }
  );
};

/*throw error;
      results.forEach(result => {
        console.log(result)
        console.log("email ici: " + email),
        
     
      bcrypt.compare(req.body.password, result.password)
      .then(valid => {
            if (!valid) {
                return res.status(401).json({ error: 'Mot de passe incorrect !'});
            } console.log("id_user ici: " + result.id_user)
            res.status(200).json({
                userId: id_user,
                token: jwt.sign(
                  console.log(userId),
                    { userId: id_user },
                        process.env.TOKEN_PASS,
                    { expiresIn: '24h' }
                    
                )
               
            });console.log(token)
        })    
        .catch(error1 => res.status(500).json({error1}))
    })  
  })
  };*/

/* if (result.length > 0) {
          const comparision =  bcrypt.compare(
            password,
            results[0].password,
            console.log(results[0].password)
          );
          console.log("email dans req: " + email);
          console.log(id_user);
          if (comparision) {
            res.status(200).json({
             
              userId: id_user,
              
              token: jwt.sign(
                { userId: id_user },
                process.env.TOKEN_SECRET,
                { expiresIn: "24h" }
              ),
            });
          } else {
            res.send({
              code: 204,
              success: "Email and password does not match",
            });
          }
        } else {
          res.send({
            code: 206,
            success: "Email does not exits",
          });
        }
      
    
  });
  };*/

exports.findAll = function (req, res, next) {
  dbConn.query("SELECT * FROM users", (err, rows) => {
    if (err) {
      res.send({
        message: "Une erreur est survenue !",
      });
    } else {
      res.send({
        status: 1,
        messages: "Liste des utilisateurs: ",
        data: rows,
      });
    }
  });
};

exports.findById = function (req, res, next) {
  dbConn.query(
    "SELECT * FROM users WHERE id_user=?",
    [req.params.id],
    console.log(req.params.id),
    (err, rows) => {
      if (err) {
        res.send({
          message: "Une erreur est survenue !",
        });
      } else {
        res.send({
          status: 1,
          messages: "Utilisateur trouvé: ",
          data: rows,
        });
      }
    }
  );
};

exports.updateById = async (req, res, next) => {
  const password = req.body.password;
  const encryptedPassword = await bcrypt.hash(password, saltRounds);
  const id = req.params.id;
  let user = {
    nom: req.body.nom,
    prenom: req.body.prenom,
    fonction: req.body.fonction,
    email: req.body.email,
    password: encryptedPassword,
    photo_url: req.body.photo_url,
  };

  if (req.file) {
    user.photo_url = `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`;

    dbConn.query(
      "SELECT * FROM users WHERE id_user=?",
      [req.params.id],
      (err, result) => {
        if (err) {
          return res.status(500).json(err.message);
        }
        const filename = result[0].photo_url.split("/images/")[1];
        //console.log(filename);
        if (filename !== req.file.filename) {
          fs.unlink(`images/${filename}`, () => {
            dbConn.query(
              "UPDATE users SET ? WHERE id_user=?",
              [user, id],
              (err, rows) => {
                if (err) {
                  res.send({
                    message: "Une erreur photo est survenue !",
                  });
                } else {
                  res.send({
                    status: 1,
                    messages: "Utilisateur modifié: ",
                    data: rows,
                  });
                }
              }
            );
          });
        }
      }
    );
  } else {
    let user = {
      ...req.body,
      password: encryptedPassword,
    };
    dbConn.query(
      "UPDATE users SET ? WHERE id_user=?",
      [user, id],
      (err, rows) => {
        if (err) {
          res.send({
            message: "Une erreur modif est survenue !",
          });
        } else {
          res.send({
            status: 1,
            messages: "Utilisateur modifié: ",
            data: rows,
          });
        }
      }
    );
  }
};

/*}{
    //console.log(req.file);
   
    
 
  dbConn.query(
    "UPDATE users SET ? WHERE id_user=?",[user,id], (err, rows) => {
        if (err) {
          res.send({
            message: "Une erreur est survenue !",
          });
        } else {
          res.send({
            status: 1,
            messages: "Utilisateur modifié: ",
            data: rows,
          });
        }
        
        //fs.unlink(`images/${filename}`)
      }
    );
    
  }
  };*/

exports.delete = function (req, res, next) {
  dbConn.query(
    "DELETE FROM users WHERE id_user = ?",
    [req.params.id],
    (err, rows) => {
      if (!err) res.send("suppression de l'utilisateur avec succés !");
      else console.log(err);
    }
  );
};
