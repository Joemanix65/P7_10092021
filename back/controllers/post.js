const dbConn = require("../config/db");

exports.create =  (req, res, next) => {
    let post = {
        ...req.body,
    };
    console.log(post);
    dbConn.query(
      "INSERT INTO posts SET ?",
      post,
      function (error, results, fields) {
        if (error) {
          res.send({
            code: 400,
            failed: "Problème lors de la création du post !",
            error: error,
          });
        } else {
          res.send({
            code: 200,
            success: "Post créé !",
          });
        }
      }
    );
  };

exports.findAll = function (req, res, next) {
  dbConn.query("SELECT * FROM posts", (err, rows) => {
    if (err) {
      res.send({
        message: "Une erreur est survenue !",
      });
      } else {
        res.send({
          status: 1,
          messages: "Liste des posts : ",
          data: rows,
        });
      }
    });
  };

exports.findById = function (req, res, next) {
  dbConn.query(
    "SELECT * FROM posts WHERE id_post=?",
    [req.params.id],
    (err, rows) => {
      if (err) {
        res.send({
          message: "Une erreur est survenue !",
        });
        } else {
          res.send({
            status: 1,
            messages: "Posts trouvé: ",
            data: rows,
          });
        }
      }
    );
  };

exports.updateById = (req, res, next) => {
  const id = req.params.id
  let post = {
    ...req.body,  
  }
  console.log(req.params.id);
    dbConn.query(
      "UPDATE posts SET ? WHERE id_post=?",[post,id], (err, rows) => {
        if (err) {
          res.send({
            message: "Une erreur de modif est survenue !",
          });
          } else {
            res.send({
            status: 1,
            messages: "Post modifié: ",
            data: rows,
            });
          }
        })
      }
     
exports.delete = function (req, res, next) {
  let post = {
    ...req.body,  
  }
  console.log(req.body);
  /*if (req.body.id_user && req.body.id_user !== post.id_user ) {
    throw 'User id non valide !';
} else {
    next();   
}*/
  dbConn.query(
    "DELETE FROM posts WHERE id_post = ?",
      [req.params.id],
        (err, rows) => {
          if (!err) res.send("suppression du post avec succés !");
          else console.log(err);
        }
      );
    };      