const express = require('express');
const { default: knex } = require('knex');
const router = express.Router();
const db = require("../db.js");
const { v4: uuidV4 } = require('uuid');
const generateAccessToken = require('../token.js');
const schema = require('../schema.js');


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
      if(req.query.embed === "items"){
        const items = await db('item')
       .where({command_id: req.params.id });
        commande.items = items;
      }
      if(req.query.token === commande.token){
        const items =  {items:"href : /commandes/" + req.params.id + "/items/"};
        const self = {self : "href : /commandes/" + req.params.id + "/items/"};
        console.log(req.query.token);
        const links = {items, self};
        commande.links = links;
        res.json(commande);
      }else{
        res.json({
          "type": "error",
          "message": "Incorrect Token"
          });   
      }
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
    .where({command_id: req.params.id });
    if(items == null || items == "undefined" || items == ""){
      res.status(404).send({
      "type": "error",
      "error": 404,
      "message": "ressource non disponible : /commandes/" + req.params.id + "/items"
      });
    }else{
      res.json(items);
    }
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

/*Création commandes*/
router.post('/commandes', async(req, res) =>{
  let ts = Date.now();
  let date_ob = new Date(ts);
  const nowDate =  date_ob.getFullYear() + "-" + (date_ob.getMonth() + 1) + "-" + date_ob.getDate() + " " + date_ob.getHours() + ":" + date_ob.getMinutes();
  const letterNumber = /^[0-9a-zA-Z]+$/;
  if(schema.validate(req.body).error){
    res.json({ 
      "type": schema.validate(req.body).error.message,
      "message": "Format de champs incorrects"
    });
  }
  else{
  try {
    const uid = uuidV4.v4(); 
    const token = generateAccessToken({ string: uid  });
    var montant = 0;
    
    //Insertion des items
    for (const item of req.body.items) {
      await db('item').insert({
        "uri" : item.uri,
        "quantite" : item.q,
        "libelle" : item.libelle,
        "tarif" : item.tarif,
        "command_id" : uid
        });
        montant+= item.tarif;
    }
    
    //Insertion de la commande
    await db('commande').insert({
      "nom" : req.body.nom,
      "montant" : montant,
      "mail": req.body.mail,
      "livraison" : req.body.livraison.date + " " + req.body.livraison.heure,
      "created_at" : nowDate,
      "token" : token,
      "id" : uid
      });
      
    //Retour de la commande
    res.json({ 
      "commande": {
      "nom": req.body.nom,
      "mail": req.body.mail,
      "date_livraison": req.body.livraison.date + " " + req.body.livraison.heure,
      "created_at" : nowDate,
      "id": uid,
      "token":
      token,
      "montant": montant
      }            
    })
      }
    
    catch (error) {
    res.status(500).send({
      "type": error.message,
      "error": 500,
      "message": "Internal Server Error"
      });   
  }
}
});




module.exports = router;
