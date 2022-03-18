const db = require("./db.js");

function getCommandes (commandes, length, page = 1, size = 10) {
    if(page < 0){
        page = 1;
    }
    var collection = { "type": "collection",
    "count": length,
    "size": 0,
    "commands": []} ;
    const numCommand = ((page-1)*size);
    const slice =  parseInt(numCommand) + parseInt(size);
    for (const commande of commandes.slice(numCommand, slice)) {
        collection.commands.push({ 
            "command": {
            "id": commande.id,
            "nom": commande.nom,
            "livraison": commande.livraison,
            "created_at" : commande.created_at,
            "montant": commande.montant },
            "links" : {
                "self": {"href": "/commands/" + commande.id + "/" }
                    }       
          });
        collection.size += 1;
        }
  return collection;
}

module.exports = getCommandes;