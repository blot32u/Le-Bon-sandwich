const Joi = require('joi');
 const schema = Joi.object({
    nom: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    livraison: Joi.object().keys({
        date: Joi.date().less('now'),
       
        heure: Joi.string(),
    }),
   
    items: Joi.array()
        .required(),


    mail: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'fr'] } })
})
    
module.exports = schema;