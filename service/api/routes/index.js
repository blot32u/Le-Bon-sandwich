const express = require('express');
const router = express.Router();
const db = require("../db.js");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET  commande JSON. */
router.get('/commandes', async (req, res, next) =>{
  try {
    const commandes = await db('commande');
    res.json(commandes);
  } catch (error) {
    res.status(500).send({
      "type": "error",
      "error": 500,
      "message": "Internal Server Error"
      });   
  }
});

/* GET  commande JSON with specific ID */
router.get('/commandes/:id', async(req, res) =>{
  try {
    const commandes = await db('commande');
    const commande = commandes.find(item => item.id === req.params.id);
    if(commande == null || commande == "undefined"){
      res.status(404).send({
      "type": "error",
      "error": 404,
      "message": "ressource non disponible : /commandes/" + req.params.id + "/"
      });
    }
    else{
      res.json(commande);
    }
  } catch (error) {
    res.status(500).send({
      "type": "error",
      "error": 500,
      "message": "Internal Server Error"
      });   
  }
});

/* GET  items JSON of specific commande with specific ID */
router.get('/commandes/:id/items', async(req, res) =>{
  try {
    const items = await db('item')
    .where('command_id', '=', req.params.id).catch(e => res.status(500).json(e))
    .then(u => res.status(!!u?200:404).send({
      "succes": "id command not found",
      "message": "NO CONTENT"
    }));
    res.json(items);
    }
    catch (error) {
    res.status(500).send({
      "type": "error",
      "error": 500,
      "message": "Internal Server Error"
      });   
  }
});

/*PUT Insertion d'une nouvelle commande*/
router.put('/commandes/:id', async(req, res) =>{
  try {
       await db('commande').where('id', '=', req.params.id)
       .update({
         nom: req.body.nom,
         mail: req.body.mail,
         livraison: req.body.livraison
       })
       .then(u => res.status(!!u?200:404).send({
         "succes": u,
         "message": "NO CONTENT"
       }))
       .catch(e => res.status(500).json(e));
     }
    catch (error) {
     res.status(500).send({
       "type": "error",
       "error": 500,
       "message": "Internal Server Error"
       });   
   }
 })

 
/*Gestion d'erreurs route inconnu*/
router.get('*', function(req, res){
  res.status(400).send({
  "type": "error",
  "error": 400,
  "message": "BAD REQUEST"}
  ); 
});



module.exports = router;
