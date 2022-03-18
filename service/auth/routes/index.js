var express = require('express');
var router = express.Router();
const db = require("../db.js");
const generateAccessToken = require('../token.js');

/* Vérification authentification. */
router.post('/connex', async (req, res, next) =>{
  if(req.headers.authorization != null && req.headers.authorization != 'undefined' ){
    try{
      const authHeader = req.headers.authorization;
      const auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':');
      const user = await db('client')
    .where({
      nom_client: auth[0],
      passwd: auth[1]
    });
    if(user != null && user != "" ){
      res.json({
        "Connexion" : "Connexion reussie",
        "token" : generateAccessToken({string : user.id})
      });
    }else{
      res.json({
        "type": "HTTP Forbidden",
        "error": 401,
        "message": "Connexion refusée"
      })
    }
    }catch (error) {
      res.status(500).send({
      "type": "error",
      "error": 500,
      "message": error.message
      });   
    }
  }
});
module.exports = router;
