var express = require('express');
var router = express.Router();
const db = require("../db.js");
const commandes_list = require("../commandes")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET  commande JSON. */
router.get('/commandes', async (req, res, next) =>{
  var commandes = '';
  try {
    if(!isNaN(req.query.s)){
      commandes = await db('commande').where({status: req.query.s});;
    }else{
      commandes = await db('commande');
    }
    console.log(req.query.size);
    res.json(commandes_list(commandes, commandes.length, req.query.page, req.query.size));
  } catch (error) {
    res.status(500).send({
      "type": "error",
      "error": 500,
      "message": "Internal Server Error"
      });   
  }
});
module.exports = router;
